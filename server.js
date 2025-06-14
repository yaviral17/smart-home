// server.js
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import cors from "cors";
import {  ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(bodyParser.json());

// ---- MONGODB CONFIG ----


const DB_NAME = "smarthome";
const COLLECTION_NAME = "appliances";
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
 let db;

let appliances = []; // In-memory for quick broadcast
let appliancesCollection = null;

// Connect to MongoDB
async function initMongo() {
  try {
  
    const client = new MongoClient(uri);
  await client.connect();
   db = client.db(DB_NAME);
    appliancesCollection = db.collection(COLLECTION_NAME);
    // Load all appliances to memory
    appliances = await appliancesCollection.find({}).toArray();
    console.log("MongoDB connected. Loaded appliances:", appliances.length);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
await initMongo();

// ------------- EXPRESS API -------------

// Add appliance
app.post("/appliances", async (req, res) => {
  const { name, pin, initialState } = req.body;
  if (typeof name !== "string" || typeof pin !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }
  const appliance = {
    name,
    pin,
    state: !!initialState,
  };
  const result = await appliancesCollection.insertOne(appliance);
  appliance._id = result.insertedId;
  appliances.push(appliance);
  broadcastApplianceList();
  res.status(201).json(appliance);
});

// Toggle appliance state
app.put("/appliances/:id/:state", async (req, res) => {
  const id = req.params.id;
  const state = req.params.state === "true";
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  // Find appliance
  const appliance = await appliancesCollection.findOne({ _id: new ObjectId(id) });
  if (!appliance) {
    return res.status(404).json({ error: "Appliance not found" });
  }
  // Update state
  await appliancesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { state } }
  );
  appliance.state = state;
  // Update in-memory list
  const index = appliances.findIndex(a => String(a._id) === id);
  if (index !== -1) {
    appliances[index].state = state;
  }
  broadcastApplianceList();
  res.json(appliance);  
});

// delete appliance
app.delete("/appliances/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  // Find and delete appliance
  const result = await appliancesCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Appliance not found" });
  }
  // Remove from in-memory list
  appliances = appliances.filter(a => String(a._id) !== id);
  broadcastApplianceList();
  res.status(204).send(); // No content
});

// ------------- WEBSOCKET ---------------
function broadcastApplianceList() {
  const list = appliances.map(a => ({
    id: String(a._id), name: a.name, pin: a.pin, state: a.state
  }));
  const data = JSON.stringify({ type: "appliances", appliances: list });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(data);
  });
}
wss.on("connection", ws => {
  // On new connection, send full list
  const list = appliances.map(a => ({
    id: String(a._id), name: a.name, pin: a.pin, state: a.state
  }));
  ws.send(JSON.stringify({ type: "appliances", appliances: list }));
});

// ------------- START -------------
const PORT = 4000;
server.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});