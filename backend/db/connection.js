import mongoose from "mongoose";

const dbConnect = async (req, res) => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);

    }
};

export default dbConnect;
