import React, { useState } from 'react';
import { Team, Feature } from '../types';
import SimulationForm from './SimulationForm';
import FeatureTable from './FeatureTable';

interface TeamTabsProps {
  teams: Team[];
  onAddFeature: (teamId: string, feature: Feature) => void;
  onEditFeature: (teamId: string, feature: Feature) => void;
  onRemoveFeature: (teamId: string, featureId: string) => void;
  onLoadDemoScenario: (teamId: string) => void;
}

const TeamTabs: React.FC<TeamTabsProps> = ({ teams, onAddFeature, onEditFeature, onRemoveFeature, onLoadDemoScenario }) => {
  const [activeTab, setActiveTab] = useState(teams[0]?.id || '');

  return (
    <div>
      <div className="flex border-b">
        {teams.map(team => (
          <button
            key={team.id}
            className={`py-2 px-4 ${activeTab === team.id ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(team.id)}
          >
            {team.name}
          </button>
        ))}
      </div>
      {teams.map(team => (
        <div key={team.id} className={`mt-4 ${activeTab === team.id ? '' : 'hidden'}`}>
          <div className="mb-4">
            <button
              onClick={() => onLoadDemoScenario(team.id)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Load Demo Scenario
            </button>
          </div>
          <SimulationForm
            onAddFeature={(feature) => onAddFeature(team.id, feature)}
            features={team.features}
            teams={teams}
            currentTeamId={team.id}
          />
          <FeatureTable 
            features={team.features} 
            onEditFeature={(feature) => onEditFeature(team.id, feature)}
            onRemoveFeature={(featureId) => onRemoveFeature(team.id, featureId)}
            teams={teams}
            currentTeamId={team.id}
          />
        </div>
      ))}
    </div>
  );
};

export default TeamTabs;