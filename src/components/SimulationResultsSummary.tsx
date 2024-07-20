import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import LoadingIndicator from './LoadingIndicator';

interface SimulationResultsSummaryProps {
  teams: Team[];
  isSimulationRun: boolean;
  simulationCounter: number;
}

const SimulationResultsSummary: React.FC<SimulationResultsSummaryProps> = ({ 
  teams, 
  isSimulationRun, 
  simulationCounter 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Clear export message when a new simulation is run or teams change
  useEffect(() => {
    setExportMessage(null);
  }, [simulationCounter, teams]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage(null);

    try {
      const csvContent = exportToCSV(teams);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'simulation_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportMessage('Export completed successfully. Your download should begin shortly.');
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage(`Export failed: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const calculateOverallProbability = (): number => {
    const allFeatures = teams.flatMap(team => team.features);
    if (allFeatures.length === 0) return 0;

    const overallProbability = allFeatures.reduce((acc, feature) => {
      return (acc * (feature.probability || 0) / 100);
    }, 1) * 100;

    return overallProbability;
  };

  const overallProbability = calculateOverallProbability();

  const highProbabilityFeatures = teams.flatMap(team => 
    team.features
      .filter(feature => (feature.probability || 0) >= 85)
      .map(feature => ({ ...feature, teamName: team.name }))
  ).sort((a, b) => {
    if (a.expectedDate && b.expectedDate) {
      return new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime();
    }
    return 0;
  });

  console.log('High probability features:', highProbabilityFeatures);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Simulation Results Summary</h2>
        <div className="flex items-center">
          {isExporting && <LoadingIndicator size="small" className="mr-2" />}
          <button
            onClick={handleExport}
            disabled={!isSimulationRun || isExporting}
            className={`px-4 py-2 rounded ${
              isSimulationRun && !isExporting
                ? 'bg-blue-500 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isExporting ? 'Exporting...' : 'Export Results'}
          </button>
        </div>
      </div>
      {exportMessage && (
        <div className={`mb-4 p-2 rounded ${exportMessage.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {exportMessage}
        </div>
      )}
      <p className="mb-2">
        <strong>Overall Project Completion Probability:</strong> {overallProbability.toFixed(2)}%
      </p>
      <h3 className="text-lg font-semibold mt-4 mb-2">High Probability Features (≥85% completion chance)</h3>
      {highProbabilityFeatures.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Team</th>
              <th className="border p-2">Feature</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Completion Probability</th>
              <th className="border p-2">Expected Completion</th>
            </tr>
          </thead>
          <tbody>
            {highProbabilityFeatures.map((feature, index) => (
              <tr key={feature.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border p-2">{feature.teamName}</td>
                <td className="border p-2">{feature.name}</td>
                <td className="border p-2">{feature.size}</td>
                <td className="border p-2">{feature.priority}</td>
                <td className="border p-2">{feature.probability ? `${feature.probability.toFixed(2)}%` : 'N/A'}</td>
                <td className="border p-2">{feature.expectedDate || 'N/A'}</td>
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

export default SimulationResultsSummary;