const { MongoClient } = require("mongodb");

// Create a MongoClient instance
const client = new MongoClient(process.env.MONGO_URI);

// Function to connect to the MongoDB cluster
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Export the client and connection function
module.exports = {
  client,
  connectToMongoDB,
};
