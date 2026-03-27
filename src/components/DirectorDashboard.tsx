import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Calendar, 
  ChevronRight,
  School,
  Activity,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { AppState, Classroom, Student } from '../types';
import { listClassrooms, listStudentsByClassroom } from '../services/dataService';
import BrandHeader from './BrandHeader';

interface DirectorDashboardProps {
  state: AppState;
}

const MOCK_CHART_DATA = [
  { date: '20/03', xp: 450, participation: 85 },
  { date: '21/03', xp: 520, participation: 88 },
  { date: '22/03', xp: 480, participation: 82 },
  { date: '23/03', xp: 610, participation: 92 },
  { date: '24/03', xp: 580, participation: 90 },
  { date: '25/03', xp: 720, participation: 95 },
];

export default function DirectorDashboard({ state }: DirectorDashboardProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const cls = await listClassrooms();
      setClassrooms(cls);
      
      let count = 0;
      for (const c of cls) {
        const stds = await listStudentsByClassroom(c.id);
        count += stds.length;
      }
      setTotalStudents(count);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const metrics = [
    { label: 'Alunos Ativos', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Turmas Ativas', value: classrooms.length, icon: School, color: 'text-[#C41230]', bg: 'bg-red-50' },
    { label: 'Aulas na Semana', value: 12, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Média de XP', value: 542, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41230]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <BrandHeader />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#002D56]">Visão Geral da Escola</h2>
            <p className="text-gray-600">RedHouse International School – Campus Cuiabá</p>
          </div>
          <div className="bg-white p-2 border-2 border-[#002D56] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,45,86,1)]">
            <Calendar className="w-6 h-6 text-[#C41230]" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-[#002D56] p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,45,86,1)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{metric.label}</h3>
              <p className="text-3xl font-bold text-[#002D56]">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-[#002D56] p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,45,86,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#002D56] flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#C41230]" />
                Engajamento Semanal (XP)
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C41230" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C41230" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: '2px solid #002D56', boxShadow: '4px 4px 0px 0px rgba(0,45,86,1)'}}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#C41230" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border-2 border-[#002D56] p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,45,86,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#002D56] flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#C41230]" />
                Participação por Turma
              </h3>
            </div>
            <div className="space-y-4">
              {classrooms.map(cls => (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#002D56]">{cls.name}</span>
                    <span className="text-[#C41230]">92%</span>
                  </div>
                  <div className="h-3 bg-[#f5f5f0] rounded-full overflow-hidden border border-[#002D56]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      className="h-full bg-[#C41230]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-[#002D56] p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,45,86,1)]">
          <h3 className="text-xl font-bold text-[#002D56] mb-6">Relatórios Recentes</h3>
          <div className="divide-y-2 divide-[#f5f5f0]">
            {[1, 2, 3].map(i => (
              <div key={i} className="py-4 flex items-center justify-between hover:bg-[#f5f5f0] transition-colors px-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-[#C41230]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#002D56]">Relatório Mensal - Turma A</p>
                    <p className="text-xs text-gray-500">Enviado por Prof. Ricardo • Há 2 horas</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
