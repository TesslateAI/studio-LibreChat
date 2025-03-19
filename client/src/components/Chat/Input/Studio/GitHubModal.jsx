// GitHubModal.jsx
import React from 'react';
import { FiX } from "react-icons/fi";

const GitHubModal = ({
  showGitHubModal,
  setShowGitHubModal,
  githubRepo,
  setGithubRepo,
  selectedBranch,
  setSelectedBranch
}) => {
  if (!showGitHubModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[80vh] flex flex-col shadow-xl border border-[#e5e6e3]">
        <div className="flex justify-between items-center p-4 border-b border-[#e5e6e3]">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
            <ion-icon name="logo-github"></ion-icon>
            Connect GitHub Repository
          </h2>
          <button
            onClick={() => setShowGitHubModal(false)}
            className="p-1 text-gray-300 bg-[#4e4946] rounded-full hover:bg-[#999696] transition"
            aria-label="Close"
          >
            <FiX size={15} /> {/* X icon */}
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repository URL</label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="main">main</option>
                <option value="master">master</option>
                <option value="development">development</option>
              </select>
            </div>
            <button
              onClick={() => {
                setShowGitHubModal(false);
              }}
              className="w-full bg-[#4e4946] text-white py-2 rounded-lg hover:bg-[#999696] 
    transition-colors flex items-center justify-center gap-2"
            >
              <ion-icon name="git-network-outline"></ion-icon>
              Connect Repository
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubModal;
