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
              CSV Guidelines
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'simulation' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('simulation')}
            >
              Simulation Logic
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
                  <li><strong>Throughput:</strong> The number of work items completed in a given time period. Typically work items completed per day for the past 'N' days. You may also use story points, if you want as long as you use story points for size</li>
                  <li><strong>Size:</strong> This refers to the size of a feature. Use the same unit as Throughput i.e. work items or story points</li>
                  <li><strong>Monte Carlo Simulation:</strong> A probability simulation run multiple times to predict outcomes</li>
                </ul>
              </div>
            )}
            {activeTab === 'csv' && (
              <div>
                <h3 className="font-bold">CSV Guidelines</h3>
                <p>The CSV file should have two sections:</p>
                <ol className="list-decimal list-inside">
                  <li>Team Data:
                    <ul className="list-disc list-inside ml-4">
                      <li>Columns: Team Name, WIP Limit, Past Throughput</li>
                      <li>Past Throughput should be comma-separated values within quotes</li>
                    </ul>
                  </li>
                  <li>Feature Data:
                    <ul className="list-disc list-inside ml-4">
                      <li>Columns: Feature ID, Team, Name, Size</li>
                      <li>Features should be listed in priority order (highest priority first)</li>
                    </ul>
                  </li>
                </ol>
                <p>Ensure there's a blank line between the team data and feature data sections.</p>
              </div>
            )}
            {activeTab === 'simulation' && (
              <div>
                <h3 className="font-bold">Simulation Logic</h3>
                <p>The Monte Carlo simulation for project management follows these steps:</p>
                <ol className="list-decimal list-inside">
                  <li>The simulation runs 10,000 times for each team and their features.</li>
                  <li>For each simulation run:
                    <ul className="list-disc list-inside ml-4">
                      <li>Start from the project start date and progress day by day until the due date.</li>
                      <li>For each day and each team:
                        <ol className="list-alpha list-inside ml-4">
                          <li>Complete any features that have finished their work.</li>
                          <li>Update the status of blocked features based on completed dependencies.</li>
                          <li>Add new features to the team's in-progress list if there's capacity (respecting WIP limits).</li>
                          <li>Allocate the day's work:
                            <ul className="list-disc list-inside ml-6">
                              <li>Randomly select a daily throughput value from the team's past throughput data.</li>
                              <li>Distribute this throughput across in-progress features, reducing their remaining work.</li>
                            </ul>
                          </li>
                        </ol>
                      </li>
                    </ul>
                  </li>
                  <li>After all runs, calculate for each feature:
                    <ul className="list-disc list-inside ml-4">
                      <li>Completion probability: The percentage of runs where the feature was completed.</li>
                      <li>Expected completion date: The 85th percentile of completion dates across all runs.</li>
                    </ul>
                  </li>
                </ol>
                <p className="mt-4"><strong>Key aspects of the simulation:</strong></p>
                <ul className="list-disc list-inside">
                  <li>Features are prioritized within each team.</li>
                  <li>The simulation respects team WIP (Work in Progress) limits.</li>
                  <li>It accounts for feature dependencies across teams.</li>
                  <li>Daily throughput varies based on historical team performance.</li>
                  <li>The 85th percentile is used for the expected completion date to provide a conservative estimate.</li>
                </ul>
                <p className="mt-4">This simulation helps project managers understand the likelihood of completing features by the due date and identify potential bottlenecks or risks in the project schedule.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;