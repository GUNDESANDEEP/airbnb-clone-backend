require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// This will print the exact connection string your code is trying to use.
console.log("--- Testing with the following connection string ---");
console.log(uri);
console.log("-------------------------------------------------");

const testConnection = async () => {
  if (!uri) {
    console.error("ERROR: Your MONGO_URI is not set in the .env file!");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ SUCCESS: Database connection was successful!");
  } catch (error) {
    console.error("❌ FAILED: Authentication failed.");
    console.error("   This means your username or password in the connection string is wrong.");
  } finally {
    // Close the connection so the script can exit.
    await mongoose.connection.close();
  }
};

testConnection();