import React from 'react';
import { HERO_TITLE, HERO_SUBTITLE, FEATURES } from '../constants/presentation';
import { motion } from 'motion/react';

export default function PresentationPage() {
  return (
    <section className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Massive Typographic Hero */}
      <div className="relative overflow-hidden py-32 bg-gradient-to-r from-emerald-100 to-amber-100">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold text-center text-gray-800 leading-tight"
        >
          {HERO_TITLE}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-xl md:text-2xl text-center text-gray-700"
        >
          {HERO_SUBTITLE}
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-2xl font-bold text-emerald-700 mb-2">{feat.title}</h3>
            <p className="text-gray-600">{feat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
