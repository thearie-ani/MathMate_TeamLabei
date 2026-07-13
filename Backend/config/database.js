import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected successfully.");
      
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (error) {
        console.error(`MongoDB connection fail: ${error}`);
        process.exit(1);
    }
};

export default connectDB;