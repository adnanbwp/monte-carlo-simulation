# Monte Carlo Simulation App for Project Management

This React application provides a Monte Carlo simulation tool for project management, allowing users to predict project outcomes based on historical data and current project structure.

## Features

- Multiple team support
- Feature management with priorities and dependencies
- Work in Progress (WIP) limits
- Monte Carlo simulation for completion probability
- 85th percentile completion date calculation
- CSV upload functionality for bulk data import
- Demo scenario loading

## New Feature: CSV Upload

We've added a new CSV upload feature to make it easier for users to input large amounts of data quickly and efficiently.

### Benefits:
- Quickly import team and feature data
- Easily transfer data from other project management tools
- Reduce manual data entry errors

### How to Use:
1. Prepare your CSV file with team and feature data (see template below)
2. Click on the "Load Data From CSV" button in the Team Management section
3. Select your CSV file
4. The app will automatically parse and load your data

### CSV File Structure:
The CSV file should contain two sections:
1. Team data
2. Feature data

Example:
```
Team Name,WIP Limit,Past Throughput
Team A,3,"2,3,1,2,3"
Team B,4,"3,4,2,3,3"

Feature ID,Team,Name,Size
1,Team A,Feature 1,5
2,Team A,Feature 2,3
3,Team B,Feature 3,8
```

Note: Ensure there's an empty row between the team data and feature data sections.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the app in development mode with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Running Tests

Run `npm test` to execute the test suite.

## Built With

- React
- TypeScript
- Tailwind CSS

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.