import * as Tone from 'tone';

class AudioEngine {
  private synth: Tone.PolySynth;
  private isInitialized = false;
  public samplesLoaded = true;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.synth.set({
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.3,
        release: 1
      }
    });
  }

  async init() {
    if (this.isInitialized) return;
    await Tone.start();
    this.isInitialized = true;
    console.log("Audio Engine Initialized");
  }

  playNote(note: any, duration: any = '8n', ...args: any[]) {
    if (!this.isInitialized) this.init();
    try {
      const noteStr = typeof note === 'number' ? note.toString() : note;
      const durStr = typeof duration === 'string' ? duration : '8n';
      this.synth.triggerAttackRelease(noteStr, durStr);
    } catch (e) {
      console.warn("Error playing note:", note, e);
    }
  }

  playTone(note: any, duration: any = '8n', ...args: any[]) {
    this.playNote(note, duration);
  }

  playGuitar(note: any, duration: any = '8n', ...args: any[]) {
    this.playNote(note, duration);
  }

  playNoteByColor(note: any, color?: any) {
    this.playNote(note);
  }

  playPattern(pattern: any[]) {
    this.playScale(pattern);
  }

  playClick(noteOrEnabled: any = "C2", duration: any = "32n", ...args: any[]) {
    if (typeof noteOrEnabled === 'boolean' && !noteOrEnabled) return;
    const note = typeof noteOrEnabled === 'string' ? noteOrEnabled : "C2";
    const dur = typeof duration === 'string' ? duration : "32n";
    
    if (!this.isInitialized) this.init();
    const clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: {
        attack: 0.0006,
        decay: 0.5,
        sustain: 0
      }
    }).toDestination();
    clickSynth.triggerAttackRelease(note, dur, undefined, 0.1);
  }

  playKick() {
    this.playClick("C1", "16n");
  }

  playSnare() {
    if (!this.isInitialized) this.init();
    const noise = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
    }).toDestination();
    noise.triggerAttackRelease("16n");
  }

  playSuccess() {
    if (!this.isInitialized) this.init();
    const now = Tone.now();
    const successSynth = new Tone.FMSynth().toDestination();
    successSynth.triggerAttackRelease("C4", "16n", now);
    successSynth.triggerAttackRelease("E4", "16n", now + 0.1);
    successSynth.triggerAttackRelease("G4", "16n", now + 0.2);
    successSynth.triggerAttackRelease("C5", "8n", now + 0.3);
  }

  playError() {
    if (!this.isInitialized) this.init();
    const errorSynth = new Tone.DuoSynth({
      vibratoAmount: 0.5,
      vibratoRate: 5,
      harmonicity: 1.5,
      voice0: {
        oscillator: { type: "sine" },
        filterEnvelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
      },
      voice1: {
        oscillator: { type: "sine" },
        filterEnvelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
      }
    }).toDestination();
    errorSynth.triggerAttackRelease("Ab3", "16n");
  }

  playLevelUp() {
    if (!this.isInitialized) this.init();
    const now = Tone.now();
    const levelSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    levelSynth.set({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 }
    });
    levelSynth.triggerAttackRelease("G3", "8n", now);
    levelSynth.triggerAttackRelease("E4", "8n", now + 0.15);
    levelSynth.triggerAttackRelease("C5", "4n", now + 0.3);
  }

  playScale(notes: any[]) {
    if (!this.isInitialized) this.init();
    const now = Tone.now();
    notes.forEach((note, i) => {
      const noteStr = typeof note === 'number' ? note.toString() : note;
      this.synth.triggerAttackRelease(noteStr, '8n', now + i * 0.4);
    });
  }

  async playChord(notes: any[]) {
    if (!this.isInitialized) await this.init();
    const notesStr = notes.map(n => typeof n === 'number' ? n.toString() : n);
    this.synth.triggerAttackRelease(notesStr, '2n');
  }

  stopAll() {
    this.synth.releaseAll();
  }
}

export const audio = new AudioEngine();
