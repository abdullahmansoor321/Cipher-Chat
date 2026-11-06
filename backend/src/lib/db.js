
import mongoose from "mongoose";
import dns from "node:dns";
import { ENV } from "./env.js";

// Fix Node.js DNS resolution for MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;

    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const conn = await mongoose.connect(ENV.MONGO_URI);

    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    console.error("Error connection to MONGODB:", error);
    process.exit(1);
  }
};
