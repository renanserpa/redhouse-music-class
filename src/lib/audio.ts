import * as Tone from 'tone';

class AudioEngine {
  private synth: Tone.PolySynth;
  private clickSynth: Tone.MembraneSynth | null = null;
  private successSynth: Tone.FMSynth | null = null;
  private errorSynth: Tone.DuoSynth | null = null;
  private levelSynth: Tone.PolySynth | null = null;
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
    
    // Initialize common synths
    this.clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.0006, decay: 0.5, sustain: 0 }
    }).toDestination();
    
    this.successSynth = new Tone.FMSynth().toDestination();
    
    this.errorSynth = new Tone.DuoSynth({
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
    
    this.levelSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.levelSynth.set({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 }
    });

    this.isInitialized = true;
    console.log("Audio Engine Initialized (v2)");
  }

  playNote(note: any, duration: any = '8n') {
    if (!this.isInitialized) this.init();
    try {
      const noteStr = typeof note === 'number' ? note.toString() : note;
      const durStr = typeof duration === 'string' ? duration : '8n';
      this.synth.triggerAttackRelease(noteStr, durStr);
    } catch (e) {
      console.warn("Error playing note:", note, e);
    }
  }

  playTone(note: any, duration: any = '8n') {
    this.playNote(note, duration);
  }

  playGuitar(note: any, duration: any = '8n') {
    this.playNote(note, duration);
  }

  playNoteByColor(note: any) {
    this.playNote(note);
  }

  playPattern(pattern: any[]) {
    this.playScale(pattern);
  }

  playClick(noteOrEnabled: any = "C2", duration: any = "32n") {
    if (typeof noteOrEnabled === 'boolean' && !noteOrEnabled) return;
    if (!this.isInitialized) this.init();
    if (this.clickSynth) {
      const note = typeof noteOrEnabled === 'string' ? noteOrEnabled : "C2";
      const dur = typeof duration === 'string' ? duration : "32n";
      this.clickSynth.triggerAttackRelease(note, dur, undefined, 0.1);
    }
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
    if (this.successSynth) {
      const now = Tone.now();
      this.successSynth.triggerAttackRelease("C4", "16n", now);
      this.successSynth.triggerAttackRelease("E4", "16n", now + 0.1);
      this.successSynth.triggerAttackRelease("G4", "16n", now + 0.2);
      this.successSynth.triggerAttackRelease("C5", "8n", now + 0.3);
    }
  }

  playError() {
    if (!this.isInitialized) this.init();
    if (this.errorSynth) {
      this.errorSynth.triggerAttackRelease("Ab3", "16n");
    }
  }

  playLevelUp() {
    if (!this.isInitialized) this.init();
    if (this.levelSynth) {
      const now = Tone.now();
      this.levelSynth.triggerAttackRelease("G3", "8n", now);
      this.levelSynth.triggerAttackRelease("E4", "8n", now + 0.15);
      this.levelSynth.triggerAttackRelease("C5", "4n", now + 0.3);
    }
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

  playStart() {
    if (!this.isInitialized) this.init();
    const now = Tone.now();
    const startSynth = new Tone.Synth().toDestination();
    startSynth.triggerAttackRelease("C3", "16n", now);
    startSynth.triggerAttackRelease("G3", "8n", now + 0.1);
  }

  stopAll() {
    this.synth.releaseAll();
  }
}

export const audio = new AudioEngine();
