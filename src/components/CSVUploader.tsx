import React, { useState } from 'react';
import Papa from 'papaparse';
import { CSVRow, Team, Feature } from '../types';
import { processCSVData } from '../utils/csvUtils';

interface CSVUploaderProps {
  onDataLoaded: (teams: Team[], features: Feature[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      Papa.parse<string[]>(file, {
        complete: (result: Papa.ParseResult<string[]>) => {
          try {
            const parsedData = parseCSV(result.data);
            console.log('Parsed data:', parsedData);
            const processedData = processCSVData(parsedData);
            console.log('Processed data:', processedData);
            onDataLoaded(processedData.teams, processedData.features);
            setError(null);
          } catch (err) {
            console.error('Error processing CSV:', err);
            setError((err as Error).message);
          }
        },
        error: (error: Error) => {
          console.error('Papa Parse error:', error);
          setError(`Error parsing CSV: ${error.message}`);
        },
      });
    }
  };

  const parseCSV = (rawData: string[][]): CSVRow[] => {
    const teamHeaders = rawData[0];
    const featureHeaderIndex = rawData.findIndex(row => row[0] === 'Feature ID');
    
    if (featureHeaderIndex === -1) {
      throw new Error('CSV file is missing feature data');
    }

    const featureHeaders = rawData[featureHeaderIndex];
    const teamData = rawData.slice(1, featureHeaderIndex- 1);
    const featureData = rawData.slice(featureHeaderIndex + 1);

    const parsedData: CSVRow[] = [
      ...teamData.map(row => {
        const rowData: CSVRow = {};
        teamHeaders.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      }),
      { 'Team Name': 'Feature ID' } as CSVRow, // Marker row
      ...featureData.map(row => {
        const rowData: CSVRow = {};
        featureHeaders.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      })
    ];

    return parsedData;
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-file-input"
      />
      <label
        htmlFor="csv-file-input"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer inline-block"
      >
        Load Data From CSV
      </label>
      {error && (
        <div className="text-red-500 mt-2 whitespace-pre-wrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVUploader;