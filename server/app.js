const express = require('express');
require('express-async-errors');
require('dotenv').config();
const app = express();

const dogRouter = require('./routes/dogs');

app.use(express.json());
app.use('/dogs', dogRouter);

//middleware function for logging method, url, & statusCode
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(req.method, req.url, res.statusCode);
  })

  next();
})

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.send("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.send(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

//middleware function for creating a new error
app.use((req, res) => {
  const err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  throw err;
})

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.statusCode || 500)
  if(process.env.NODE_ENV !== "production") {
  res.send({
    "Error Message": `${err.message}`,
    "Status Code": `${res.statusCode}`,
    "Error Stack": `${err.stack}`
  })
}
else {
  res.send({
    "Error Message": `${err.message}`,
    "Status Code": `${res.statusCode}`
  })
}

})


const port = process.env.PORT || 5070
app.listen(port, () => console.log(`Server is listening on port ${port}`));
