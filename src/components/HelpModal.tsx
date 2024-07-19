import React, { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('what');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">Help</p>
          <button onClick={onClose} className="text-black close-modal">&times;</button>
        </div>
        <div className="mt-2">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'what' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('what')}
            >
              What is this tool?
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'how' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('how')}
            >
              How to use
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'concepts' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('concepts')}
            >
              Key Concepts
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'csv' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('csv')}
            >
              CSV Upload
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'what' && (
              <div>
                <h3 className="font-bold">What is this tool?</h3>
                <p>This is a Monte Carlo simulation tool for project management. It helps predict project outcomes based on historical data and current project structure.</p>
              </div>
            )}
            {activeTab === 'how' && (
              <div>
                <h3 className="font-bold">How to use the simulator</h3>
                <ol className="list-decimal list-inside">
                  <li>Add teams and set their WIP limits and past throughput</li>
                  <li>Add features to each team, specifying size</li>
                  <li>Run the simulation to see projected outcomes</li>
                </ol>
              </div>
            )}
            {activeTab === 'concepts' && (
              <div>
                <h3 className="font-bold">Key Concepts</h3>
                <ul className="list-disc list-inside">
                  <li><strong>WIP Limit:</strong> The maximum number of features a team can work on simultaneously</li>
                  <li><strong>Throughput:</strong> The number of story points completed in a given time period</li>
                  <li><strong>Monte Carlo Simulation:</strong> A probability simulation run multiple times to predict outcomes</li>
                </ul>
              </div>
            )}
            {activeTab === 'csv' && (
              <div>
                <h3 className="font-bold">CSV Upload Feature</h3>
                <p>The CSV upload feature allows you to quickly import team and feature data into the simulator.</p>
                <h4 className="font-semibold mt-2">How to use:</h4>
                <ol className="list-decimal list-inside">
                  <li>Click the "Download CSV Template" link to get a template file</li>
                  <li>Fill in your team and feature data in the template</li>
                  <li>Click the "Load Data From CSV" button and select your filled CSV file</li>
                  <li>The app will automatically load your data into the simulator</li>
                </ol>
                <h4 className="font-semibold mt-2">CSV Structure:</h4>
                <ul className="list-disc list-inside">
                  <li>The CSV file should have two sections: Teams and Features</li>
                  <li>Team section columns: Team Name, WIP Limit, Past Throughput</li>
                  <li>Feature section columns: Feature ID, Team, Name, Size</li>
                  <li>Leave an empty row between the Team and Feature sections</li>
                </ul>
                <h4 className="font-semibold mt-2">Important Notes:</h4>
                <ul className="list-disc list-inside">
                  <li>All fields are required</li>
                  <li>Past Throughput should be comma-separated values (e.g., "3,4,2,5")</li>
                  <li>Feature Size should be a numeric value</li>
                  <li>The Team name in the Feature section must match a Team name from the Team section</li>
                  <li>Uploading a CSV will overwrite any existing data in the simulator</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;