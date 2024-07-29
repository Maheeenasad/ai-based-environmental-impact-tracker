const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL
const uri = "mongodb+srv://ai-task:aitask@ai-task-manager.bgmmiuk.mongodb.net/environmentalTracker?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log("Connected to MongoDB");

        const collection = client.db("environmentalTracker").collection("submissions");

        app.get('/test', (req, res) => {
            res.send('Server is running!');
        });

        app.post('/submit', async (req, res) => {
            try {
                const { electricity, water, waste } = req.body;
                console.log('Received data:', { electricity, water, waste });

                // Insert form data into MongoDB
                const result = await collection.insertOne({ electricity, water, waste });
                console.log('Data saved:', result.ops);
                res.send('Form data received and saved');
            } catch (err) {
                console.error('Error saving data', err);
                res.status(500).send('Error saving data');
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

run().catch(console.dir);
