const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const noteFrequencies = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25
};
const activeNotes = {};
function playNote(note) {
  // Create an oscillator node
  const oscillator = audioContext.createOscillator();
  // Create a gain node to control volume
  const gainNode = audioContext.createGain();

  // Set the oscillator's type (e.g., 'sine', 'square', 'sawtooth', 'triangle')
  oscillator.type = 'sine';

  // Set the oscillator's frequency based on our map
  oscillator.frequency.value = noteFrequencies[note];

  // Set initial gain to 0 to prevent clicks
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  // Smoothly ramp the gain to 1 over a short period (e.g., 0.01 seconds) for a soft attack
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);

  // Connect the nodes in a chain: Oscillator -> Gain -> Destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the oscillator
  oscillator.start();

  // Return the oscillator and gain node so we can stop them later
  return { oscillator, gainNode };
}
const activeNotes = {}; // Object to store currently playing notes

document.addEventListener('mousedown', (event) => {
  if (event.target.classList.contains('key')) {
    const note = event.target.dataset.note;
    if (!activeNotes[note]) {
      const { oscillator, gainNode } = playNote(note);
      activeNotes[note] = { oscillator, gainNode };
    }
  }
});

document.addEventListener('mouseup', (event) => {
  if (event.target.classList.contains('key')) {
    const note = event.target.dataset.note;
    if (activeNotes[note]) {
      const { oscillator, gainNode } = activeNotes[note];
      
      // We'll add a smooth release to prevent a clicking sound.
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      
      // Stop the oscillator after a brief delay.
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Remove the note from our tracking object.
      delete activeNotes[note];
    }
  }
});