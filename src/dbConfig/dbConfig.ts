import mongoose, { mongo } from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
        });
    }
    catch (err) {
        console.log("Failed to connect to the database", err);
    }
}