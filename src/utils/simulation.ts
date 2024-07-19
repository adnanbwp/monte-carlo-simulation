import { addDays, isBefore, isEqual, parseISO } from 'date-fns';
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
      // Prioritize previously blocked features
      if (blockedFeatures.has(a.id) && !blockedFeatures.has(b.id)) return -1;
      if (!blockedFeatures.has(a.id) && blockedFeatures.has(b.id)) return 1;
      // If both were blocked or both were not blocked, sort by original priority
      return a.priority - b.priority;
    })
    .slice(0, team.wipLimit);
}

export function runSimulation(teams: Team[], dueDateString: string): Team[] {
  if (teams.length === 0) {
    throw new Error('No teams provided for simulation.');
  }

  const dueDate = parseISO(dueDateString);
  const startDate = new Date();

  if (isBefore(dueDate, startDate)) {
    throw new Error('Due date must be in the future.');
  }

  const simulationResults: { [featureId: string]: Date[] } = {};

  for (let run = 0; run < SIMULATION_RUNS; run++) {
    let currentDate = new Date(startDate);
    const completedFeatures: Feature[] = [];
    const inProgressFeatures: { [teamId: string]: { feature: Feature, remainingWork: number }[] } = {};
    const blockedFeatures: Set<string> = new Set();

    while (isBefore(currentDate, dueDate) || isEqual(currentDate, dueDate)) {
      for (const team of teams) {
        if (!inProgressFeatures[team.id]) {
          inProgressFeatures[team.id] = [];
        }

        // Complete features that are done
        inProgressFeatures[team.id] = inProgressFeatures[team.id].filter(item => {
          if (item.remainingWork <= 0) {
            completedFeatures.push(item.feature);
            if (!simulationResults[item.feature.id]) {
              simulationResults[item.feature.id] = [];
            }
            // Create a new Date object to avoid the loop-func issue
            const completionDate = new Date(currentDate);
            simulationResults[item.feature.id].push(completionDate);
            return false;
          }
          return true;
        });

        // Update blocked features
        team.features.forEach(feature => {
          if (isFeatureBlocked(feature, completedFeatures)) {
            blockedFeatures.add(feature.id);
          } else {
            blockedFeatures.delete(feature.id);
          }
        });

        // Add new features if there's capacity
        while (inProgressFeatures[team.id].length < team.wipLimit) {
          const availableFeatures = getAvailableFeatures(team, completedFeatures, blockedFeatures)
            .filter(f => !inProgressFeatures[team.id].some(item => item.feature.id === f.id));
          if (availableFeatures.length === 0) break;
          inProgressFeatures[team.id].push({
            feature: availableFeatures[0],
            remainingWork: availableFeatures[0].size
          });
        }

        // Allocate daily throughput
        const dailyThroughput = getRandomThroughput(team.pastThroughput);
        let remainingThroughput = dailyThroughput;

        for (const item of inProgressFeatures[team.id]) {
          const work = Math.min(item.remainingWork, remainingThroughput);
          item.remainingWork -= work;
          remainingThroughput -= work;
          if (remainingThroughput <= 0) break;
        }
      }
      currentDate = addDays(currentDate, 1);
    }
  }

  // Calculate probabilities and expected dates
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