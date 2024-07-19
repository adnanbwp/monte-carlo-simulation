import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock child components
jest.mock('./components/TeamManager', () => () => <div data-testid="team-manager">Team Manager</div>);
jest.mock('./components/TeamTabs', () => () => <div data-testid="team-tabs">Team Tabs</div>);
jest.mock('./components/SimulationResultsSummary', () => () => <div data-testid="simulation-results">Simulation Results</div>);
jest.mock('./components/HelpModal', () => ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
  isOpen ? <div data-testid="help-modal">Help Modal <button onClick={onClose}>Close</button></div> : null
);
jest.mock('./components/CSVTemplate', () => () => <div data-testid="csv-template">CSV Template</div>);

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Monte Carlo Simulation with Multiple Teams/i)).toBeInTheDocument();
  });

  it('renders the TeamManager component', () => {
    render(<App />);
    expect(screen.getByTestId('team-manager')).toBeInTheDocument();
  });

  it('renders the CSVTemplate component', () => {
    render(<App />);
    expect(screen.getByTestId('csv-template')).toBeInTheDocument();
  });

  it('opens and closes the Help Modal', () => {
    render(<App />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Help'));
    expect(screen.getByTestId('help-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument();
  });

  it('disables the simulation button when there is no data', () => {
    render(<App />);
    const simulationButton = screen.getByText('Run Simulation for All Teams');
    expect(simulationButton).toBeDisabled();
  });

  it('updates the due date when input changes', () => {
    render(<App />);
    const dueDateInput = screen.getByLabelText('Project Due Date:') as HTMLInputElement;
    fireEvent.change(dueDateInput, { target: { value: '2023-12-31' } });
    expect(dueDateInput.value).toBe('2023-12-31');
  });

  // Add more tests as needed for other App component functionality
});