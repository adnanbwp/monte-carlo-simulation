import { addDays, parseISO, differenceInDays } from 'date-fns';
import { Team, Feature } from '../types';

const SIMULATION_RUNS = 10000;

function getRandomThroughput(pastThroughput: number[]): number {
  if (pastThroughput.length === 0) {
    console.warn('Past throughput is empty. Using default value of 1.');
    return 1;
  }
  return pastThroughput[Math.floor(Math.random() * pastThroughput.length)];
}

function isFeatureBlocked(feature: Feature, completedFeatures: Feature[]): boolean {
  if (!feature.dependencyId) return false;
  return !completedFeatures.some(f => f.id === feature.dependencyId);
}

function getAvailableFeatures(team: Team, completedFeatures: Feature[], blockedFeatures: Set<string>): Feature[] {
  return team.features
    .filter(f => !isFeatureBlocked(f, completedFeatures) && !completedFeatures.includes(f))
    .sort((a, b) => {
      if (blockedFeatures.has(a.id) && !blockedFeatures.has(b.id)) return -1;
      if (!blockedFeatures.has(a.id) && blockedFeatures.has(b.id)) return 1;
      return a.priority - b.priority;
    })
    .slice(0, team.wipLimit);
}

export function runSimulation(teams: Team[], dueDateString: string): Team[] {
  if (teams.length === 0) {
    throw new Error('No teams provided for simulation.');
  }

  const startDate = new Date();
  const dueDate = parseISO(dueDateString);
  const daysUntilDueDate = differenceInDays(dueDate, startDate);

  if (daysUntilDueDate <= 0) {
    throw new Error('Due date must be in the future.');
  }

  const simulationResults: { [featureId: string]: Date[] } = {};

  for (let run = 0; run < SIMULATION_RUNS; run++) {
    const completedFeatures: Feature[] = [];
    const inProgressFeatures: { [teamId: string]: { feature: Feature, remainingWork: number }[] } = {};
    const blockedFeatures: Set<string> = new Set();

    for (let dayCounter = 0; dayCounter <= daysUntilDueDate; dayCounter++) {
      simulateDay(teams, dayCounter, startDate, completedFeatures, inProgressFeatures, blockedFeatures, simulationResults);
    }
  }

  return calculateResults(teams, simulationResults);
}

function simulateDay(
  teams: Team[],
  dayCounter: number,
  startDate: Date,
  completedFeatures: Feature[],
  inProgressFeatures: { [teamId: string]: { feature: Feature, remainingWork: number }[] },
  blockedFeatures: Set<string>,
  simulationResults: { [featureId: string]: Date[] }
) {
  for (const team of teams) {
    if (!inProgressFeatures[team.id]) {
      inProgressFeatures[team.id] = [];
    }

    const { updatedInProgress, newlyCompleted } = processCompletedFeatures(inProgressFeatures[team.id]);
    inProgressFeatures[team.id] = updatedInProgress;
    completedFeatures.push(...newlyCompleted);
    recordCompletions(newlyCompleted, dayCounter, startDate, simulationResults);

    updateBlockedFeatures(team.features, completedFeatures, blockedFeatures);

    addNewFeatures(team, completedFeatures, blockedFeatures, inProgressFeatures);

    allocateDailyThroughput(team, inProgressFeatures[team.id]);
  }
}

function recordCompletions(
  newlyCompleted: Feature[],
  dayCounter: number,
  startDate: Date,
  simulationResults: { [featureId: string]: Date[] }
) {
  newlyCompleted.forEach(feature => {
    if (!simulationResults[feature.id]) {
      simulationResults[feature.id] = [];
    }
    const completionDate = addDays(startDate, dayCounter);
    simulationResults[feature.id].push(completionDate);
  });
}

function processCompletedFeatures(inProgressFeatures: { feature: Feature, remainingWork: number }[]): 
  { updatedInProgress: typeof inProgressFeatures, newlyCompleted: Feature[] } {
  const updatedInProgress = [];
  const newlyCompleted = [];
  for (const item of inProgressFeatures) {
    if (item.remainingWork <= 0) {
      newlyCompleted.push(item.feature);
    } else {
      updatedInProgress.push(item);
    }
  }
  return { updatedInProgress, newlyCompleted };
}

function updateBlockedFeatures(features: Feature[], completedFeatures: Feature[], blockedFeatures: Set<string>): void {
  features.forEach(feature => {
    if (isFeatureBlocked(feature, completedFeatures)) {
      blockedFeatures.add(feature.id);
    } else {
      blockedFeatures.delete(feature.id);
    }
  });
}

function addNewFeatures(team: Team, completedFeatures: Feature[], blockedFeatures: Set<string>, 
  inProgressFeatures: { [teamId: string]: { feature: Feature, remainingWork: number }[] }): void {
  while (inProgressFeatures[team.id].length < team.wipLimit) {
    const availableFeatures = getAvailableFeatures(team, completedFeatures, blockedFeatures)
      .filter(f => !inProgressFeatures[team.id].some(item => item.feature.id === f.id));
    if (availableFeatures.length === 0) break;
    inProgressFeatures[team.id].push({
      feature: availableFeatures[0],
      remainingWork: availableFeatures[0].size
    });
  }
}

function allocateDailyThroughput(team: Team, teamInProgress: { feature: Feature, remainingWork: number }[]): void {
  const dailyThroughput = getRandomThroughput(team.pastThroughput);
  let remainingThroughput = dailyThroughput;

  for (const item of teamInProgress) {
    const work = Math.min(item.remainingWork, remainingThroughput);
    item.remainingWork -= work;
    remainingThroughput -= work;
    if (remainingThroughput <= 0) break;
  }
}

function calculateResults(teams: Team[], simulationResults: { [featureId: string]: Date[] }): Team[] {
  return teams.map(team => ({
    ...team,
    features: team.features.map(feature => {
      const completions = simulationResults[feature.id] || [];
      const probability = (completions.length / SIMULATION_RUNS) * 100;

      let expectedDate = 'N/A';
      if (completions.length > 0) {
        completions.sort((a, b) => a.getTime() - b.getTime());
        const percentileIndex = Math.floor(0.85 * completions.length);
        expectedDate = completions[percentileIndex].toISOString().split('T')[0];
      }

      return {
        ...feature,
        probability,
        expectedDate,
      };
    }),
  }));
}