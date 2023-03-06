const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4000
const dbConfig = require('./config/db.config')
const songRoute = require('./routes/songs.routes');
const cors = require('cors');


app.use(express.json());
app.use(cors())
app.use('/songs', songRoute)



app.listen(port, ()=>{
    console.log(port)
   dbConfig
})
