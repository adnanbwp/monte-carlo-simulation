# CSV Export Feature Implementation Plan

## 1. Update SimulationResultsSummary Component

File: `src/components/SimulationResultsSummary.tsx`

Changes:
- Add an "Export Results" button near the top of the component.
- Implement a state variable to track if a simulation has been run.
- Disable the export button if no simulation results are available.
- Add a function to handle the export process initiation.

## 2. Create CSV Export Utility Function

File: `src/utils/exportUtils.ts` (new file)

Changes:
- Create a new utility file for export-related functions.
- Implement a function `exportToCSV` that takes simulation results and generates a CSV string.
- Include logic to format dates as dd/mm/yyyy.
- Ensure all relevant data (overall probability, team summaries, feature details) are included in the CSV.

## 3. Update App Component for Export State Management

File: `src/App.tsx`

Changes:
- Add a state variable to track whether simulation results are available.
- Pass this state to SimulationResultsSummary component.
- Implement a function to update this state when a simulation is run successfully.

## 4. Implement Export Functionality in SimulationResultsSummary

File: `src/components/SimulationResultsSummary.tsx`

Changes:
- Import the `exportToCSV` function from exportUtils.
- Implement the export process:
  - Show a loading indicator (progress circle or animation) when export starts.
  - Call `exportToCSV` with current simulation results.
  - Use the `Blob` API to create a downloadable file from the CSV string.
  - Trigger the file download using a dynamically created `<a>` element.
  - Display a success message when the download starts.

## 5. Add Loading Indicator Component

File: `src/components/LoadingIndicator.tsx` (new file)

Changes:
- Create a new component for displaying a loading animation.
- This will be used during the export process.

## 6. Update Types (if necessary)

File: `src/types.ts`

Changes:
- If needed, add or modify types to support the new export functionality.

## 7. Update Styling

File: `src/index.css` or appropriate style file

Changes:
- Add styles for the new "Export Results" button.
- Add styles for the loading indicator.

## 8. Error Handling

Files: `src/components/SimulationResultsSummary.tsx` and `src/utils/exportUtils.ts`

Changes:
- Implement error handling in the export process.
- Display error messages to the user if the export fails.

## 9. Testing

File: `src/components/SimulationResultsSummary.test.tsx` (update or create)

Changes:
- Add unit tests for the new export functionality.
- Test scenarios: successful export, export with no data, error handling.

## 10. Update Documentation

File: `README.md`

Changes:
- Add information about the new CSV export feature in the project documentation.

This plan covers all aspects of implementing the CSV export feature based on our discussion. It provides a clear roadmap for the changes we need to make, ensuring we don't miss any crucial steps in the implementation process.