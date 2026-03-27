import * as Tone from 'tone';

export type InstrumentType = 'synth' | 'piano' | 'guitar' | 'retro';

class AudioEngine {
  private synth: Tone.PolySynth;
  private piano: Tone.Sampler | null = null;
  private currentInstrument: InstrumentType = 'synth';
  private isInitialized = false;
  public samplesLoaded = false;

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
    
    // Load Piano Samples (using a public CDN for high quality)
    this.piano = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    await Tone.loaded();
    this.samplesLoaded = true;
    this.isInitialized = true;
    console.log("Audio Engine Initialized with Samples");
  }

  setInstrument(type: InstrumentType) {
    this.currentInstrument = type;
    if (type === 'retro') {
      this.synth.set({
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
      });
    } else if (type === 'guitar') {
      this.synth.set({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.05, decay: 0.5, sustain: 0.2, release: 1 }
      });
    } else {
      this.synth.set({
        oscillator: { type: "sine" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 1 }
      });
    }
  }

  playNote(note: any, duration: any = '8n', time?: any) {
    if (!this.isInitialized) this.init();
    try {
      const noteStr = typeof note === 'number' ? note.toString() : note;
      const durStr = typeof duration === 'string' ? duration : '8n';
      
      if (this.currentInstrument === 'piano' && this.piano && this.samplesLoaded) {
        this.piano.triggerAttackRelease(noteStr, durStr, time);
      } else {
        this.synth.triggerAttackRelease(noteStr, durStr, time);
      }
    } catch (e) {
      console.warn("Error playing note:", note, e);
    }
  }

  playTone(note: any, duration: any = '8n') {
    this.playNote(note, duration);
  }

  playGuitar(note: any, duration: any = '8n') {
    const prevInst = this.currentInstrument;
    this.setInstrument('guitar');
    this.playNote(note, duration);
    this.setInstrument(prevInst);
  }

  playNoteByColor(note: any, _color?: any) {
    this.playNote(note);
  }

  playPattern(pattern: any[]) {
    this.playScale(pattern);
  }

  playClick(noteOrEnabled: any = "C2", duration: any = "32n") {
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
      this.playNote(noteStr, '8n', now + i * 0.4);
    });
  }

  async playChord(notes: any[]) {
    if (!this.isInitialized) await this.init();
    const notesStr = notes.map(n => typeof n === 'number' ? n.toString() : n);
    if (this.currentInstrument === 'piano' && this.piano && this.samplesLoaded) {
      this.piano.triggerAttackRelease(notesStr, '2n');
    } else {
      this.synth.triggerAttackRelease(notesStr, '2n');
    }
  }

  stopAll() {
    this.synth.releaseAll();
    if (this.piano) this.piano.releaseAll();
  }
}

export const audio = new AudioEngine();
