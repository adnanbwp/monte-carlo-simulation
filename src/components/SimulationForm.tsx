import React, { useState, useEffect } from 'react';

interface SimulationFormProps {
  dueDate: string;
  setDueDate: (date: string) => void;
  pastThroughput: number[];
  setPastThroughput: (throughput: number[]) => void;
  wipLimit: number;
  setWipLimit: (limit: number) => void;
  addFeature: (feature: { id: string; name: string; size: number; priority: number }) => void;
  features: { priority: number }[];
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  dueDate,
  setDueDate,
  pastThroughput,
  setPastThroughput,
  wipLimit,
  setWipLimit,
  addFeature,
  features
}) => {
  const [featureName, setFeatureName] = useState('');
  const [featureSize, setFeatureSize] = useState('');
  const [featurePriority, setFeaturePriority] = useState('');

  useEffect(() => {
    const nextPriority = features.length > 0 ? Math.max(...features.map(f => f.priority)) + 1 : 1;
    setFeaturePriority(nextPriority.toString());
  }, [features]);

  const handleAddFeature = () => {
    if (featureName && featureSize && featurePriority) {
      addFeature({
        id: Date.now().toString(),
        name: featureName,
        size: parseInt(featureSize),
        priority: parseInt(featurePriority),
      });
      setFeatureName('');
      setFeatureSize('');
      // Priority will be updated by the useEffect
    }
  };

  return (
    <div className="mb-4">
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Due Date"
      />
      <input
        type="text"
        value={pastThroughput.join(', ')}
        onChange={(e) => setPastThroughput(e.target.value.split(',').map(Number))}
        className="border p-2 mr-2"
        placeholder="Past Throughput (comma-separated)"
      />
      <input
        type="number"
        value={wipLimit}
        onChange={(e) => setWipLimit(Number(e.target.value))}
        className="border p-2 mr-2"
        placeholder="WIP Limit"
        min="1"
      />
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
      <button
        onClick={handleAddFeature}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Feature
      </button>
    </div>
  );
};

export default SimulationForm;