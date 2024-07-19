export interface Feature {
  id: string;
  name: string;
  size: number;
  priority: number;
  teamId: string;
  isBlocked: boolean;
  dependencyId?: string;
  dependencyTeamId?: string;
  probability?: number;
  expectedDate?: string;
  completionDate?: Date;
}

export interface Team {
  id: string;
  name: string;
  wipLimit: number;
  pastThroughput: number[];
  features: Feature[];
}

export interface CSVRow {
  [key: string]: string;
}

// New type for processed CSV data
export interface CSVData {
  teams: Team[];
  features: Feature[];
}

