// Q1 

//Hitarth Rathod
//RA2111003010762


import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 9876;
const windowSize = 10;
let storedNumbers = [];

app.use(bodyParser.json());

// I have created Endpoint to handle incoming requests
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  try {
    const response = await axios.get(`http://20.244.56.144/test/${numberid}`);

    const newNumbers = response.data;
// here I have filter out duplicate numbers

    storedNumbers = [...new Set([...storedNumbers, ...newNumbers])];
// also add new numbers
    if (storedNumbers.length > windowSize) {
      storedNumbers = storedNumbers.slice(-windowSize);
    }
// Here I have calculated the avgerage number 
    let avg = null;
    if (storedNumbers.length === windowSize) {
      avg = storedNumbers.reduce((acc, curr) => acc + curr, 0) / windowSize;
    }

    res.json({
      windowPrevState: storedNumbers.slice(0, -newNumbers.length),
      windowCurrState: storedNumbers,
      numbers: newNumbers,
      avg: avg !== null ? avg.toFixed(2) : null
    });
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).send('Internal Server Error');
  }
});

// here, I will start the server

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
