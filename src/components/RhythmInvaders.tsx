/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Zap, Play, Square } from 'lucide-react';

interface RhythmInvadersProps {
  addXP: (amount: number) => void;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 1.0;
    this.color = color;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.03;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

type NoteType = 'NORMAL' | 'FAST' | 'GHOST' | 'GOLD';

class Note {
  lane: number;
  y: number;
  speed: number;
  hit: boolean;
  color: string;
  rgb: string;
  type: NoteType;
  opacity: number;
  opacityDir: number;

  constructor(lane: number, speed: number, type: NoteType = 'NORMAL') {
    this.lane = lane;
    this.y = -50;
    this.type = type;
    this.hit = false;
    this.color = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6'][lane];
    this.rgb = ['249, 115, 22', '59, 130, 246', '16, 185, 129', '139, 92, 246'][lane];
    
    this.speed = speed;
    if (type === 'FAST') this.speed *= 1.8;
    if (type === 'GOLD') this.speed *= 1.2;
    
    this.opacity = 1;
    this.opacityDir = -0.02;
  }

  update() {
    this.y += this.speed;
    if (this.type === 'GHOST') {
      this.opacity += this.opacityDir;
      if (this.opacity <= 0.2 || this.opacity >= 1) this.opacityDir *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number) {
    const laneWidth = canvasWidth / 4;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Special effects for types
    if (this.type === 'GOLD') {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#fbbf24';
    } else if (this.type === 'FAST') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'white';
    }

    ctx.beginPath();
    const radius = this.type === 'GOLD' ? 30 : 25;
    ctx.arc(laneWidth * (this.lane + 0.5), this.y, radius, 0, Math.PI * 2);
    
    if (this.type === 'GOLD') {
      ctx.fillStyle = '#fbbf24'; // Gold color
    } else {
      ctx.fillStyle = this.color;
    }
    
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = this.type === 'FAST' ? 5 : 3;
    ctx.stroke();
    
    // Icon or symbol inside
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let symbol = '';
    if (this.type === 'GOLD') symbol = '★';
    if (this.type === 'FAST') symbol = '⚡';
    if (this.type === 'GHOST') symbol = '👻';
    ctx.fillText(symbol, laneWidth * (this.lane + 0.5), this.y);

    ctx.restore();
  }
}

class FeedbackText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  size: number;
  glow: boolean;

  constructor(x: number, y: number, text: string, color: string, size: number = 24, glow: boolean = false) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 1.0;
    this.size = size;
    this.glow = glow;
  }

  update() {
    this.y -= 1.5;
    this.life -= 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    
    if (this.glow) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
    }

    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.size}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    
    const scale = 1 + (1 - this.life) * 0.2;
    ctx.translate(this.x, this.y);
    ctx.scale(scale, scale);
    ctx.fillText(this.text, 0, 0);
    
    ctx.restore();
  }
}

export default function RhythmInvaders({ addXP }: RhythmInvadersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [practiceSpeed, setPracticeSpeed] = useState<1 | 0.5 | 0.25>(1);
  const notesRef = useRef<Note[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const feedbackRef = useRef<FeedbackText[]>([]);
  const laneFlashesRef = useRef<number[]>([0, 0, 0, 0]);
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const shakeRef = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    notesRef.current = [];
    particlesRef.current = [];
    feedbackRef.current = [];
    laneFlashesRef.current = [0, 0, 0, 0];
    lastSpawnRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
    audio.playTone(440, '8n');
  };

  const stopGame = () => {
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    addXP(Math.floor(score / 10));
  };

  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, color));
    }
  };

  const addFeedback = (x: number, y: number, text: string, color: string, size: number = 24, glow: boolean = false) => {
    feedbackRef.current.push(new FeedbackText(x, y, text, color, size, glow));
  };

  const gameLoop = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (shakeRef.current > 0) {
      const dx = (Math.random() - 0.5) * shakeRef.current;
      const dy = (Math.random() - 0.5) * shakeRef.current;
      ctx.translate(dx, dy);
      shakeRef.current *= 0.9;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update lane flashes
    laneFlashesRef.current = laneFlashesRef.current.map(v => Math.max(0, v - 0.05));

    // Draw lane flashes
    laneFlashesRef.current.forEach((opacity, i) => {
      if (opacity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
        ctx.fillRect(i * (canvas.width / 4), 0, canvas.width / 4, canvas.height);
      }
    });

    // Draw Lanes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (canvas.width / 4), 0);
      ctx.lineTo(i * (canvas.width / 4), canvas.height);
      ctx.stroke();
    }

    // Draw Target Zone
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 320, canvas.width, 60);
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(5, 320, canvas.width - 10, 60);
    ctx.setLineDash([]);

    // Spawn Notes
    const baseInterval = Math.max(400, 1000 - Math.floor(score / 100) * 50);
    const spawnInterval = baseInterval / practiceSpeed;
    
    if (time - lastSpawnRef.current > spawnInterval) {
      const lane = Math.floor(Math.random() * 4);
      
      // Determine type
      const rand = Math.random();
      let type: NoteType = 'NORMAL';
      if (rand > 0.95) type = 'GOLD';
      else if (rand > 0.85) type = 'FAST';
      else if (rand > 0.75) type = 'GHOST';
      
      const baseSpeed = (3 + (score / 2000)) * practiceSpeed;
      notesRef.current.push(new Note(lane, baseSpeed, type));
      lastSpawnRef.current = time;
    }

    // Update and Draw Notes
    for (let i = notesRef.current.length - 1; i >= 0; i--) {
      const note = notesRef.current[i];
      note.update();
      note.draw(ctx, canvas.width);

      if (note.y > canvas.height + 50) {
        if (!note.hit) {
          // Miss effect
          createParticles((note.lane + 0.5) * (canvas.width / 4), 350, '#ef4444', 10);
          addFeedback((note.lane + 0.5) * (canvas.width / 4), 320, 'MISS!', '#ef4444');
          setCombo(0);
          shakeRef.current = 10;
          audio.playError();
        }
        notesRef.current.splice(i, 1);
      }
    }

    // Update and Draw Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particlesRef.current.splice(i, 1);
      }
    }

    // Update and Draw Feedback
    for (let i = feedbackRef.current.length - 1; i >= 0; i--) {
      const f = feedbackRef.current[i];
      f.update();
      f.draw(ctx);
      if (f.life <= 0) {
        feedbackRef.current.splice(i, 1);
      }
    }

    ctx.restore();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const triggerHit = (lane: number) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger lane flash
    laneFlashesRef.current[lane] = 1.0;

    const hitNoteIndex = notesRef.current.findIndex(
      note => note.lane === lane && note.y > 280 && note.y < 400 && !note.hit
    );

    if (hitNoteIndex !== -1) {
      const note = notesRef.current[hitNoteIndex];
      note.hit = true;
      
      const accuracy = Math.abs(note.y - 350);
      let points = 10;
      let text = 'BOM!';
      let color = '#3b82f6';
      let size = 24;
      let glow = false;

      if (accuracy < 12) {
        points = 30;
        text = 'PERFEITO!';
        color = '#10b981';
        size = 36;
        glow = true;
        audio.playSuccess();
        shakeRef.current = 15;
      } else if (accuracy < 25) {
        points = 20;
        text = 'ÓTIMO!';
        color = '#f97316';
        size = 30;
        glow = true;
        shakeRef.current = 5;
      } else if (accuracy < 45) {
        points = 10;
        text = 'BOM!';
        color = '#3b82f6';
        size = 24;
        glow = false;
      }

      let typeMultiplier = 1;
      if (note.type === 'GOLD') typeMultiplier = 3;
      if (note.type === 'FAST') typeMultiplier = 2;
      if (note.type === 'GHOST') typeMultiplier = 1.5;

      const comboMultiplier = 1 + Math.floor(combo / 5);
      const totalPoints = Math.floor(points * comboMultiplier * typeMultiplier);
      setScore(prev => prev + totalPoints);
      setCombo(prev => prev + 1);
      
      // Hit effect
      createParticles((lane + 0.5) * (canvas.width / 4), note.y, color, accuracy < 12 ? 40 : (accuracy < 25 ? 25 : 15));
      addFeedback((lane + 0.5) * (canvas.width / 4), note.y - 40, `${text} x${comboMultiplier}`, color, size, glow);
      
      note.y = -1000; // Remove
      audio.playTone([329.63, 246.94, 196.00, 146.83][lane], '8n');
    } else {
      // Miss tap effect
      createParticles((lane + 0.5) * (canvas.width / 4), 350, '#ef4444', 12);
      addFeedback((lane + 0.5) * (canvas.width / 4), 320, 'ERROU!', '#ef4444');
      setCombo(0);
      shakeRef.current = 5;
      audio.playError();
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const lane = Math.floor(x / (canvas.width / 4));
    triggerHit(lane);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <section className="bg-slate-950 rounded-[40px] p-8 shadow-2xl border-4 border-slate-900 relative overflow-hidden text-white">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%] opacity-10"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] rotate-3 border-2 border-orange-400">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Note Invaders</h3>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Protocolo de Ataque · Mundo 3</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {!isPlaying && (
            <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800 shadow-xl">
              <span className="text-[10px] font-black uppercase text-slate-500 px-3 tracking-widest">Protocolo:</span>
              <div className="flex gap-1">
                {[1, 0.5, 0.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => { audio.playClick(); setPracticeSpeed(speed as any); }}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${
                      practiceSpeed === speed 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {speed === 1 ? 'NORMAL' : `${speed}x`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {combo > 1 && (
                <motion.div 
                  initial={{ scale: 0, x: 20 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <div className="bg-orange-500 text-white px-5 py-2 rounded-2xl font-black italic border-b-4 border-orange-700 shadow-lg">
                    COMBO x{combo}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border-2 border-slate-800 flex flex-col items-end shadow-xl">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync Score</p>
               <p className="text-2xl font-black text-orange-500 font-mono italic leading-none">{score}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-2xl text-center mb-8">
        <p className="text-slate-400 font-bold italic text-sm italic">Defenda a pulsação! Destrua as notas invasoras no exato momento da convergência.</p>
      </div>
      
      <div className="bg-slate-950 rounded-[4rem] p-10 relative overflow-hidden h-[480px] flex flex-col items-center justify-center border-4 border-slate-900 shadow-2xl">
        {!isPlaying ? (
          showInstructions ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="z-20 bg-slate-900 p-10 rounded-[3rem] border-4 border-slate-800 shadow-2xl max-w-sm text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)] border-2 border-orange-400 rotate-3">
                <Zap className="w-10 h-10 fill-white" />
              </div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Sincronia Total!</h4>
              <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed italic">
                A pulsação é o coração da nave. Intercepte as notas exatamente na <span className="text-orange-500">zona de convergência</span> para maximizar o multiplicador!
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { audio.playClick(); setShowInstructions(false); }}
                className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-50 transition-all"
              >
                ENTRAR NO RADAR
              </motion.button>
            </motion.div>
          ) : (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="z-10 bg-emerald-600 text-white px-16 py-7 rounded-[3rem] font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center gap-4 text-2xl border-b-4 border-emerald-800"
            >
              <Play className="w-8 h-8 fill-white" />
              INICIAR SOLO
            </motion.button>
          )
        ) : (
          <>
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              onMouseDown={handleTap}
              className="cursor-crosshair w-full h-full max-w-md"
            />
            
            {/* Lane Buttons for feedback and interaction */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-around px-8 pointer-events-none">
              {[
                { note: 'E', color: 'border-orange-500/50' },
                { note: 'A', color: 'border-blue-500/50' },
                { note: 'D', color: 'border-emerald-500/50' },
                { note: 'G', color: 'border-indigo-500/50' },
              ].map((lane, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => triggerHit(i)}
                  className={`w-16 h-16 rounded-2xl border-4 ${lane.color} bg-white/5 opacity-40 flex items-center justify-center pointer-events-auto cursor-pointer transition-all hover:bg-white/10 hover:border-white/40 shadow-lg`}
                >
                  <span className="text-white font-black text-xl">{lane.note}</span>
                </motion.button>
              ))}
            </div>

            <button 
              onClick={stopGame}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl transition-all"
            >
              <Square className="w-6 h-6 fill-white" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
