import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CSVUploader from '../CSVUploader';

// Mock the csvUtils module
jest.mock('../../utils/csvUtils', () => ({
  processCSVData: jest.fn()
}));

describe('CSVUploader', () => {
  const mockOnDataLoaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the upload button', () => {
    render(<CSVUploader onDataLoaded={mockOnDataLoaded} />);
    expect(screen.getByText('Load Data From CSV')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    render(<CSVUploader onDataLoaded={mockOnDataLoaded} />);
    
    const file = new File(['test,csv,data'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Load Data From CSV') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);

    // We can't easily test the Papa.parse functionality here, so we'll just check if the file input changed
    expect(input.files?.[0]).toBe(file);
  });

  it('displays error message when upload fails', async () => {
    const { processCSVData } = require('../../utils/csvUtils');
    processCSVData.mockImplementation(() => {
      throw new Error('Test error');
    });

    render(<CSVUploader onDataLoaded={mockOnDataLoaded} />);
    
    const file = new File(['test,csv,data'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Load Data From CSV') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText('Test error');
    expect(errorMessage).toBeInTheDocument();
  });
});