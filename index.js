const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors'); // Import the cors package


app.use(cors());

const PORT = process.env.PORT || 5000;

// Define the downsampling function
function downsampleData(data, desiredDataPoints) {
    const stepSize = Math.ceil(data.length / desiredDataPoints);
    const downsampledData = [];

    for (let i = 0; i < data.length; i += stepSize) {
        downsampledData.push(data[i]);
    }

    return downsampledData;
}

// Define the route for downsampling CSV data and sending to client
app.get('/graph', (req, res) => {
    const data = []; // Array to store CSV data

    // Read CSV file and parse its contents
    fs.createReadStream('./dataset.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Process each row of data
            // For example, extract timestamps and profit percentages
            // and store them in an array or object
            data.push({
                timestamp: row.timestamp, // Replace 'timestamp' with actual column name
                profitPercentage: row.profitPercentage // Replace 'profitPercentage' with actual column name
        });
        })
        .on('end', () => {
            // Once all data is processed, downsample it
            const desiredDataPoints = 100; // Adjust as needed
            const downsampledData = downsampleData(data, desiredDataPoints);

            // Send downsampled data as response to client
            res.json(downsampledData);
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
