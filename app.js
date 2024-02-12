const express = require('express')

const morgan = require('morgan');

//intialize express app
const app = express();

//middlewares
app.use(express.json()); //send responses back in json format
app.use(morgan("tiny"));//if we hit any api endpoint this will log into our console

//routes
app.get("/", (req,res) => {
    res.send("Hello World");
})


//server configurations
//define port

const PORT=process.env.PORT || 4000;

//listen on port by our server
//we dont need to connect to our app before our database so we do await
app.listen(PORT , () => {
    console.log(`server listening on port: ${PORT}`)
});

