# Custom Synthesizer
Web-based synthesizer allowing users to create oscillators, and apply audio effects like frequency modulation, filter automation, and more. Built using the Web Audio API for real-time audio generation and control.

## Features
- **Oscillator Creation** – Add multiple (automatically compressed) oscillators to create complex sounds with individual controls
- **Waveform Selection** – Choose from four waveforms: Sine, Square, Sawtooth, and Triangle.
- **Frequency Control** – Adjust the frequency of each oscillator (20 Hz to 2000 Hz).
- **Filter Control** – Apply a lowpass filter with adjustable cutoff frequency and resonance.
- **LFO (Low Frequency Oscillator)** – Control the rate and depth of the LFO for modulation.
- **Volume Control** – Adjust the master volume for each oscillator.
- **Real-Time Automation** – Automate parameters like frequency, filter cutoff, and LFO rate with adjustable speeds.
- **Start/Stop Control** – Power the synthesizer on and off easily.

## Technologies Used
- **Web Audio API** – For audio synthesis and real-time sound generation.
- **HTML5** – Structure of the user interface.
- **CSS** – Visual styling for layout and controls.
- **JavaScript** – Core functionality for synthesizer control and audio manipulation.

## Getting Started
1. Clone the repository:
    ```bash
    git clone https://github.com/composedbymax/modular-synthesizer
    ```
2. Open the `index.html`

## Controls

| Action                          | Key / Interaction        |
|---------------------------------|--------------------------|
| **Add Oscillator**              | Button ("Add Oscillator") |
| **Waveform**                    | Select: Sine, Square, Sawtooth, Triangle |
| **Frequency Control**           | Slider (20 Hz to 2000 Hz) |
| **Filter Cutoff**               | Slider (20 Hz to 5000 Hz) |
| **Resonance**                   | Slider (0 - 20) |
| **LFO Rate**                    | Slider (0.1 Hz to 20 Hz) |
| **LFO Depth**                   | Slider (0-100%) |
| **Volume Control**              | Slider (0 - 100%) |
| **Start Synthesizer**           | Button ("Start") |
| **Stop Synthesizer**            | Button ("Stop") |
| **Automation**                  | Set Min/Max for frequency, filter cutoff, and LFO rate. |

## Example Usage
1. Click **Start** to power up the synthesizer.
2. Click **Add Oscillator** to create a new oscillator.
3. Adjust the waveform, frequency, and other controls.
4. Optionally, set automation parameters for the frequency, filter, or LFO.
5. Adjust the **Volume** to hear the output.
6. Click **Stop** to turn off the synthesizer.

## Code Structure
- **HTML**: Contains the user interface, including buttons, sliders, and oscillator modules.
- **CSS**: Provides styling for the synthesizer, including module layout and controls.
- **JavaScript**: Implements the synthesizer logic using the Web Audio API.

## Files
- **index.html**: Main HTML file that renders the synthesizer interface.
- **style.css**: Stylesheet for the layout and visual appearance of the synthesizer.
- **script.js**: JavaScript file containing the synthesizer functionality.

## Requirements
- A modern web browser (Chrome, Firefox, Safari).

## Setup & Usage
1. Clone the repository:
    ```bash
    git clone https://github.com/composedbymax/modular-synthesizer.git
    ```
2. Open `index.html` in a browser.