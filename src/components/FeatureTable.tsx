import React, { useState } from 'react';

interface Feature {
  id: string;
  name: string;
  size: number;
  priority: number;
  probability?: number;
  expectedDate?: string;
}

interface FeatureTableProps {
  features: Feature[];
  onEditFeature: (feature: Feature) => void;
  onRemoveFeature: (featureId: string) => void;
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features, onEditFeature, onRemoveFeature }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editPriority, setEditPriority] = useState('');

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id);
    setEditName(feature.name);
    setEditSize(feature.size.toString());
    setEditPriority(feature.priority.toString());
  };

  const handleSave = (feature: Feature) => {
    onEditFeature({
      ...feature,
      name: editName,
      size: parseInt(editSize),
      priority: parseInt(editPriority)
    });
    setEditingId(null);
  };

  const sortedFeatures = [...features].sort((a, b) => a.priority - b.priority);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          <th className="border p-2">Priority</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Size</th>
          <th className="border p-2">Probability</th>
          <th className="border p-2">Expected Date
            <br/> 85% Confidence</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedFeatures.map((feature) => (
          <tr
            key={feature.id}
            className={feature.probability && feature.probability > 85 ? 'bg-green-200' : 'bg-red-200'}
          >
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
            <td className="border p-2">{feature.probability?.toFixed(2)}%</td>
            <td className="border p-2">{feature.expectedDate}</td>
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
  );
};

export default FeatureTable;