import React from 'react';
import { Team } from '../types';  // Remove 'Feature' if it's not used
import FeatureCompletionList from './FeatureCompletionList';

interface SimulationResultsSummaryProps {
  teams: Team[];
}

const SimulationResultsSummary: React.FC<SimulationResultsSummaryProps> = ({ teams }) => {
  const calculateOverallProbability = () => {
    const allFeatures = teams.flatMap(team => team.features);
    if (allFeatures.length === 0) return 0;

    // Calculate the probability of all features being completed
    const overallProbability = allFeatures.reduce((acc, feature) => {
      // console.log("acc: ",(feature.probability || 0) / 100);
      return (acc * (feature.probability || 0) / 100);

    }, 1) * 100;

    return overallProbability;
  };

  const overallProbability = calculateOverallProbability();
  // console.log("Overall Probability: ", overallProbability); 

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Simulation Results Summary</h2>
      <p className="mb-2">
        <strong>Overall Project Completion Probability:</strong> {overallProbability.toFixed(2)}%
      </p>
      <h3 className="text-lg font-semibold mt-4 mb-2">Team Summaries:</h3>
      {teams.map(team => (
        <div key={team.id} className="mb-4">
          <h4 className="font-semibold">{team.name}</h4>
          <p>Features: {team.features.length}</p>
          <p>Avg. Completion Probability: {
            (team.features.reduce((sum, feature) => sum + (feature.probability || 0), 0) / team.features.length).toFixed(2)
          }%</p>
        </div>
      ))}
      <FeatureCompletionList teams={teams} />
    </div>
  );
};

export default SimulationResultsSummary;