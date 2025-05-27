

---

# 🏡 SmartHome WebSocket Server & ESP32 Client

A real-time, dynamic, and open-source smart home control system using Node.js 
and ESP32!

Easily control and monitor all your home appliances with low-latency WebSocket magic. ✨

This project allows you to add, remove, and rename appliances on-the-fly, making it perfect for DIY enthusiasts and IoT projects.

<br>


## ✨ Features


- 🍏 Real-time Control: Instantly switch ON/OFF appliances from anywhere
- 🔄 Dynamic Device Management: Add, remove, or rename appliances on-the-fly
- 💡 Supports Any Appliance: ACs, lights, pumps, fans—add anything!
- ⚡ Lightning Fast: Uses efficient WebSocket protocol for instant updates
- 🔒 Open Source & Customizable: Hack, expand, and make it yours!



<br>


## 📦 Project Structure


```txt
smarthome-ws-server/
├── server.js        # Node.js WebSocket server
├── esp32_client/    # ESP32 Arduino source code
├── README.md
└── (other files)
```

<br>
<br>

# 🚀 Getting Started
<br>

#### 1. Clone this repo

```bash
git clone https://github.com/yaviral17/smart-home.git
cd smart-home
```
<br>

#### 2. Start the Node.js WebSocket Server
- Install dependencies:
```bash
npm install ws
```
- Run the server:
```bash
node server.js
```
- Default server runs on ws://localhost:8080

<br>

#### 3. Flash ESP32 Client
- Open esp32_client/esp32_ws_client.ino (or the provided sketch) in Arduino IDE
- Set your WiFi credentials and WebSocket server IP
- Map your appliances to the correct ESP32 GPIO pins in the code
- Install required libraries (via Arduino Library Manager):
- WebSockets by Markus Sattler
- ArduinoJson by Benoit Blanchon
- Upload to your ESP32

<br>

## 🔧 Device Management Commands

You can manage your appliances in real time via WebSocket messages (e.g., from a dashboard or script):

Command	Example Payload	Description
<div style="overflow-x:auto">

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Example Payload</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Add device</strong></td>
      <td><code>{ "type": "add", "device": "fan" }</code></td>
      <td>Add new device (default OFF)</td>
    </tr>
    <tr>
      <td><strong>Remove device</strong></td>
      <td><code>{ "type": "remove", "device": "ac" }</code></td>
      <td>Remove device</td>
    </tr>
    <tr>
      <td><strong>Rename device</strong></td>
      <td><code>{ "type": "rename", "old": "ac", "new": "main_ac" }</code></td>
      <td>Rename device</td>
    </tr>
    <tr>
      <td><strong>Set state</strong></td>
      <td><code>{ "type": "set", "device": "main_ac", "state": true }</code></td>
      <td>Turn device ON/OFF</td>
    </tr>
    <tr>
      <td><strong>List devices</strong></td>
      <td><code>{ "type": "list" }</code></td>
      <td>Get current device states</td>
    </tr>
  </tbody>
</table>

</div>

The server broadcasts device state to all clients, keeping everyone in sync!

<br>

## 💡 Example Use Cases
- 🖥️ Control from Web Dashboard: Add a React or Vue dashboard for easy control
- 📱 Mobile App Integration: Control via phone using any WebSocket client
- 🤖 Voice Assistants: Bridge with Alexa/Google Home for voice control
- 🔬 DIY IoT Projects: Use as a base for automation, scheduling, or monitoring!



## 🛠️ Tech Stack
- Server: Node.js, ws
- Client: ESP32 (Arduino), arduinoWebSockets, ArduinoJson
- Protocols: WebSocket

<br>

## 📝 Example ESP32 Code

See esp32_client/esp32_ws_client.ino for full code!


## ⚡ Tips & Expansion Ideas
- Persist appliance states with a database or file (for power loss recovery)
- Add authentication for security
- Build a front-end dashboard (React, Vue, etc.)
- Integrate sensors (temperature, humidity, etc.)
- Use MQTT for more complex IoT setups

<br>

# 🙌 Contributing

Pull requests, issues, and ideas are always welcome!
1. Fork this repo
2. Create a new branch (git checkout -b feature-x)
3. Commit your changes (git commit -am 'Add new feature')
4. Push to the branch (git push origin feature-x)
5. Create a pull request

<br>

# 📢 License

MIT License – Free to use, modify, and share.

<br>

# ❤️ Credits

Built with 🧡 by Aviral

<br>

Happy Automating!
Have questions or want to show off your setup? Open an issue or start a discussion!

---

Tip: _**When you paste this in your markdown file, all inner code blocks and tables will render perfectly!
Let me know if you want this as a downloadable file.**_