import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamManager from '../TeamManager';
import { Team, Feature } from '../../types';

jest.mock('react-dom/test-utils', () => ({
  ...jest.requireActual('react-dom/test-utils'),
  act: jest.requireActual('react').act,
}));

// Mock the CSVUploader component
jest.mock('../CSVUploader', () => ({ onDataLoaded }: { onDataLoaded: (teams: Team[], features: Feature[]) => void }) => (
  <button onClick={() => onDataLoaded([], [])} data-testid="csv-uploader">
    Load Data From CSV
  </button>
));

describe('TeamManager', () => {
  const mockProps = {
    teams: [],
    onAddTeam: jest.fn(),
    onUpdateTeam: jest.fn(),
    onRemoveTeam: jest.fn(),
    onLoadDemoTeams: jest.fn(),
    onCSVDataLoaded: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<TeamManager {...mockProps} />);
    expect(screen.getByText('Team Management')).toBeInTheDocument();
  });

  it('allows adding a new team', () => {
    render(<TeamManager {...mockProps} />);
    
    fireEvent.change(screen.getByPlaceholderText('Team Name'), { target: { value: 'New Team' } });
    fireEvent.change(screen.getByPlaceholderText('WIP Limit'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Past Throughput (comma-separated)'), { target: { value: '1,2,3' } });
    
    fireEvent.click(screen.getByText('Add Team'));
    
    expect(mockProps.onAddTeam).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Team',
      wipLimit: 5,
      pastThroughput: [1, 2, 3],
    }));
  });

  it('renders the CSVUploader component', () => {
    render(<TeamManager {...mockProps} />);
    expect(screen.getByTestId('csv-uploader')).toBeInTheDocument();
  });

  it('calls onCSVDataLoaded when CSV data is loaded', () => {
    render(<TeamManager {...mockProps} />);
    fireEvent.click(screen.getByTestId('csv-uploader'));
    expect(mockProps.onCSVDataLoaded).toHaveBeenCalled();
  });

  it('calls onLoadDemoTeams when Load Demo Teams button is clicked', () => {
    render(<TeamManager {...mockProps} />);
    fireEvent.click(screen.getByText('Load Demo Teams'));
    expect(mockProps.onLoadDemoTeams).toHaveBeenCalled();
  });

  // Add more tests as needed for other TeamManager functionality
});