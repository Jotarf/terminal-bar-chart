# terminal-bar-chart

Vertical and horizontal terminal bar chart based on JSON input

## Required Technologies

- [NodeJS](https://nodejs.org/) => 18.16.0

## Execution Steps

1. Clone the repository

   > git clone https://github.com/Jotarf/terminal-bar-chart.git

2. Change directory

   > cd terminal-bar-chart

3. Run app

   > node index.js JSON_FILE CHART_TYPE NORMALIZATION_VALUE BAR_WIDTH

   - JSON_FILE: JSON file name without ".json" extension, this file must be located in "data" folder ("dataset-1" is the default value)
   - CHART_TYPE: must be "vertical" or "horizontal" ("vertical" is the default value)
   - NORMALIZATION_VALUE: must be a number greater than 0 (10 is the default value)
   - BAR_WIDTH: must be a number greater than 0 (10 is the default value)
