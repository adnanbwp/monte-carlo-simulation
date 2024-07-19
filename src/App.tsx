import React, { useState } from 'react';
import TeamManager from './components/TeamManager';
import TeamTabs from './components/TeamTabs';
import SimulationResultsSummary from './components/SimulationResultsSummary';
import HelpModal from './components/HelpModal';
import CSVTemplate from './components/CSVTemplate';
import { runSimulation } from './utils/simulation';
import { Team, Feature } from './types';
import { HelpCircle, PlayCircle } from 'lucide-react';

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [dueDate, setDueDate] = useState<string>('');
  const [simulationRun, setSimulationRun] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };

  const handleUpdateTeam = (teamId: string, updatedTeam: Team) => {
    setTeams(teams.map(team => team.id === teamId ? updatedTeam : team));
  };

  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleAddFeature = (teamId: string, newFeature: Feature) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const updatedFeatures = [...team.features, newFeature].map((feature, index) => ({
          ...feature,
          priority: index + 1
        }));
        return {
          ...team,
          features: updatedFeatures
        };
      }
      return team;
    }));
  };

  const handleEditFeature = (teamId: string, editedFeature: Feature) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const updatedFeatures = team.features.map(feature => 
          feature.id === editedFeature.id ? editedFeature : feature
        ).sort((a, b) => a.priority - b.priority)
        .map((feature, index) => ({
          ...feature,
          priority: index + 1
        }));
        return {
          ...team,
          features: updatedFeatures
        };
      }
      return team;
    }));
  };

  const handleRemoveFeature = (teamId: string, featureId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const updatedFeatures = team.features
          .filter(feature => feature.id !== featureId)
          .map((feature, index) => ({
            ...feature,
            priority: index + 1
          }));
        return {
          ...team,
          features: updatedFeatures
        };
      }
      return team;
    }));
  };

const handleLoadDemoScenario = (teamId: string) => {
  const numFeatures = Math.floor(Math.random() * 5) + 3; // 3 to 7 features
  const newFeatures: Feature[] = [];

  for (let i = 0; i < numFeatures; i++) {
    newFeatures.push({
      id: `demo-${teamId}-${Date.now()}-${i}`,
      name: `Feature ${i + 1}`,
      size: Math.floor(Math.random() * 20) + 5, // 5 to 24 size
      priority: i + 1,
      teamId: teamId,
      isBlocked: false
    });
  }

  setTeams(teams.map(team => {
    if (team.id === teamId) {
      return {
        ...team,
        features: newFeatures
      };
    }
    return team;
  }));
};

const handleLoadDemoTeams = () => {
  const numTeams = Math.floor(Math.random() * 4) + 2; // 2 to 5 teams
  const teamNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  const newTeams: Team[] = [];

  for (let i = 0; i < numTeams; i++) {
    newTeams.push({
      id: `demo-team-${Date.now()}-${i}`,
      name: `Team ${teamNames[i]}`,
      wipLimit: Math.floor(Math.random() * 3) + 2, // 2 to 4 WIP limit
      pastThroughput: Array.from({ length: 10 }, () => Math.floor(Math.random() * 4)), // 0 to 3 throughput
      features: []
    });
  }

  setTeams(newTeams);
};

  const handleSimulate = () => {
    setError(null);

    if (!dueDate || teams.length === 0 || teams.some(team => team.features.length === 0)) {
      setError('Please ensure you have set a due date, added at least one team, and each team has at least one feature.');
      return;
    }

    const selectedDueDate = new Date(dueDate);
    const currentDate = new Date();

    if (selectedDueDate <= currentDate) {
      setError('The due date must be in the future. Please select a future date.');
      return;
    }

    try {
      const results = runSimulation(teams, dueDate);
      setTeams(results);
      setSimulationRun(true);
    } catch (err) {
      console.error('Simulation error:', err);
      setError(`An error occurred during simulation: ${(err as Error).message}`);
    }
  };

  const handleCSVDataLoaded = (loadedTeams: Team[], loadedFeatures: Feature[]) => {
    setTeams(loadedTeams.map(team => ({
      ...team,
      features: loadedFeatures.filter(feature => feature.teamId === team.id)
    })));
    setError(null);
  };

  const isSimulationDisabled = teams.length === 0 || teams.some(team => team.features.length === 0) || !dueDate;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Monte Carlo Simulation with Multiple Teams</h1>
        <div className="flex items-center space-x-4">
          <CSVTemplate />
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <HelpCircle className="mr-2" />
            Help
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div>
          <label className="mr-2">Project Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2"
          />
        </div>
        <button
          onClick={handleSimulate}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center ${isSimulationDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSimulationDisabled}
        >
          <PlayCircle className="mr-2" />
          Run Simulation for All Teams
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2 mb-4">
          {error}
        </div>
      )}

      <TeamManager
        teams={teams}
        onAddTeam={handleAddTeam}
        onUpdateTeam={handleUpdateTeam}
        onRemoveTeam={handleRemoveTeam}
        onLoadDemoTeams={handleLoadDemoTeams}
        onCSVDataLoaded={handleCSVDataLoaded}
      />

      {teams.length > 0 && (
        <TeamTabs
          teams={teams}
          onAddFeature={handleAddFeature}
          onEditFeature={handleEditFeature}
          onRemoveFeature={handleRemoveFeature}
          onLoadDemoScenario={handleLoadDemoScenario}
        />
      )}

      {simulationRun && <SimulationResultsSummary teams={teams} />}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}

export default App;