const dns = require("dns");
const mongoose = require("mongoose");

const applyAtlasDnsFallback = (mongoUri) => {
  if (!mongoUri?.startsWith("mongodb+srv://")) {
    return;
  }

  const dnsServers = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  applyAtlasDnsFallback(process.env.MONGO_URI);

  const connection = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log("MongoDB connected");

  return connection;
};

module.exports = connectDB;
