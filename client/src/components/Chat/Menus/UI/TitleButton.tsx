import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Trigger } from '@radix-ui/react-popover';
import useLocalize from '~/hooks/useLocalize';

export default function TitleButton({ primaryText = '', secondaryText = '' }) {
  const localize = useLocalize();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Trigger asChild>
      <button
        className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg dark:bg-gray-800 px-3 py-1.5 text-lg font-medium text-white transition-colors duration-200 hover:bg-gray-800 radix-state-open:bg-gray-800"
        aria-label={localize('com_ui_endpoint_menu')}
        aria-expanded={isExpanded}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls="llm-endpoint-menu"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-white"> {primaryText} </span>
          {!!secondaryText && <span className="text-white">{secondaryText}</span>}
        </div>
        <ChevronDown className="text-white size-4" />
      </button>
    </Trigger>
  );
}
