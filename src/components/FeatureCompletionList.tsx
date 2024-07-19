import React from 'react';
import { Team, Feature } from '../types';

interface FeatureCompletionListProps {
  teams: Team[];
}

interface EnhancedFeature extends Feature {
  teamName: string;
}

const FeatureCompletionList: React.FC<FeatureCompletionListProps> = ({ teams }) => {
  const allFeatures: EnhancedFeature[] = teams.flatMap(team => 
    team.features.map(feature => ({
      ...feature,
      teamName: team.name
    }))
  );

  const filteredAndSortedFeatures = allFeatures
    .filter(feature => (feature.probability || 0) >= 85)
    .sort((a, b) => {
      if (a.expectedDate && b.expectedDate) {
        return new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime();
      }
      return 0;
    });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">High Probability Feature Completion List (≥85%)</h2>
      {filteredAndSortedFeatures.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Team</th>
              <th className="border p-2">Feature</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Expected Completion</th>
              <th className="border p-2">Completion Probability</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedFeatures.map((feature, index) => (
              <tr key={feature.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border p-2">{feature.teamName}</td>
                <td className="border p-2">{feature.name}</td>
                <td className="border p-2">{feature.size}</td>
                <td className="border p-2">{feature.priority}</td>
                <td className="border p-2">{feature.expectedDate || 'N/A'}</td>
                <td className="border p-2">{feature.probability ? `${feature.probability.toFixed(2)}%` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No features have a completion probability of 85% or higher.</p>
      )}
    </div>
  );
};

export default FeatureCompletionList;