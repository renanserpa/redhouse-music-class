import React from 'react';

interface StaffDisplayProps {
  notes: string[];
  activeNoteIndex?: number;
  className?: string;
}

export const StaffDisplay: React.FC<StaffDisplayProps> = ({ notes, activeNoteIndex, className = "" }) => {
  // Simple SVG-based staff display
  const staffLines = [20, 30, 40, 50, 60];
  const notePositions: Record<string, number> = {
    'C4': 75, 'D4': 70, 'E4': 65, 'F4': 60, 'G4': 55, 'A4': 50, 'B4': 45,
    'C5': 40, 'D5': 35, 'E5': 30, 'F5': 25, 'G5': 20, 'A5': 15, 'B5': 10
  };

  return (
    <div className={`relative bg-white/5 rounded-xl p-4 border border-white/10 ${className}`}>
      <svg viewBox="0 0 400 100" className="w-full h-full">
        {/* Clef (Simplified) */}
        <text x="10" y="65" className="fill-redhouse-primary font-serif text-5xl">𝄞</text>
        
        {/* Staff Lines */}
        {staffLines.map((y, i) => (
          <line key={i} x1="40" y1={y} x2="380" y2={y} stroke="currentColor" strokeWidth="1" className="text-white/20" />
        ))}

        {/* Notes */}
        {notes.map((note, i) => {
          const y = notePositions[note] || 50;
          const x = 60 + i * 40;
          const isActive = activeNoteIndex === i;
          
          return (
            <g key={i} className="transition-all duration-300">
              {/* Ledger line for C4 */}
              {note === 'C4' && (
                <line x1={x - 10} y1={75} x2={x + 10} y2={75} stroke="currentColor" strokeWidth="1.5" className="text-white" />
              )}
              
              {/* Note Head */}
              <ellipse 
                cx={x} 
                cy={y} 
                rx="6" 
                ry="4.5" 
                transform={`rotate(-20 ${x} ${y})`}
                className={`${isActive ? 'fill-pedagogy-blue' : 'fill-white'} transition-colors`}
              />
              
              {/* Note Stem */}
              <line 
                x1={x + 5.5} 
                y1={y} 
                x2={x + 5.5} 
                y2={y - 30} 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className={isActive ? 'text-pedagogy-blue' : 'text-white'} 
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
