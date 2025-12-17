import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import authRoute from './routes/authRoute.js';
import registerRoute from './routes/registerRoute.js';
import searchRoute from './routes/searchRoute.js';
import appointmentRoute from './routes/appointmentRoute.js';
import medicineRoute from './routes/medicineRoute.js';
import ambulanceRoute from './routes/ambulanceRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use(cors());


app.use('/api/auth', authRoute);
app.use('/api/register', registerRoute);
app.use('/api/search', searchRoute);
app.use('/api/appointments', appointmentRoute);
app.use('/api/medicine', medicineRoute);
app.use('/api/ambulance', ambulanceRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
