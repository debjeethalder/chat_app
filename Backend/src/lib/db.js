import mongoose from 'mongoose';


export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB in ' + conn.connection.host);                                                                      
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}