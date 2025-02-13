let audioContext = null;
let isPlaying = false;
const oscillators = [];
function createOscillatorModule() {
  const module = document.createElement('div');
  module.className = 'module';
  module.innerHTML = `
    <h2>Oscillator ${oscillators.length + 1}</h2>
    <div class="control">
      <label>Waveform</label>
      <select class="waveform">
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
    </div>
    <div class="control">
      <label>Frequency: <span class="frequencyDisplay">440</span> Hz</label>
      <input type="range" class="frequency" min="20" max="2000" value="440">
      <div class="automation-control">
        <label class="automation-label">Frequency Automation</label>
        <div class="range-inputs">
          <input type="number" class="frequencyMin" value="20" min="20" max="2000"> -
          <input type="number" class="frequencyMax" value="2000" min="20" max="2000">
        </div>
        <label class="automation-label">Speed: <span class="frequencySpeedDisplay">0</span></label>
        <input type="range" class="frequencySpeed" min="0" max="5" step="0.1" value="0">
      </div>
    </div>
    <div class="control">
      <label>Filter Cutoff: <span class="filterDisplay">1000</span> Hz</label>
      <input type="range" class="filter" min="20" max="5000" value="1000">
      <div class="automation-control">
        <label class="automation-label">Filter Automation</label>
        <div class="range-inputs">
          <input type="number" class="filterMin" value="20" min="20" max="5000"> -
          <input type="number" class="filterMax" value="5000" min="20" max="5000">
        </div>
        <label class="automation-label">Speed: <span class="filterSpeedDisplay">0</span></label>
        <input type="range" class="filterSpeed" min="0" max="5" step="0.1" value="0">
      </div>
    </div>
    <div class="control">
      <label>Resonance: <span class="resonanceDisplay">0</span></label>
      <input type="range" class="resonance" min="0" max="20" value="0">
    </div>
    <div class="control">
      <label>LFO Rate: <span class="lfoRateDisplay">2</span> Hz</label>
      <input type="range" class="lfoRate" min="0.1" max="20" step="0.1" value="2">
      <div class="automation-control">
        <label class="automation-label">LFO Rate Automation</label>
        <div class="range-inputs">
          <input type="number" class="lfoRateMin" value="0.1" min="0.1" max="20" step="0.1"> -
          <input type="number" class="lfoRateMax" value="20" min="0.1" max="20" step="0.1">
        </div>
        <label class="automation-label">Speed: <span class="lfoRateSpeedDisplay">0</span></label>
        <input type="range" class="lfoRateSpeed" min="0" max="5" step="0.1" value="0">
      </div>
    </div>
    <div class="control">
      <label>LFO Depth: <span class="lfoDepthDisplay">0</span>%</label>
      <input type="range" class="lfoDepth" min="0" max="100" value="0">
    </div>
    <div class="control">
      <label>Volume: <span class="volumeDisplay">50</span>%</label>
      <input type="range" class="volume" min="0" max="100" value="50">
    </div>
  `;
  document.getElementById('synthContainer').appendChild(module);
  return module;
}
document.getElementById('addOscillatorBtn').addEventListener('click', () => {
  const module = createOscillatorModule();
  const oscillator = {
    module,
    controls: {
      waveform: module.querySelector('.waveform'),
      frequency: module.querySelector('.frequency'),
      filter: module.querySelector('.filter'),
      resonance: module.querySelector('.resonance'),
      lfoRate: module.querySelector('.lfoRate'),
      lfoDepth: module.querySelector('.lfoDepth'),
      frequencySpeed: module.querySelector('.frequencySpeed'),
      filterSpeed: module.querySelector('.filterSpeed'),
      lfoRateSpeed: module.querySelector('.lfoRateSpeed'),
      frequencyMin: module.querySelector('.frequencyMin'),
      frequencyMax: module.querySelector('.frequencyMax'),
      filterMin: module.querySelector('.filterMin'),
      filterMax: module.querySelector('.filterMax'),
      lfoRateMin: module.querySelector('.lfoRateMin'),
      lfoRateMax: module.querySelector('.lfoRateMax'),
      volume: module.querySelector('.volume')
    },
    displays: {
      frequency: module.querySelector('.frequencyDisplay'),
      filter: module.querySelector('.filterDisplay'),
      resonance: module.querySelector('.resonanceDisplay'),
      lfoRate: module.querySelector('.lfoRateDisplay'),
      lfoDepth: module.querySelector('.lfoDepthDisplay'),
      frequencySpeed: module.querySelector('.frequencySpeedDisplay'),
      filterSpeed: module.querySelector('.filterSpeedDisplay'),
      lfoRateSpeed: module.querySelector('.lfoRateSpeedDisplay'),
      volume: module.querySelector('.volumeDisplay')
    },
    audioNodes: {
      oscillator: null,
      filter: null,
      lfo: null,
      lfoGain: null,
      gainNode: null
    },
    automations: {
      frequency: { time: 0, animation: null },
      filter: { time: 0, animation: null },
      lfoRate: { time: 0, animation: null }
    }
  };
  if (isPlaying && audioContext) {
    setupAudioNodesForOscillator(oscillator);
    startOscillatorAutomations(oscillator);
  }
  setupOscillatorControls(oscillator);
  oscillators.push(oscillator);
});
function setupAudioNodesForOscillator(osc) {
  osc.audioNodes.oscillator = audioContext.createOscillator();
  osc.audioNodes.gainNode = audioContext.createGain();
  osc.audioNodes.filter = audioContext.createBiquadFilter();
  osc.audioNodes.lfo = audioContext.createOscillator();
  osc.audioNodes.lfoGain = audioContext.createGain();
  osc.audioNodes.oscillator.type = osc.controls.waveform.value;
  osc.audioNodes.oscillator.frequency.setValueAtTime(osc.controls.frequency.value, audioContext.currentTime);
  osc.audioNodes.filter.type = 'lowpass';
  osc.audioNodes.filter.frequency.setValueAtTime(osc.controls.filter.value, audioContext.currentTime);
  osc.audioNodes.filter.Q.setValueAtTime(osc.controls.resonance.value, audioContext.currentTime);
  osc.audioNodes.lfo.frequency.setValueAtTime(osc.controls.lfoRate.value, audioContext.currentTime);
  osc.audioNodes.lfoGain.gain.setValueAtTime(osc.controls.lfoDepth.value / 100 * 100, audioContext.currentTime);
  osc.audioNodes.gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  osc.audioNodes.lfo.connect(osc.audioNodes.lfoGain);
  osc.audioNodes.lfoGain.connect(osc.audioNodes.oscillator.frequency);
  osc.audioNodes.oscillator.connect(osc.audioNodes.filter);
  osc.audioNodes.filter.connect(osc.audioNodes.gainNode);
  osc.audioNodes.gainNode.connect(audioContext.destination);
  osc.audioNodes.oscillator.start();
  osc.audioNodes.lfo.start();
  const volumeValue = parseFloat(osc.controls.volume.value) / 100;
  osc.audioNodes.gainNode.gain.setValueAtTime(volumeValue, audioContext.currentTime);
}
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillators.forEach(setupAudioNodesForOscillator);
}
function updateAll(osc) {
  if (!isPlaying) return;
  osc.audioNodes.oscillator.type = osc.controls.waveform.value;
  osc.audioNodes.filter.frequency.setValueAtTime(parseFloat(osc.controls.filter.value), audioContext.currentTime);
  osc.audioNodes.filter.Q.setValueAtTime(parseFloat(osc.controls.resonance.value), audioContext.currentTime);
  osc.audioNodes.lfo.frequency.setValueAtTime(parseFloat(osc.controls.lfoRate.value), audioContext.currentTime);
  osc.audioNodes.lfoGain.gain.setValueAtTime(parseFloat(osc.controls.lfoDepth.value) / 100 * 100, audioContext.currentTime);
}
function getAutomationRange(osc, param) {
  const min = parseFloat(osc.controls[param + 'Min'].value);
  const max = parseFloat(osc.controls[param + 'Max'].value);
  return [Math.min(min, max), Math.max(min, max)];
}
function automateParameter(osc, param) {
  return () => {
    const speed = parseFloat(osc.controls[param + 'Speed'].value);
    if (speed === 0) return;
    osc.automations[param].time += 0.016 * speed;
    const [min, max] = getAutomationRange(osc, param);
    const value = min + (Math.sin(osc.automations[param].time) + 1) / 2 * (max - min);
    osc.controls[param].value = value;
    osc.displays[param].textContent = Math.round(value * 100) / 100;
    if (isPlaying) {
      switch (param) {
        case 'frequency':
          osc.audioNodes.oscillator.frequency.setValueAtTime(value, audioContext.currentTime);
          break;
        case 'filter':
          osc.audioNodes.filter.frequency.setValueAtTime(value, audioContext.currentTime);
          break;
        case 'lfoRate':
          osc.audioNodes.lfo.frequency.setValueAtTime(value, audioContext.currentTime);
          break;
      }
    }
    osc.automations[param].animation = requestAnimationFrame(automateParameter(osc, param));
  };
}
function startOscillatorAutomations(osc) {
  ['frequency', 'filter', 'lfoRate'].forEach(param => {
    automateParameter(osc, param)();
  });
}
function setupOscillatorControls(osc) {
  ['frequency', 'filter', 'lfoRate'].forEach(param => {
    osc.controls[param + 'Speed'].addEventListener('input', (e) => {
      osc.displays[param + 'Speed'].textContent = e.target.value;
      if (parseFloat(e.target.value) === 0) {
        if (osc.automations[param].animation) {
          cancelAnimationFrame(osc.automations[param].animation);
          osc.automations[param].animation = null;
        }
      } else if (!osc.automations[param].animation && isPlaying) {
        automateParameter(osc, param)();
      }
    });
    osc.controls[param + 'Min'].addEventListener('input', (e) => {
      const min = parseFloat(e.target.value);
      const max = parseFloat(osc.controls[param + 'Max'].value);
      if (min > max) {
        osc.controls[param + 'Max'].value = min;
      }
    });
    osc.controls[param + 'Max'].addEventListener('input', (e) => {
      const max = parseFloat(e.target.value);
      const min = parseFloat(osc.controls[param + 'Min'].value);
      if (max < min) {
        osc.controls[param + 'Min'].value = max;
      }
    });
  });
  osc.controls.frequency.addEventListener('input', (e) => {
    osc.displays.frequency.textContent = e.target.value;
    if (isPlaying) {
      osc.audioNodes.oscillator.frequency.setValueAtTime(parseFloat(e.target.value), audioContext.currentTime);
    }
  });
  Object.keys(osc.controls).forEach(key => {
    if (key !== 'frequency' && !key.endsWith('Speed') && !key.endsWith('Min') && !key.endsWith('Max')) {
      osc.controls[key].addEventListener('input', (e) => {
        if (osc.displays[key]) {
          osc.displays[key].textContent = e.target.value;
        }
        updateAll(osc);
      });
    }
  });
  osc.controls.volume.addEventListener('input', (e) => {
    const volumeValue = parseFloat(e.target.value);
    osc.displays.volume.textContent = volumeValue;
    if (isPlaying) {
      osc.audioNodes.gainNode.gain.setValueAtTime(volumeValue / 100, audioContext.currentTime);
    }
  });
}
document.getElementById('powerBtn').addEventListener('click', () => {
  if (!isPlaying) {
    initAudio();
    isPlaying = true;
    document.getElementById('powerBtn').textContent = 'Stop';
    document.getElementById('powerLed').classList.add('active');
    oscillators.forEach(osc => startOscillatorAutomations(osc)); // Fixed: Changed startAllAutomations to startOscillatorAutomations
  } else {
    oscillators.forEach(osc => {
      Object.keys(osc.automations).forEach(key => {
        if (osc.automations[key].animation) {
          cancelAnimationFrame(osc.automations[key].animation);
          osc.automations[key].animation = null;
        }
      });
      osc.audioNodes.oscillator.stop();
      osc.audioNodes.lfo.stop();
    });
    audioContext.close();
    audioContext = null;
    isPlaying = false;
    document.getElementById('powerBtn').textContent = 'Start';
    document.getElementById('powerLed').classList.remove('active');
  }
});