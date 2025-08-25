import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/mma');
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    process.exit(1); // Detiene la ejecución si hay error
    }
}

export default connectDB