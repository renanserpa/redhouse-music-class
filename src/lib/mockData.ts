import { Student } from '../types';

export const CLASSROOMS = [
  { id: 'c1', name: 'Turma A - Segunda 14h', schoolId: 'school-cuiaba' },
  { id: 'c2', name: 'Turma B - Quarta 10h', schoolId: 'school-cuiaba' },
  { id: 'c3', name: 'Turma C - Sábado 09h', schoolId: 'school-cuiaba' },
];

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Lucca AI', classroomId: 'c1', instrument: 'violao', schoolId: 'school-cuiaba' },
  { id: 's2', name: 'Bia Rockstar', classroomId: 'c1', instrument: 'ukulele', schoolId: 'school-cuiaba' },
  { id: 's3', name: 'Leo Guitar', classroomId: 'c2', instrument: 'violao', schoolId: 'school-cuiaba' },
  { id: 's4', name: 'Ana Beat', classroomId: 'c2', instrument: 'ukulele', schoolId: 'school-cuiaba' },
  { id: 's5', name: 'Guto Bass', classroomId: 'c3', instrument: 'violao', schoolId: 'school-cuiaba' },
];
