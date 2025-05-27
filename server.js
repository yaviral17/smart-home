const WebSocket = require('ws');
const PORT = 6579;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

// Store appliances as a dynamic object
let appliances = {};

// Utility functions
function sendState(ws) {
  ws.send(JSON.stringify({ type: 'state', data: appliances }));
}

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('Client connected!');
  sendState(ws);

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);

      switch (msg.type) {
        case 'set':
          // {type: "set", device: "ac", state: true}
          if (appliances.hasOwnProperty(msg.device)) {
            appliances[msg.device] = !!msg.state;
            console.log(`Set ${msg.device} to ${msg.state}`);
            broadcast({ type: 'state', data: appliances });
          }
          break;

        case 'add':
          // {type: "add", device: "fan"} (default state: false)
          if (!appliances.hasOwnProperty(msg.device)) {
            appliances[msg.device] = false;
            console.log(`Added device: ${msg.device}`);
            broadcast({ type: 'state', data: appliances });
          }
          break;

        case 'remove':
          // {type: "remove", device: "ac"}
          if (appliances.hasOwnProperty(msg.device)) {
            delete appliances[msg.device];
            console.log(`Removed device: ${msg.device}`);
            broadcast({ type: 'state', data: appliances });
          }
          break;

        case 'rename':
          // {type: "rename", old: "ac", new: "main_ac"}
          if (appliances.hasOwnProperty(msg.old) && !appliances.hasOwnProperty(msg.new)) {
            appliances[msg.new] = appliances[msg.old];
            delete appliances[msg.old];
            console.log(`Renamed device ${msg.old} to ${msg.new}`);
            broadcast({ type: 'state', data: appliances });
          }
          break;

        case 'list':
          // Optional: list devices
          sendState(ws);
          break;

        // Add more commands if needed
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected!');
  });
});