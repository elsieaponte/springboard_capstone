import mongoose, { mongo } from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('connected successfully');
        });
    }
    catch (err) {
        console.log(err);
    }
}