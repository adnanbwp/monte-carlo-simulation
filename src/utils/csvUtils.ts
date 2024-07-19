import { Team, Feature, CSVRow } from '../types';

const TEAM_HEADERS = ['Team Name', 'WIP Limit', 'Past Throughput'];
const FEATURE_HEADERS = ['Feature ID', 'Team', 'Name', 'Size'];

function validateCSVStructure(data: CSVRow[]): boolean {
  if (data.length === 0) {
    throw new Error('CSV file is empty');
  }

  const featureSectionStart = data.findIndex(row => row['Team Name'] === 'Feature ID');
  
  if (featureSectionStart === -1) {
    throw new Error('CSV file is missing feature data');
  }

  const teamSection = data.slice(0, featureSectionStart);
  const featureSection = data.slice(featureSectionStart + 1);

  if (teamSection.length === 0) {
    throw new Error('CSV file is missing team data');
  }

  if (featureSection.length === 0) {
    throw new Error('CSV file is missing feature data');
  }

  // Validate team headers
  const teamHeaders = Object.keys(teamSection[0]);
  const missingTeamHeaders = TEAM_HEADERS.filter(header => !teamHeaders.includes(header));
  if (missingTeamHeaders.length > 0) {
    throw new Error(`Missing team headers: ${missingTeamHeaders.join(', ')}`);
  }

  // Validate feature headers
  const featureHeaders = Object.keys(featureSection[0]);
  const missingFeatureHeaders = FEATURE_HEADERS.filter(header => !featureHeaders.includes(header));
  if (missingFeatureHeaders.length > 0) {
    throw new Error(`Missing feature headers: ${missingFeatureHeaders.join(', ')}`);
  }

  return true;
}

export function processCSVData(data: CSVRow[]): { teams: Team[], features: Feature[] } {
  validateCSVStructure(data);

  const teams: Team[] = [];
  const features: Feature[] = [];

  const featureSectionStart = data.findIndex(row => row['Team Name'] === 'Feature ID');

  // Process teams
  for (let i = 0; i < featureSectionStart; i++) {
    const row = data[i];
    const pastThroughput = row['Past Throughput'].replace(/"/g, '').split(',').map(Number);
    if (pastThroughput.some(isNaN)) {
      throw new Error(`Invalid Past Throughput for team ${row['Team Name']}`);
    }
    teams.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: row['Team Name'],
      wipLimit: parseInt(row['WIP Limit']),
      pastThroughput,
      features: []
    });
  }

  // Process features
  const teamFeatureCounts: { [teamId: string]: number } = {};
  for (let i = featureSectionStart + 1; i < data.length; i++) {
    const row = data[i];
    const size = parseInt(row['Size']);
    if (isNaN(size)) {
      throw new Error(`Invalid Size for feature ${row['Name']}`);
    }
    const teamId = teams.find(team => team.name === row['Team'])?.id;
    if (!teamId) {
      throw new Error(`Team not found for feature ${row['Name']}`);
    }
    if (!teamFeatureCounts[teamId]) {
      teamFeatureCounts[teamId] = 0;
    }
    teamFeatureCounts[teamId]++;
    features.push({
      id: row['Feature ID'],
      name: row['Name'],
      size,
      priority: teamFeatureCounts[teamId],
      teamId,
      isBlocked: false
    });
  }

  // Assign features to teams
  teams.forEach(team => {
    team.features = features.filter(feature => feature.teamId === team.id);
  });

  console.log('Processed teams:', teams);
  console.log('Processed features:', features);

  return { teams, features };
}

export function generateCSVTemplate(): string {
  const teamHeader = TEAM_HEADERS.join(',');
  const featureHeader = FEATURE_HEADERS.join(',');
  
  return `${teamHeader}
Team Alpha,3,"2,3,1,2,3"
Team Beta,4,"3,4,2,3,3"

${featureHeader}
1,Team Alpha,Feature 1,5
2,Team Beta,Feature 2,8`;
}