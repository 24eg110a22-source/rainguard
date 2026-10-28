# RainGuard: Smart Automatic Clothes Protection System

Frontend dashboard for a rain-sensing clothesline cover.

## Run
Open `index.html` in a browser. No build step or install needed.

## Structure
- `index.html` page and live clothesline scene
- `css/style.css` styles (light and dark, responsive)
- `js/app.js` simulated sensors and cover logic

## Connect hardware
In `js/app.js`, replace `readSensors()` with a call to your device
(HTTP, WebSocket or MQTT bridge) and set `state.raining`, `state.humidity`
and `state.temp` from it. To drive the motor, send the open/close command
inside `setCover()`.
