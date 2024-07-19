import { Team, Feature } from '../types';

export function checkCircularDependency(
  teams: Team[],
  currentFeature: Feature,
  dependencyFeatureId: string,
  dependencyTeamId: string
): boolean {
  const visited = new Set<string>();

  function dfs(featureId: string, teamId: string): boolean {
    const key = `${teamId}-${featureId}`;
    if (visited.has(key)) return false;
    visited.add(key);

    const team = teams.find(t => t.id === teamId);
    if (!team) return false;

    const feature = team.features.find(f => f.id === featureId);
    if (!feature) return false;

    if (feature.id === currentFeature.id) return true;

    if (feature.dependencyId && feature.dependencyTeamId) {
      return dfs(feature.dependencyId, feature.dependencyTeamId);
    }

    return false;
  }

  return dfs(dependencyFeatureId, dependencyTeamId);
}