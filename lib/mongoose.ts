import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGGODB_URL) return console.log("MONGGODB_URL not found");
    if (isConnected) return console.log("already Connected to MonggoDB");

    try {
        await mongoose.connect(process.env.MONGGODB_URL);

        isConnected = true;
        console.log("connected to monggoDB");
    } catch (error) {
        console.log(error);
    }
}