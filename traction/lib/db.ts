import mongoose from "mongoose";

const GREEN_TOOL_MONGODB_URI =
  process.env.GREEN_TOOL_MONGODB_URI!;

if (!GREEN_TOOL_MONGODB_URI) {
  throw new Error(
    "Please add GREEN_TOOL_MONGODB_URI"
  );
}

let isConnected = false;

export async function connectDB() {

  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {

    const db =
      await mongoose.connect(
        GREEN_TOOL_MONGODB_URI,
        {
          dbName: "bni_dashboard",
        }
      );

    isConnected =
      db.connections[0].readyState === 1;

    console.log("MongoDB Connected");

  } catch (error) {

    console.log(error);

    throw new Error(
      "MongoDB connection failed"
    );
  }
}