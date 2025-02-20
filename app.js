const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const connectToDB = require('./config/db')
connectToDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const userRouter = require('./routes/userRoutes');
app.use('/user', userRouter);

const incidentRouter = require('./routes/incidentRoutes');
app.use('/incident', incidentRouter)

const emergencyRouter = require('./routes/emergencyRoutes')
app.use('/emergency', emergencyRouter);
app.use(cors());

app.listen(PORT, () => {
    console.log('Server Running on port 3000');
})