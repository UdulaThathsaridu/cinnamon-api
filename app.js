require("dotenv").config({path:"./config/config.env"})
const express = require('express');
const morgan = require('morgan');
const connectDB = require("./config/db");
//middleware/auth will act as defender for the route
const auth =require("./middlewares/auth")
//intialize express app
const app = express();
var path = require('path');

//middlewares
app.use(express.json()); //send responses back in json format
app.use(morgan("tiny"));//if we hit any api endpoint this will log into our console
app.use(require("cors")());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes

//protected route

app.get("/protected",auth,(req,res)=>{
    return res.status(200).json({...req.user._doc});
});

app.use("/api",require("./routes/auth"));

app.use("/api/employees",require("./routes/employees"));

app.use("/api/payslips",require("./routes/payslips"));

app.use("/api/leaves",require("./routes/leaves"));

app.use("/api/suppliers",require("./routes/suppliers"));

app.use("/api/payments",require("./routes/payments"));

app.use("/api/products",require("./routes/products"));

app.use("/api/deliveries",require("./routes/deliveries"));

app.use("/api/inventories",require("./routes/inventories"));

app.use("/api/vehicles",require("./routes/vehicles"));

app.use("/api/invoices",require("./routes/invoices"));

app.use("/api/financials",require("./routes/financials"));

app.use("/api/reset-password",require("./routes/resetpasswordrequest"));

app.use("/api/carts",require("./routes/carts"));

app.use("/api/checkouts",require("./routes/checkouts"));

app.use("/api/customerorder",require("./routes/customerorder"));

//server configurations
//define port

const PORT=process.env.PORT || 4000;

//listen on port by our server
//we dont need to connect to our app before our database so we do await
app.listen(PORT, async () => {
    try{
        await connectDB();
        console.log(`server listening on port: ${PORT}`);

    } catch (error) {
        console.log("Error connecting to database:",error.message)

    }
});

