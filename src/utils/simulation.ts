import { addDays, isBefore, isEqual } from 'date-fns';

interface Feature {
  id: string;
  name: string;
  size: number;
  priority: number;
  probability?: number;
  expectedDate?: string;
}

interface SimulationResult {
  completed: boolean;
  completionDate: Date | null;
}

export const runSimulation = (features: Feature[], dueDate: string, pastThroughput: number[], wipLimit: number): Feature[] => {
  const simulationRuns = 1000;
  const startDate = new Date();
  const dueDateObj = new Date(dueDate);
  
  const simulationResults: SimulationResult[][] = [];

  for (let run = 0; run < simulationRuns; run++) {
    let currentDate = new Date(startDate);
    const runResults: SimulationResult[] = new Array(features.length).fill({ completed: false, completionDate: null });
    const activeFeatures: { index: number; remainingSize: number }[] = [];
    let nextFeatureIndex = 0;

    while (isBefore(currentDate, dueDateObj) || isEqual(currentDate, dueDateObj)) {
      // Start new day: add new features if possible
      while (activeFeatures.length < wipLimit && nextFeatureIndex < features.length) {
        activeFeatures.push({ index: nextFeatureIndex, remainingSize: features[nextFeatureIndex].size });
        nextFeatureIndex++;
      }

      if (activeFeatures.length === 0) break; // No more work to do

      const dailyThroughput = pastThroughput[Math.floor(Math.random() * pastThroughput.length)];
      
      // Distribute throughput
      if (dailyThroughput % activeFeatures.length === 0) {
        // Equal distribution
        const throughputPerFeature = Math.floor(dailyThroughput / activeFeatures.length);
        activeFeatures.forEach(feature => {
          feature.remainingSize = Math.max(0, feature.remainingSize - throughputPerFeature);
        });
      } else {
        // Prioritized distribution
        let remainingThroughput = dailyThroughput;
        activeFeatures.sort((a, b) => features[a.index].priority - features[b.index].priority);
        for (let feature of activeFeatures) {
          const work = Math.min(feature.remainingSize, remainingThroughput);
          feature.remainingSize -= work;
          remainingThroughput -= work;
          if (remainingThroughput === 0) break;
        }
      }

      // Check for completed features
      for (let i = activeFeatures.length - 1; i >= 0; i--) {
        if (activeFeatures[i].remainingSize === 0) {
          runResults[activeFeatures[i].index] = { completed: true, completionDate: new Date(currentDate) };
          activeFeatures.splice(i, 1);
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    // Mark uncompleted features
    activeFeatures.forEach(feature => {
      runResults[feature.index] = { completed: false, completionDate: null };
    });

    simulationResults.push(runResults);
  }

  return features.map((feature, index) => {
    const completions = simulationResults.filter(run => run[index].completed).length;
    const probability = (completions / simulationRuns) * 100;

    const completionDates = simulationResults
      .map(run => run[index].completionDate)
      .filter((date): date is Date => date !== null);
    
    let expectedDate = 'N/A';
    if (completionDates.length > 0) {
      completionDates.sort((a, b) => a.getTime() - b.getTime());
      const percentileIndex = Math.ceil(0.85 * completionDates.length) - 1;
      expectedDate = completionDates[percentileIndex].toISOString().split('T')[0];
    }

    return {
      ...feature,
      probability,
      expectedDate
    };
  });
};