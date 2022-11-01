const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(session({ secret: "wind"}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE, (e)=>{
    if(e) return e;
    console.log("database connected successfully");
})

app.get('/', (req, res) => {
    res.send("File Tracker");
})

const authRouter = require("./routes/authRouter");
app.use('/auth', authRouter);
app.get('*', (req, res)=>{
    res.status(404).json({
        status: "FAIL",
        data:{
            message: "Can't find this route in the server"
        }
    })
})

app.listen(PORT, (req, res)=>{
    console.log(`Server is running on ${PORT}`);
})