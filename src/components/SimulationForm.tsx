import React, { useState, useEffect } from 'react';
import { Feature, Team } from '../types';
import { checkCircularDependency } from '../utils/dependencyUtils';

interface SimulationFormProps {
  onAddFeature: (feature: Feature) => void;
  features: Feature[];
  teams: Team[];
  currentTeamId: string;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ onAddFeature, features, teams, currentTeamId }) => {
  const [featureName, setFeatureName] = useState('');
  const [featureSize, setFeatureSize] = useState('');
  const [featurePriority, setFeaturePriority] = useState('');
  const [dependencyTeamId, setDependencyTeamId] = useState('');
  const [dependencyId, setDependencyId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const nextPriority = features.length > 0 ? Math.max(...features.map(f => f.priority)) + 1 : 1;
    setFeaturePriority(nextPriority.toString());
  }, [features]);

  const handleAddFeature = () => {
    if (featureName && featureSize && featurePriority) {
      const newFeature: Feature = {
        id: Date.now().toString(),
        name: featureName,
        size: parseInt(featureSize),
        priority: parseInt(featurePriority),
        teamId: currentTeamId,
        dependencyId: dependencyId || undefined,
        dependencyTeamId: dependencyTeamId || undefined,
        isBlocked: !!dependencyId,
      };

      if (dependencyId && dependencyTeamId) {
        if (checkCircularDependency(teams, newFeature, dependencyId, dependencyTeamId)) {
          setError('Circular dependency detected. Please choose a different dependency.');
          return;
        }
      }

      onAddFeature(newFeature);
      setFeatureName('');
      setFeatureSize('');
      setDependencyTeamId('');
      setDependencyId('');
      setError('');
      // Priority will be updated by the useEffect
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={featureName}
        onChange={(e) => setFeatureName(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Feature Name"
      />
      <input
        type="number"
        value={featureSize}
        onChange={(e) => setFeatureSize(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Feature Size"
      />
      <input
        type="number"
        value={featurePriority}
        onChange={(e) => setFeaturePriority(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Feature Priority"
        min="1"
      />
      <select
        value={dependencyTeamId}
        onChange={(e) => setDependencyTeamId(e.target.value)}
        className="border p-2 mr-2"
      >
        <option value="">Select Dependency Team</option>
        {teams.filter(team => team.id !== currentTeamId).map(team => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
      {dependencyTeamId && (
        <select
          value={dependencyId}
          onChange={(e) => setDependencyId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Dependency Feature</option>
          {teams.find(team => team.id === dependencyTeamId)?.features.map(feature => (
            <option key={feature.id} value={feature.id}>{feature.name}</option>
          ))}
        </select>
      )}
      <button
        onClick={handleAddFeature}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Feature
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SimulationForm;