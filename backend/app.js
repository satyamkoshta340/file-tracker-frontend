const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("File Tracker");
})
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