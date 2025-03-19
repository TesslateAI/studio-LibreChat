import { memo, useRef, useMemo, useEffect, useState } from 'react';
import { FiBookOpen, FiSearch, FiTerminal, FiZap } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';
import ForgePanel from "./Studio/ForgePanel";
import PromptLibrary from './Studio/PromptLibrary';
import GithubModal from './Studio/GithubModal';

import {
  supportsFiles,
  mergeFileConfig,
  isAssistantsEndpoint,
  fileConfig as defaultFileConfig,
} from 'librechat-data-provider';
import {
  useChatContext,
  useChatFormContext,
  useAddedChatContext,
  useAssistantsMapContext,
} from '~/Providers';
import {
  useTextarea,
  useAutoSave,
  useRequiresKey,
  useHandleKeyUp,
  useQueryParams,
  useSubmitMessage,
} from '~/hooks';
import { cn, removeFocusRings, checkIfScrollable } from '~/utils';
import FileFormWrapper from './Files/FileFormWrapper';
import { TextareaAutosize } from '~/components/ui';
import { useGetFileConfig } from '~/data-provider';
import { TemporaryChat } from './TemporaryChat';
import TextareaHeader from './TextareaHeader';
import PromptsCommand from './PromptsCommand';
import AudioRecorder from './AudioRecorder';
import { mainTextareaId } from '~/common';
import CollapseChat from './CollapseChat';
import StreamAudio from './StreamAudio';
import StopButton from './StopButton';
import SendButton from './SendButton';
import Mention from './Mention';
import store from '~/store';

const ChatForm = ({ index = 0 }) => {
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showDeepResearch, setShowDeepResearch] = useState(false);
  const [showForgeCLI, setShowForgeCLI] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [githubRepo, setGithubRepo] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('main');

  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useQueryParams({ textAreaRef });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const SpeechToText = useRecoilValue(store.speechToText);
  const TextToSpeech = useRecoilValue(store.textToSpeech);
  const automaticPlayback = useRecoilValue(store.automaticPlayback);
  const maximizeChatSpace = useRecoilValue(store.maximizeChatSpace);
  const [isTemporaryChat, setIsTemporaryChat] = useRecoilState<boolean>(store.isTemporary);

  const isSearching = useRecoilValue(store.isSearching);
  const [showStopButton, setShowStopButton] = useRecoilState(store.showStopButtonByIndex(index));
  const [showPlusPopover, setShowPlusPopover] = useRecoilState(store.showPlusPopoverFamily(index));
  const [showMentionPopover, setShowMentionPopover] = useRecoilState(
    store.showMentionPopoverFamily(index),
  );

  const chatDirection = useRecoilValue(store.chatDirection).toLowerCase();
  const isRTL = chatDirection === 'rtl';

  const { requiresKey } = useRequiresKey();
  const handleKeyUp = useHandleKeyUp({
    index,
    textAreaRef,
    setShowPlusPopover,
    setShowMentionPopover,
  });
  const { handlePaste, handleKeyDown, handleCompositionStart, handleCompositionEnd } = useTextarea({
    textAreaRef,
    submitButtonRef,
    setIsScrollable,
    disabled: !!(requiresKey ?? false),
  });

  const {
    files,
    setFiles,
    conversation,
    isSubmitting,
    filesLoading,
    newConversation,
    handleStopGenerating,
  } = useChatContext();
  const methods = useChatFormContext();
  const {
    addedIndex,
    generateConversation,
    conversation: addedConvo,
    setConversation: setAddedConvo,
    isSubmitting: isSubmittingAdded,
  } = useAddedChatContext();
  const showStopAdded = useRecoilValue(store.showStopButtonByIndex(addedIndex));

  const { clearDraft } = useAutoSave({
    conversationId: useMemo(() => conversation?.conversationId, [conversation]),
    textAreaRef,
    files,
    setFiles,
  });

  const assistantMap = useAssistantsMapContext();
  const { submitMessage, submitPrompt } = useSubmitMessage({ clearDraft });

  const { endpoint: _endpoint, endpointType } = conversation ?? { endpoint: null };
  const endpoint = endpointType ?? _endpoint;

  const { data: fileConfig = defaultFileConfig } = useGetFileConfig({
    select: (data) => mergeFileConfig(data),
  });

  const endpointFileConfig = fileConfig.endpoints[endpoint ?? ''];
  const invalidAssistant = useMemo(
    () =>
      isAssistantsEndpoint(conversation?.endpoint) &&
      (!(conversation?.assistant_id ?? '') ||
        !assistantMap?.[conversation?.endpoint ?? ''][conversation?.assistant_id ?? '']),
    [conversation?.assistant_id, conversation?.endpoint, assistantMap],
  );
  const disableInputs = useMemo(
    () => !!((requiresKey ?? false) || invalidAssistant),
    [requiresKey, invalidAssistant],
  );

  const { ref, ...registerProps } = methods.register('text', {
    required: true,
    onChange: (e) => {
      methods.setValue('text', e.target.value, { shouldValidate: true });
    },
  });

  useEffect(() => {
    if (!isSearching && textAreaRef.current && !disableInputs) {
      textAreaRef.current.focus();
    }
  }, [isSearching, disableInputs]);

  useEffect(() => {
    if (textAreaRef.current) {
      checkIfScrollable(textAreaRef.current);
    }
  }, []);

  const endpointSupportsFiles: boolean = supportsFiles[endpointType ?? endpoint ?? ''] ?? false;
  const isUploadDisabled: boolean = endpointFileConfig?.disabled ?? false;

  const baseClasses = cn(
    'm-0 w-full resize-none bg-[#424242] px-3 py-3 text-gray-200 placeholder-gray-400',
    'rounded-md border border-[#424242] focus:outline-none focus:ring-0',
    isCollapsed ? 'max-h-[52px]' : 'max-h-[400px]',
  );

  const uploadActive = endpointSupportsFiles && !isUploadDisabled;
  const speechClass = isRTL
    ? `pr-${uploadActive ? '12' : '4'} pl-12`
    : `pl-${uploadActive ? '12' : '4'} pr-12`;

  return (
    <>
      <form
        onSubmit={methods.handleSubmit((data) => submitMessage(data))}
        style={{ backgroundColor: '#424242' }}
        className={cn(
          'relative mx-auto flex flex-col justify-center space-y-2 rounded-xl p-3 shadow-sm',
          maximizeChatSpace ? 'w-full max-w-full' : 'md:max-w-2xl xl:max-w-3xl',
        )}
      >
        <div className="flex items-end">
          {showPlusPopover && !isAssistantsEndpoint(endpoint) && (
            <Mention
              setShowMentionPopover={setShowPlusPopover}
              newConversation={generateConversation}
              textAreaRef={textAreaRef}
              commandChar="+"
              placeholder="com_ui_add_model_preset"
              includeAssistants={false}
            />
          )}
          {showMentionPopover && (
            <Mention
              setShowMentionPopover={setShowMentionPopover}
              newConversation={newConversation}
              textAreaRef={textAreaRef}
            />
          )}

          <div className="mr-2 flex flex-col justify-end">
            <PromptsCommand index={index} textAreaRef={textAreaRef} submitPrompt={submitPrompt} />
          </div>

          <div className="relative flex flex-1 flex-col overflow-hidden rounded-md bg-[#343541] text-gray-200">
            <TemporaryChat isTemporaryChat={isTemporaryChat} setIsTemporaryChat={setIsTemporaryChat} />
            <TextareaHeader addedConvo={addedConvo} setAddedConvo={setAddedConvo} />
            <FileFormWrapper disableInputs={disableInputs}>
              {endpoint && (
                <>
                  <CollapseChat
                    isCollapsed={isCollapsed}
                    isScrollable={isScrollable}
                    setIsCollapsed={setIsCollapsed}
                  />
                  <TextareaAutosize
                    {...registerProps}
                    ref={(e) => {
                      ref(e);
                      textAreaRef.current = e;
                    }}
                    disabled={disableInputs}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onHeightChange={() => {
                      if (textAreaRef.current) {
                        const scrollable = checkIfScrollable(textAreaRef.current);
                        setIsScrollable(scrollable);
                      }
                    }}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    id={mainTextareaId}
                    tabIndex={0}
                    data-testid="text-input"
                    rows={1}
                    placeholder="Ask anything..."
                    onFocus={() => isCollapsed && setIsCollapsed(false)}
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    style={{ overflowY: 'auto' }}
                    className={cn(baseClasses, speechClass, removeFocusRings)}
                  />
                </>
              )}
            </FileFormWrapper>

            {SpeechToText && (
              <AudioRecorder
                isRTL={isRTL}
                methods={methods}
                ask={submitMessage}
                textAreaRef={textAreaRef}
                disabled={!!disableInputs}
                isSubmitting={isSubmitting}
              />
            )}
            {TextToSpeech && automaticPlayback && <StreamAudio index={index} />}
          </div>

          <div className="ml-2 flex items-end">
            {(isSubmitting || isSubmittingAdded) && (showStopButton || showStopAdded) ? (
              <StopButton stop={handleStopGenerating} setShowStopButton={setShowStopButton} />
            ) : (
              endpoint && (
                <SendButton
                  ref={submitButtonRef}
                  control={methods.control}
                  disabled={!!(filesLoading || isSubmitting || disableInputs)}
                />
              )
            )}
          </div>
        </div>

        {/* Buttons with icon + text, circular style, gray text */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowPromptLibrary(true)}
            className="flex items-center gap-2 rounded-full bg-[#424242] px-3 py-1 text-sm text-gray-300 hover:bg-[#999696]"
            title="Prompt Library"
          >
            <FiBookOpen />
            <span>Prompt Library</span>
          </button>
          <button
            onClick={() => setShowDeepResearch(true)}
            className="flex items-center gap-2 rounded-full bg-[#424242] px-3 py-1 text-sm text-gray-300 hover:bg-[#999696]"
            title="Deep Research"
          >
            <FiSearch />
            <span>Deep Research</span>
          </button>
          <button
            onClick={() => setShowForgeCLI(true)}
            className="flex items-center gap-2 rounded-full bg-[#424242] px-3 py-1 text-sm text-gray-300 hover:bg-[#999696]"
            title="Forge CLI"
          >
            <FiTerminal />
            <span>Forge CLI</span>
          </button>
          <button
            onClick={() => setShowGitHubModal(true)}
            className="flex items-center gap-2 rounded-full bg-[#424242] px-3 py-1 text-sm text-gray-300 hover:bg-[#999696]"
            title="Github"
          >
            <FiZap />
            <span>Github</span>
          </button>

        </div>
      </form>

      {showPromptLibrary && <PromptLibrary isOpen={showPromptLibrary} onClose={() => setShowPromptLibrary(false)} />}
      {/* {showDeepResearch && <DeepResearch onClose={() => setShowDeepResearch(false)} />} */}
      {showForgeCLI && <ForgePanel isOpen={showForgeCLI} onClose={() => setShowForgeCLI(false)} />}
      {showGitHubModal && (<GithubModal showGitHubModal={showGitHubModal}
        setShowGitHubModal={setShowGitHubModal}
        githubRepo={githubRepo}
        setGithubRepo={setGithubRepo}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />
      )}




    </>
  );
};

export default memo(ChatForm);
