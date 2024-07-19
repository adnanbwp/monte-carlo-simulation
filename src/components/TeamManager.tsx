import React, { useState } from 'react';
import { Team, Feature } from '../types';
import CSVUploader from './CSVUploader';

interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onUpdateTeam: (teamId: string, updatedTeam: Team) => void;
  onRemoveTeam: (teamId: string) => void;
  onLoadDemoTeams: () => void;
  onCSVDataLoaded: (teams: Team[], features: Feature[]) => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  onAddTeam,
  onUpdateTeam,
  onRemoveTeam,
  onLoadDemoTeams,
  onCSVDataLoaded
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newWipLimit, setNewWipLimit] = useState('');
  const [newPastThroughput, setNewPastThroughput] = useState('');

  const handleAddTeam = () => {
    if (newTeamName && newWipLimit && newPastThroughput) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: newTeamName,
        wipLimit: parseInt(newWipLimit),
        pastThroughput: newPastThroughput.split(',').map(Number),
        features: []
      };
      onAddTeam(newTeam);
      setNewTeamName('');
      setNewWipLimit('');
      setNewPastThroughput('');
    }
  };

  const handleUpdateTeam = (teamId: string, field: keyof Team, value: string) => {
    const updatedTeam = teams.find(team => team.id === teamId);
    if (updatedTeam) {
      if (field === 'wipLimit') {
        updatedTeam[field] = parseInt(value);
      } else if (field === 'pastThroughput') {
        updatedTeam[field] = value.split(',').map(Number);
      } else {
        (updatedTeam as any)[field] = value;
      }
      onUpdateTeam(teamId, updatedTeam);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Team Management</h2>
      <div className="flex flex-wrap items-end gap-2 mb-4">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Team Name"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newWipLimit}
          onChange={(e) => setNewWipLimit(e.target.value)}
          placeholder="WIP Limit"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={newPastThroughput}
          onChange={(e) => setNewPastThroughput(e.target.value)}
          placeholder="Past Throughput (comma-separated)"
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddTeam}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Team
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <CSVUploader onDataLoaded={onCSVDataLoaded} />
        <button
          onClick={onLoadDemoTeams}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Load Demo Teams
        </button>
      </div>
      {teams.map(team => (
        <div key={team.id} className="mt-2 p-2 border rounded flex items-center">
          <input
            type="text"
            value={team.name}
            onChange={(e) => handleUpdateTeam(team.id, 'name', e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="number"
            value={team.wipLimit}
            onChange={(e) => handleUpdateTeam(team.id, 'wipLimit', e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            value={team.pastThroughput.join(',')}
            onChange={(e) => handleUpdateTeam(team.id, 'pastThroughput', e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <button
            onClick={() => onRemoveTeam(team.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Remove Team
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeamManager;