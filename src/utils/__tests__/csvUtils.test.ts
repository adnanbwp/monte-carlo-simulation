import { validateCSVStructure, processCSVData, generateCSVTemplate } from '../csvUtils';
import { CSVRow } from '../../types';

describe('csvUtils', () => {
  describe('validateCSVStructure', () => {
    it('validates correct CSV structure', () => {
      const validData: CSVRow[] = [
        { 'Team Name': 'Team 1', 'WIP Limit': '3', 'Past Throughput': '1,2,3' },
        { 'Feature ID': '1', 'Team': 'Team 1', 'Name': 'Feature 1', 'Size': '5' }
      ];
      expect(() => validateCSVStructure(validData)).not.toThrow();
    });

    it('throws error for empty CSV', () => {
      expect(() => validateCSVStructure([])).toThrow('CSV file is empty');
    });

    it('throws error for missing headers', () => {
      const invalidData: CSVRow[] = [
        { 'Team Name': 'Team 1', 'WIP Limit': '3' },
        { 'Feature ID': '1', 'Team': 'Team 1', 'Name': 'Feature 1' }
      ];
      expect(() => validateCSVStructure(invalidData)).toThrow('CSV file is missing required headers');
    });
  });

  describe('processCSVData', () => {
    it('processes valid CSV data', () => {
      const validData: CSVRow[] = [
        { 'Team Name': 'Team 1', 'WIP Limit': '3', 'Past Throughput': '1,2,3' },
        { '': '' },
        { 'Feature ID': '1', 'Team': 'Team 1', 'Name': 'Feature 1', 'Size': '5' }
      ];
      const result = processCSVData(validData);
      expect(result.teams).toHaveLength(1);
      expect(result.features).toHaveLength(1);
      expect(result.teams[0].name).toBe('Team 1');
      expect(result.features[0].name).toBe('Feature 1');
    });

    it('throws error for invalid past throughput', () => {
      const invalidData: CSVRow[] = [
        { 'Team Name': 'Team 1', 'WIP Limit': '3', 'Past Throughput': '1,2,a' },
        { '': '' },
        { 'Feature ID': '1', 'Team': 'Team 1', 'Name': 'Feature 1', 'Size': '5' }
      ];
      expect(() => processCSVData(invalidData)).toThrow('Invalid Past Throughput for team Team 1');
    });

    it('throws error for invalid feature size', () => {
      const invalidData: CSVRow[] = [
        { 'Team Name': 'Team 1', 'WIP Limit': '3', 'Past Throughput': '1,2,3' },
        { '': '' },
        { 'Feature ID': '1', 'Team': 'Team 1', 'Name': 'Feature 1', 'Size': 'large' }
      ];
      expect(() => processCSVData(invalidData)).toThrow('Invalid Size for feature Feature 1');
    });
  });

  describe('generateCSVTemplate', () => {
    it('generates a valid CSV template', () => {
      const template = generateCSVTemplate();
      expect(template).toContain('Team Name,WIP Limit,Past Throughput');
      expect(template).toContain('Feature ID,Team,Name,Size');
    });
  });
});