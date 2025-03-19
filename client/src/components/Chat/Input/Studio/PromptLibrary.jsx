import React, { useState } from 'react';
import { FiX } from "react-icons/fi";

const PromptLibrary = ({ isOpen, onClose, onSelectPrompt }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Prompts', icon: 'grid-outline' },
    { id: 'coding', name: 'Coding', icon: 'code-slash-outline' },
    { id: 'analysis', name: 'Analysis', icon: 'analytics-outline' },
    { id: 'writing', name: 'Writing', icon: 'create-outline' },
    { id: 'design', name: 'Design', icon: 'color-palette-outline' },
    { id: 'data', name: 'Data', icon: 'bar-chart-outline' }
  ];

  const prompts = [
    {
      id: 1,
      category: 'coding',
      title: 'Code Review',
      description: 'Review this code for best practices and potential improvements',
      prompt: 'Please review this code and suggest improvements for: ',
      icon: 'code-working-outline'
    },
    {
      id: 2,
      category: 'coding',
      title: 'Bug Fix Helper',
      description: 'Help identify and fix bugs in your code',
      prompt: 'I have a bug in my code. Here are the symptoms: ',
      icon: 'bug-outline'
    },
    {
      id: 3,
      category: 'analysis',
      title: 'Performance Analysis',
      description: 'Analyze code or system performance',
      prompt: 'Can you analyze the performance of this code/system: ',
      icon: 'speedometer-outline'
    },
    {
      id: 4,
      category: 'writing',
      title: 'Documentation Generator',
      description: 'Generate documentation for your code',
      prompt: 'Please generate documentation for this code: ',
      icon: 'document-text-outline'
    },
    {
      id: 5,
      category: 'design',
      title: 'UI Component Design',
      description: 'Get suggestions for UI component design',
      prompt: 'Help me design a UI component for: ',
      icon: 'cube-outline'
    },
    {
      id: 6,
      category: 'data',
      title: 'Data Structure Optimizer',
      description: 'Optimize data structures and algorithms',
      prompt: 'Help me optimize this data structure/algorithm: ',
      icon: 'git-network-outline'
    },
    {
      id: 7,
      category: 'coding',
      title: 'Test Case Generator',
      description: 'Generate comprehensive test cases',
      prompt: 'Generate test cases for this functionality: ',
      icon: 'flask-outline'
    },
    {
      id: 8,
      category: 'writing',
      title: 'API Documentation',
      description: 'Create clear API documentation',
      prompt: 'Write API documentation for: ',
      icon: 'book-outline'
    }
  ];

  const filteredPrompts = selectedCategory === 'all'
    ? prompts
    : prompts.filter(prompt => prompt.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col shadow-xl border border-[#e5e6e3]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#e5e6e3]">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
            <ion-icon name="library-outline"></ion-icon>
            Prompt Library
          </h2>

          <button
            onClick={onClose}
            className="p-1 text-gray-300 bg-[#4e4946] rounded-full hover:bg-[#999696] transition"
            aria-label="Close prompt library"
          >
            <FiX size={15} /> {/* X icon */}
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-4 border-b border-[#e5e6e3] overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${selectedCategory === category.id
                  ? 'bg-[#4e4946] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <ion-icon name={category.icon}></ion-icon>
              {category.name}
            </button>
          ))}
        </div>

        {/* Prompts Grid */}
        <div className="p-4 overflow-y-auto flex-grow bg-chat-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="border border-[#e5e6e3] rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer bg-white hover:transform hover:translate-y-[-2px]"
                onClick={() => onSelectPrompt(prompt.prompt)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <ion-icon name={prompt.icon} size="large" className="text-gray-600"></ion-icon>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg mb-1 text-gray-700">{prompt.title}</h3>
                    <p className="text-gray-600 text-sm">{prompt.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ion-icon name="pricetag-outline"></ion-icon>
                    {categories.find(cat => cat.id === prompt.category)?.name}
                  </span>
                  <button className="text-button-dark hover:text-gray-800 text-sm flex items-center gap-1 font-medium">
                    Use Prompt
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLibrary;