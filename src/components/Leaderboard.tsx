import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, TrendingUp, User } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface LeaderboardEntry {
  uid: string;
  name: string;
  xp: number;
  photoURL: string | null;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as LeaderboardEntry[];
        setEntries(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-redhouse-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-redhouse-text uppercase italic tracking-tighter">Hall da Fama</h2>
          <p className="text-redhouse-muted font-bold">Os maiores Rockstars da RedHouse</p>
        </div>
        <div className="bg-redhouse-primary/10 p-4 rounded-3xl border border-redhouse-primary/20">
          <Trophy className="w-8 h-8 text-redhouse-primary" />
        </div>
      </div>

      <div className="grid gap-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.uid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-6 flex items-center gap-6 ${
              index === 0 ? 'border-pedagogy-yellow bg-pedagogy-yellow/5' : 
              index === 1 ? 'border-slate-300 bg-slate-300/5' :
              index === 2 ? 'border-amber-600 bg-amber-600/5' : ''
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center font-black text-2xl italic">
              {index === 0 ? <Medal className="w-8 h-8 text-pedagogy-yellow" /> :
               index === 1 ? <Medal className="w-8 h-8 text-slate-300" /> :
               index === 2 ? <Medal className="w-8 h-8 text-amber-600" /> :
               `#${index + 1}`}
            </div>

            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-redhouse-bg border-2 border-redhouse-border flex items-center justify-center">
              {entry.photoURL ? (
                <img src={entry.photoURL} alt={entry.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-redhouse-muted" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-black text-redhouse-text uppercase italic">{entry.name}</h3>
              <div className="flex items-center gap-2 text-redhouse-muted font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Nível Rockstar</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Star className="w-5 h-5 text-pedagogy-yellow fill-pedagogy-yellow" />
                <span className="text-2xl font-black text-redhouse-text italic">{entry.xp}</span>
              </div>
              <p className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest">XP Total</p>
            </div>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="text-center p-20 glass-card">
            <p className="text-redhouse-muted font-bold">Nenhum Rockstar no ranking ainda. Seja o primeiro!</p>
          </div>
        )}
      </div>
    </div>
  );
}
