import React, { useState } from 'react';
import { Feature, Team } from '../types';
import { checkCircularDependency } from '../utils/dependencyUtils';

interface FeatureTableProps {
  features: Feature[];
  onEditFeature: (feature: Feature) => void;
  onRemoveFeature: (featureId: string) => void;
  teams: Team[];
  currentTeamId: string;
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features, onEditFeature, onRemoveFeature, teams, currentTeamId }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editDependencyTeamId, setEditDependencyTeamId] = useState('');
  const [editDependencyId, setEditDependencyId] = useState('');
  const [error, setError] = useState('');

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id);
    setEditName(feature.name);
    setEditSize(feature.size.toString());
    setEditPriority(feature.priority.toString());
    setEditDependencyTeamId(feature.dependencyTeamId || '');
    setEditDependencyId(feature.dependencyId || '');
    setError('');
  };

  const handleSave = (feature: Feature) => {
    const updatedFeature: Feature = {
      ...feature,
      name: editName,
      size: parseInt(editSize),
      priority: parseInt(editPriority),
      dependencyTeamId: editDependencyTeamId || undefined,
      dependencyId: editDependencyId || undefined,
      isBlocked: !!editDependencyId
    };

    if (editDependencyId && editDependencyTeamId) {
      if (checkCircularDependency(teams, updatedFeature, editDependencyId, editDependencyTeamId)) {
        setError('Circular dependency detected. Please choose a different dependency.');
        return;
      }
    }

    onEditFeature(updatedFeature);
    setEditingId(null);
    setError('');
  };

  const getDependencyName = (feature: Feature) => {
    if (!feature.dependencyTeamId || !feature.dependencyId) return 'None';
    const dependencyTeam = teams.find(team => team.id === feature.dependencyTeamId);
    const dependencyFeature = dependencyTeam?.features.find(f => f.id === feature.dependencyId);
    return `${dependencyTeam?.name} - ${dependencyFeature?.name}`;
  };

  const getRowColor = (probability?: number) => {
    if (probability === undefined) return '';
    if (probability >= 85) return 'bg-green-200';
    if (probability >= 70) return 'bg-yellow-200';
    return 'bg-red-200';
  };

  return (
    <div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Dependency</th>
            <th className="border p-2">Probability</th>
            <th className="border p-2">Expected Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className={getRowColor(feature.probability)}>
              <td className="border p-2">
                {editingId === feature.id ? (
                  <input
                    type="number"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  feature.priority
                )}
              </td>
              <td className="border p-2">
                {editingId === feature.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  feature.name
                )}
              </td>
              <td className="border p-2">
                {editingId === feature.id ? (
                  <input
                    type="number"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  feature.size
                )}
              </td>
              <td className="border p-2">
                {editingId === feature.id ? (
                  <>
                    <select
                      value={editDependencyTeamId}
                      onChange={(e) => setEditDependencyTeamId(e.target.value)}
                      className="w-full p-1 mb-1"
                    >
                      <option value="">Select Dependency Team</option>
                      {teams.filter(team => team.id !== currentTeamId).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    {editDependencyTeamId && (
                      <select
                        value={editDependencyId}
                        onChange={(e) => setEditDependencyId(e.target.value)}
                        className="w-full p-1"
                      >
                        <option value="">Select Dependency Feature</option>
                        {teams.find(team => team.id === editDependencyTeamId)?.features.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    )}
                  </>
                ) : (
                  getDependencyName(feature)
                )}
              </td>
              <td className="border p-2">{feature.probability !== undefined ? `${feature.probability.toFixed(2)}%` : 'N/A'}</td>
              <td className="border p-2">{feature.expectedDate || 'N/A'}</td>
              <td className="border p-2">
                {editingId === feature.id ? (
                  <button
                    onClick={() => handleSave(feature)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(feature)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onRemoveFeature(feature.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FeatureTable;