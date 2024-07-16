import React, { useState, useRef } from 'react';
import SimulationForm from './components/SimulationForm';
import FeatureTable from './components/FeatureTable';
import { runSimulation } from './utils/simulation';
import { addMonths, format } from 'date-fns';

interface Feature {
  id: string;
  name: string;
  size: number;
  priority: number;
  probability?: number;
  expectedDate?: string;
}

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [dueDate, setDueDate] = useState<string>('');
  const [pastThroughput, setPastThroughput] = useState<number[]>([]);
  const [wipLimit, setWipLimit] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFeature = (newFeature: Feature) => {
    setFeatures(prevFeatures => {
      const updatedFeatures = prevFeatures.map(feature => {
        if (feature.priority >= newFeature.priority) {
          return { ...feature, priority: feature.priority + 1 };
        }
        return feature;
      });
      return [...updatedFeatures, newFeature].sort((a, b) => a.priority - b.priority);
    });
  };

  const handleEditFeature = (editedFeature: Feature) => {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => 
        feature.id === editedFeature.id ? editedFeature : feature
      ).sort((a, b) => a.priority - b.priority)
    );
  };

  const handleRemoveFeature = (featureId: string) => {
    setFeatures(prevFeatures => {
      const featureToRemove = prevFeatures.find(f => f.id === featureId);
      if (!featureToRemove) {
        return prevFeatures;
      }

      return prevFeatures
        .filter(feature => feature.id !== featureId)
        .map(feature => {
          if (feature.priority > featureToRemove.priority) {
            return { ...feature, priority: feature.priority - 1 };
          }
          return feature;
        });
    });
  };

  const handleSimulate = () => {
    if (!dueDate || pastThroughput.length === 0 || features.length === 0) {
      alert('Please ensure you have set a due date, entered past throughput data, and added at least one feature.');
      return;
    }

    const results = runSimulation(features, dueDate, pastThroughput, wipLimit);
    setFeatures(results);
  };

  const loadDemoScenario = () => {
    const twoMonthsFromNow = addMonths(new Date(), 2);
    setDueDate(format(twoMonthsFromNow, 'yyyy-MM-dd'));
    setPastThroughput([1, 5, 0, 2, 3, 0, 1, 1, 0, 2, 1, 0, 0, 4, 1, 1, 0, 1, 0, 2, 1, 0, 2, 0, 1, 2, 1, 0, 0, 3]);
    setFeatures([
      { id: '1', name: 'A', size: 30, priority: 1 },
      { id: '2', name: 'B', size: 15, priority: 2 },
      { id: '3', name: 'C', size: 40, priority: 3 },
      { id: '4', name: 'D', size: 20, priority: 4 },
    ]);
    setWipLimit(2);
  };

  const clearScenario = () => {
    setDueDate('');
    setPastThroughput([]);
    setFeatures([]);
    setWipLimit(1);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        // const headers = lines[0].split(',');
        const newFeatures: Feature[] = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          return {
            id: Date.now().toString() + index,
            name: values[0],
            size: parseInt(values[1]),
            priority: features.length + index + 1
          };
        }).filter(feature => feature.name && !isNaN(feature.size));
        
        setFeatures(prevFeatures => {
          const updatedFeatures = [...prevFeatures, ...newFeatures];
          return updatedFeatures.sort((a, b) => a.priority - b.priority);
        });
      };
      reader.readAsText(file);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Monte Carlo Simulation with WIP</h1>
      <div className="mb-4">
        <button
          onClick={loadDemoScenario}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Load Demo Scenario
        </button>
        <button
          onClick={clearScenario}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Clear Scenario
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Upload CSV
        </button>
        <button
          onClick={handleSimulate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mt-4"
        >
          Run Simulation
        </button>        
      </div>
      <SimulationForm
        dueDate={dueDate}
        setDueDate={setDueDate}
        pastThroughput={pastThroughput}
        setPastThroughput={setPastThroughput}
        wipLimit={wipLimit}
        setWipLimit={setWipLimit}
        addFeature={handleAddFeature}
        features={features}
      />
      <FeatureTable 
        features={features} 
        onEditFeature={handleEditFeature}
        onRemoveFeature={handleRemoveFeature}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleSimulate}
      >
        Run Simulation
      </button>
    </div>
  );
}

export default App;