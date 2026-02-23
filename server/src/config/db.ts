import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected");
    console.log("Connected DB:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI || "");

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
