
const express = require('express');
const logger = require('morgan');
const mongoClient = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config()


//connect DB with mongoose
mongoClient.connect("mongodb://127.0.0.1:27017/nodejsapi")
        .then(()=>console.log('DB connected!!'))
        .catch((err)=>console.error(`Connect DB is failed with err: ${err}`))



const app = express();

const userRoute = require('./routes/User')
const deckRoute = require('./routes/Deck')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// middleware
app.use(logger('dev'))

//
app.use('/decks', deckRoute)
app.use('/users',userRoute)


app.get('/',(req, res, next) => {
    return res.status(200).json({
        message: 'Server running OK (update)!'
    })
})

//catch 404 Errors and forward the to error handle

app.use((req, res, next) => {
    const err = new Error('Not found!')
    err.status = 404
    next(err)
})


//Error handle funtion
app.use((err, req, res, next) => {
    const error = app.get('env')=== 'development' ? err : {}
    const status = err.status || 500

    //respone to client 

    return res.status(status).json({
        error: {
            message: error.message,
        }
    })
})

// start server 
const port = app.get('port') || 3000
app.listen(port, ()=> console.log(`server listening on port: http://localhost:${port}`))