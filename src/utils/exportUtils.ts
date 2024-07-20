import { Team, Feature } from '../types';

const formatDate = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

interface FeatureWithTeam extends Feature {
  teamName: string;
}

export const exportToCSV = (teams: Team[]): string => {
  let csvContent = 'Team,Feature,Size,Priority,Completion Probability,Expected Completion\n';

  // Collect all high-probability features from all teams
  const allHighProbabilityFeatures: FeatureWithTeam[] = teams.flatMap(team => 
    team.features
      .filter(feature => (feature.probability || 0) >= 85)
      .map(feature => ({ ...feature, teamName: team.name }))
  );

  // Sort features by Expected Completion date in ascending order
  allHighProbabilityFeatures.sort((a, b) => {
    if (a.expectedDate && b.expectedDate) {
      return new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime();
    }
    return 0;
  });

  // Generate CSV content
  allHighProbabilityFeatures.forEach(feature => {
    const row = [
      feature.teamName,
      feature.name,
      feature.size,
      feature.priority,
      `${feature.probability?.toFixed(2)}%`,
      formatDate(feature.expectedDate as string)
    ];
    csvContent += row.join(',') + '\n';
  });

  return csvContent;
};