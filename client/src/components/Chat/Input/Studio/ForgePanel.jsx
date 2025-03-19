import React, { useState, useEffect, useRef } from 'react';
import { FiX } from "react-icons/fi";

const ForgePanel = ({ isOpen, onClose }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef(null);

  const commonCommands = [
    { name: 'create component', description: 'Generate a new React component' },
    { name: 'optimize code', description: 'Analyze and optimize code performance' },
    { name: 'add feature', description: 'Scaffold a new feature implementation' },
    { name: 'test', description: 'Generate test cases for components' },
    { name: 'refactor', description: 'Refactor selected code for better quality' },
    { name: 'debug', description: 'Analyze and fix issues in your code' },
    { name: 'document', description: 'Generate documentation for your code' },
    { name: 'explain', description: 'Explain how selected code works' }
  ];

  // More advanced command categories
  const commandCategories = [
    {
      name: 'Development',
      commands: [
        { name: 'create component', description: 'Generate a new React component' },
        { name: 'add feature', description: 'Scaffold a new feature implementation' },
        { name: 'create hook', description: 'Generate a custom React hook' },
        { name: 'create context', description: 'Set up a new React context' }
      ]
    },
    {
      name: 'Quality',
      commands: [
        { name: 'optimize code', description: 'Analyze and optimize code performance' },
        { name: 'refactor', description: 'Refactor selected code for better quality' },
        { name: 'test', description: 'Generate test cases for components' },
        { name: 'lint', description: 'Check code for style and quality issues' }
      ]
    },
    {
      name: 'Analysis',
      commands: [
        { name: 'debug', description: 'Analyze and fix issues in your code' },
        { name: 'explain', description: 'Explain how selected code works' },
        { name: 'document', description: 'Generate documentation for your code' },
        { name: 'analyze deps', description: 'Analyze project dependencies' }
      ]
    }
  ];

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Reset history index when panel opens
  useEffect(() => {
    if (isOpen) {
      setHistoryIndex(-1);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        // Close on Escape
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    setOutput(prev => [...prev, { type: 'input', content: command }]);

    try {
      // Simulate CLI response for now
      // In a real implementation, this would connect to your CLI tool
      await new Promise(resolve => setTimeout(resolve, 800));

      let responseContent;
      if (command.includes('create component')) {
        responseContent = `Creating new component...\nComponent created successfully!\n\nFiles generated:\n- src/components/NewComponent.jsx\n- src/components/NewComponent.css`;
      } else if (command.includes('optimize')) {
        responseContent = `Analyzing code performance...\nOptimization complete!\n\nSuggestions:\n- Use React.memo for component memoization\n- Implement virtualization for large lists\n- Consider code splitting for performance gains`;
      } else if (command.includes('add feature')) {
        responseContent = `Scaffolding new feature...\nFeature implementation complete!\n\nAdded files:\n- src/features/NewFeature/\n- src/features/NewFeature/components/\n- src/features/NewFeature/hooks/\n- src/features/NewFeature/utils/`;
      } else if (command.includes('test')) {
        responseContent = `Generating test cases...\nTest suite created!\n\nAdded tests:\n- Component rendering tests\n- State management tests\n- Event handling tests`;
      } else if (command.includes('refactor')) {
        responseContent = `Analyzing code for refactoring...\nRefactoring complete!\n\nImprovements made:\n- Extracted repeated logic into helper functions\n- Simplified complex conditionals\n- Improved variable naming for clarity`;
      } else if (command.includes('debug')) {
        responseContent = `Debugging code...\nAnalysis complete!\n\nPotential issues found:\n- Memory leak in useEffect (missing dependency)\n- Unnecessary re-renders detected\n- Potential race condition in async function`;
      } else if (command.includes('document')) {
        responseContent = `Generating documentation...\nDocumentation created!\n\nDocumentation added:\n- Component API reference\n- Usage examples\n- Props documentation\n- Function descriptions`;
      } else if (command.includes('explain')) {
        responseContent = `Analyzing selected code...\n\nExplanation:\nThis code implements a custom hook that manages state for a form with validation. It uses useReducer to handle complex state transitions and provides a clean API for form handling.`;
      } else if (command.includes('create hook')) {
        responseContent = `Creating custom hook...\nHook created successfully!\n\nFile generated:\n- src/hooks/useCustomHook.js`;
      } else if (command.includes('create context')) {
        responseContent = `Setting up React context...\nContext created successfully!\n\nFiles generated:\n- src/context/NewContext.jsx`;
      } else if (command.includes('lint')) {
        responseContent = `Linting code...\nLint complete!\n\nIssues found:\n- 3 formatting issues\n- 2 unused variables\n- 1 accessibility warning`;
      } else if (command.includes('analyze deps')) {
        responseContent = `Analyzing dependencies...\nAnalysis complete!\n\nFindings:\n- 2 outdated packages\n- 1 security vulnerability\n- 3 unused dependencies`;
      } else {
        responseContent = `Command executed: "${command}"\nOperation completed successfully.`;
      }

      setOutput(prev => [...prev, { type: 'output', content: responseContent }]);

      // Add to history if not already there
      if (!history.includes(command)) {
        setHistory(prev => [command, ...prev].slice(0, 10));
      }
    } catch (error) {
      setOutput(prev => [...prev, {
        type: 'error',
        content: 'Failed to execute command. Please ensure Forge CLI is running.'
      }]);
    }

    setIsProcessing(false);
    setCommand('');
    setHistoryIndex(-1);
  };

  const handleCommandKeyDown = (e) => {
    // Navigate command history with up/down arrows
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
      <div className={`absolute right-0 top-0 bottom-0 w-96 max-w-full bg-white shadow-xl transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="forge-logo text-xl">F</span>
              <h2 className="text-lg font-semibold">Forge CLI</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-300 bg-[#4e4946] rounded-full hover:bg-[#999696] transition"
              aria-label="Close"
            >
              <FiX size={15} /> {/* X icon */}
            </button>
          </div>

          {/* Command Categories */}
          <div className="p-2 border-b overflow-x-auto">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${activeCategory === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              {commandCategories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${activeCategory === category.name
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {activeCategory === 'all'
                ? commonCommands.map(cmd => (
                  <button
                    key={cmd.name}
                    onClick={() => setCommand(cmd.name)}
                    className="p-2 text-left text-sm hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                  >
                    <div className="font-medium">{cmd.name}</div>
                    <div className="text-xs text-gray-500">{cmd.description}</div>
                  </button>
                ))
                : commandCategories
                  .find(cat => cat.name === activeCategory)?.commands
                  .map(cmd => (
                    <button
                      key={cmd.name}
                      onClick={() => setCommand(cmd.name)}
                      className="p-2 text-left text-sm hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                    >
                      <div className="font-medium">{cmd.name}</div>
                      <div className="text-xs text-gray-500">{cmd.description}</div>
                    </button>
                  ))
              }
            </div>
          </div>

          {/* Terminal Output */}
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto bg-gray-900 p-4 font-mono text-sm forge-terminal"
          >
            {output.length === 0 ? (
              <div className="text-gray-500 italic">
                Welcome to Forge CLI. Type a command to get started.
              </div>
            ) : (
              output.map((item, i) => (
                <div
                  key={i}
                  className={`mb-2 ${item.type === 'input' ? 'text-blue-400' :
                      item.type === 'error' ? 'text-red-400' :
                        'text-green-400'
                    }`}
                >
                  {item.type === 'input' ? '> ' : ''}
                  {item.content}
                </div>
              ))
            )}
            {isProcessing && (
              <div className="text-yellow-400 animate-pulse">
                Processing...
              </div>
            )}
          </div>

          {/* Command Input */}
          <form onSubmit={handleCommandSubmit} className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleCommandKeyDown}
                placeholder="Enter Forge command..."
                className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
                autoFocus={isOpen}
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-button-dark text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
              >
                <ion-icon name="terminal-outline"></ion-icon>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgePanel;