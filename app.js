const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
  });

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
  res.send(`We don't serve that here. Never call again!`);
})

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
})

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }

  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response 
  res.send(greeting);
});

//Assignment 1
app.get('/sum', (req, res) => {
  const numA = parseInt(req.query.a);
  const numB = parseInt(req.query.b);
  const sum = numA + numB

  res.send(`The sum of ${numA} and ${numB} is ${sum}.`)
});

//Assignment 2
app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  // validation: both value are required, shift must be a number
  if(!text) {
    return res
      .status(400)
      .send('text is required');
  }
  if(!shift) {
    return res
      .status(400)
      .send('shift is required');
  }
  
  // integer is a whole number, float is number with decimal point
  // parseFloat is used here to grab just the float in case its a string or includes text
  const numShift = parseFloat(shift);

  // Number.isNaN is a method that determines whether the pass value is not a number
  if(Number.isNaN(numShift)){
    return res
      .status(400)
      .send('shift must be a number');
  }

  const base = 'A'.charCodeAt(0); // get character code

  const cipher = text
    .toUpperCase()
    .split('') // creates an array of characters
    .map(char => { // map each orginal char to a converted char
      const code = char.charCodeAt(0); // get the char code
      if(code < base || code > (base + 26)) { //if it's not one of the 26 letters ignore it
        return char;
      }
      // othewise convert it and get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26

      //convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(''); // construct a string from the array

    res
      .status(200)
      .send(cipher);
});

//Assignment 3
app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  //validation
  // numbers array must exist
  if(!numbers) {
    return res
      .status(400)
      .send("numbers is required");
  }
  // must be an array
  if(!Array.isArray(numbers)) {
    return res
      .status(400)
      .send("numbers must be an array")
  }
  //numbers must be between 1 and 20
  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
  // must be 6 numbers
  if(guesses.length != 6) {
    return res 
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // here are the 20 numbers to choose from 
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  // randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran,1);
  }
  // compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct response
  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }

  res.send(responseText);
});