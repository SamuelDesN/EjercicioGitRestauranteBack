const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv=require("dotenv")
const { MongoClient } = require('mongodb');
dotenv.config();


const middlewares = require('./middlewares');  

const app = express();

app.use(morgan('dev'));      
app.use(helmet());           
app.use(cors());             
app.use(express.json());     


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);


app.get("/", (req, res) => {
    res.json({
        message: 'On',
    });
});


app.get("/api/users", async (req, res) => {

});


app.post("/api/users", async (req, res) => {
  
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = app;
