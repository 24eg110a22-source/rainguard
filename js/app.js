// RainGuard demo logic. Replace readSensors() with a real call to your
// hardware (e.g. fetch('/api/sensors') or an MQTT/WebSocket feed).
(function () {
  var HUMIDITY_LIMIT = 85, DRY_TICKS_TO_OPEN = 3;
  var state = { raining: false, humidity: 55, temp: 29, closed: false, mode: 'auto', dryTicks: 0 };
  var $ = function (id) { return document.getElementById(id); };
  var scene = $('scene');

  // build rain drops
  var rain = $('rain'), NS = 'http://www.w3.org/2000/svg';
  for (var i = 0; i < 46; i++) {
    var x = Math.round(Math.random() * 640), l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x); l.setAttribute('x2', x - 4);
    l.setAttribute('y1', 0); l.setAttribute('y2', 14);
    l.style.animationDuration = (0.7 + Math.random() * 0.6) + 's';
    l.style.animationDelay = (-Math.random() * 1.5) + 's';
    rain.appendChild(l);
  }

  function log(msg) {
    var li = document.createElement('li'), t = document.createElement('time');
    t.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    li.appendChild(t); li.appendChild(document.createTextNode(msg));
    $('log').insertBefore(li, $('log').firstChild);
  }

  function setCover(closed, reason) {
    if (state.closed === closed) return;
    state.closed = closed;
    log((closed ? 'Cover closed' : 'Cover opened') + ' (' + reason + ')');
    render();
  }

  function readSensors() {
    var target = state.raining ? 94 : 55;
    state.humidity += Math.round((target - state.humidity) * 0.35 + (Math.random() * 4 - 2));
    state.humidity = Math.max(30, Math.min(99, state.humidity));
    state.temp = Math.round((state.raining ? 24 : 29) + Math.random() * 2);
  }

  function decide() {
    if (state.mode !== 'auto') return;
    var wet = state.raining || state.humidity > HUMIDITY_LIMIT;
    if (wet) { state.dryTicks = 0; setCover(true, state.raining ? 'rain sensed' : 'high humidity'); }
    else if (state.closed && ++state.dryTicks >= DRY_TICKS_TO_OPEN) setCover(false, 'air is dry again');
  }

  function render() {
    scene.classList.toggle('wet', state.raining);
    scene.classList.toggle('closed', state.closed);
    $('rainVal').textContent = state.raining ? 'Raining' : 'Dry';
    $('rainVal').className = state.raining ? 'alert' : '';
    $('humVal').textContent = state.humidity + '%';
    $('tempVal').textContent = state.temp + '\u00a0°C';
    $('coverVal').textContent = state.closed ? 'Closed' : 'Open';
    $('headline').textContent = state.closed ? 'Clothes are covered' :
      (state.raining ? 'Rain is falling on your clothes' : 'Clothes are in the open');
    var manual = state.mode === 'manual';
    $('openBtn').disabled = !manual || !state.closed;
    $('closeBtn').disabled = !manual || state.closed;
  }

  document.querySelectorAll('input[name=mode]').forEach(function (r) {
    r.addEventListener('change', function () {
      state.mode = r.value; log('Mode set to ' + r.value); decide(); render();
    });
  });
  $('openBtn').onclick = function () { setCover(false, 'manual'); };
  $('closeBtn').onclick = function () { setCover(true, 'manual'); };
  $('rainBtn').onclick = function () {
    state.raining = !state.raining;
    this.setAttribute('aria-pressed', state.raining);
    this.textContent = state.raining ? 'Stop rain' : 'Simulate rain';
    log(state.raining ? 'Rain started' : 'Rain stopped');
    decide(); render();
  };

  log('System ready');
  render();
  setInterval(function () { readSensors(); decide(); render(); }, 2000);
})();
