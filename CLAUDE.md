# Monte Carlo Simulation Project - Understanding Summary

## Project Overview
This is a React-based Monte Carlo simulation application for project management. It helps predict project completion probabilities and dates using statistical simulation techniques based on historical team performance data.

## Core Purpose
The application allows project managers to:
- Model multiple development teams with different throughput capabilities
- Define features with priorities, sizes, and dependencies
- Run Monte Carlo simulations to predict completion probabilities
- Calculate 85th percentile completion dates for features
- Import/export data via CSV for integration with other tools

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **PapaParse** for CSV handling
- **date-fns** for date manipulation

### Key Components
- `App.tsx` - Main application orchestrator
- `TeamManager.tsx` - Team creation and management
- `TeamTabs.tsx` - Feature management per team
- `SimulationResultsSummary.tsx` - Results display
- `CSVUploader.tsx` - Data import functionality
- `HelpModal.tsx` - User guidance

### Core Data Models
```typescript
interface Team {
  id: string;
  name: string;
  wipLimit: number;           // Work in Progress limit
  pastThroughput: number[];   // Historical velocity data
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  size: number;              // Story points/effort estimate
  priority: number;          // 1-based priority ordering
  teamId: string;
  isBlocked: boolean;
  dependencyId?: string;     // Feature dependency
  dependencyTeamId?: string; // Cross-team dependency
  probability?: number;      // Completion probability (post-simulation)
  expectedDate?: string;     // 85th percentile date (post-simulation)
}
```

## Simulation Engine (`src/utils/simulation.ts`)

### Algorithm Overview
1. **Monte Carlo Method**: Runs 10,000 simulation iterations
2. **Daily Simulation**: Each iteration simulates day-by-day progress
3. **WIP Constraints**: Respects team work-in-progress limits
4. **Dependency Management**: Features can depend on other features
5. **Random Throughput**: Uses historical data to randomize daily team velocity
6. **Priority-Based**: Higher priority features are worked on first

### Key Simulation Features
- **Blocked Feature Handling**: Features wait for dependencies
- **Cross-Team Dependencies**: Features can depend on other teams' work
- **Throughput Variability**: Uses past performance to model realistic velocity
- **Completion Probability**: Percentage of simulations where feature completes by due date
- **85th Percentile Dating**: Conservative completion estimate

## Business Features

### Team Management
- Multiple teams with individual WIP limits
- Historical throughput data for realistic modeling
- Demo data generation for testing

### Feature Management
- Priority-based feature ordering
- Cross-team and intra-team dependencies
- Feature blocking/unblocking
- Size estimation in story points

### Data Import/Export
- CSV template download
- Bulk data import via CSV
- Structured format for teams and features
- Integration with external project management tools

### Simulation Results
- Completion probability percentages
- 85th percentile completion dates
- Visual results summary
- Exportable results

## Development & Testing

### Available Commands
- `npm start` - Development server
- `npm test` - Run test suite
- `npm run build` - Production build
- `npm run deploy` - Deploy to GitHub Pages

### Test Coverage
- Component tests for critical UI elements
- Utility function tests for CSV parsing and simulation logic
- Located in `__tests__` directories

## Deployment
- Configured for GitHub Pages deployment
- Homepage set to: https://adnanbwp.github.io/monte-carlo-simulation
- Automated deployment via `gh-pages` package

## Recent Enhancements
Based on commit history, recent work includes:
- CSV export functionality improvements
- ESLint warning fixes
- Help content updates with simulation logic explanations
- Code cleanup and optimization

## Key Files for Development
- `src/App.tsx:128-155` - Main simulation trigger logic
- `src/utils/simulation.ts:30-56` - Core Monte Carlo algorithm
- `src/types.ts` - Type definitions
- `src/components/CSVUploader.tsx` - Data import functionality
- `src/utils/csvUtils.ts` - CSV processing utilities

This application represents a sophisticated project management tool that uses statistical modeling to provide data-driven insights for project planning and risk assessment.