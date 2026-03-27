import { db } from "../firebase";
import { 
  Student, 
  Classroom, 
  LessonReport, 
  MonthlyReport, 
  Activity, 
  ActivityAttempt,
  InstrumentType 
} from "../types";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp
} from "firebase/firestore";

/**
 * SERVIÇOS DE DADOS (FIRESTORE COM FALLBACK MOCK)
 * Modo Sandbox ativado automaticamente se as chaves estiverem ausentes.
 */

const IS_SANDBOX = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-key";

// MOCK DATA (Persistência em memória para demonstração)
const MOCK_CLASSROOMS: Classroom[] = [
  { id: 'c1', name: 'Turma A - Kids', schedule: 'Segunda 14:00', ageRange: '5-7 anos', schoolId: 'school-cuiaba' },
  { id: 'c2', name: 'Turma B - Teens', schedule: 'Quarta 16:00', ageRange: '12-15 anos', schoolId: 'school-cuiaba' },
];

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'João Silva', age: 7, instrument: 'violao', classroomId: 'c1', xp: 120, coins: 50, schoolId: 'school-cuiaba' },
  { id: 's2', name: 'Maria Oliveira', age: 6, instrument: 'ukulele', classroomId: 'c1', xp: 80, coins: 30, schoolId: 'school-cuiaba' },
  { id: 's3', name: 'Pedro Santos', age: 14, instrument: 'violao', classroomId: 'c2', xp: 250, coins: 100, schoolId: 'school-cuiaba' },
];

const MOCK_LESSONS: LessonReport[] = [];
const MOCK_MONTHLY: MonthlyReport[] = [];
const MOCK_ATTEMPTS: ActivityAttempt[] = [];

export async function listClassrooms(): Promise<Classroom[]> {
  if (IS_SANDBOX) return MOCK_CLASSROOMS;
  try {
    const q = query(collection(db, 'classrooms'), where('active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return MOCK_CLASSROOMS;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
  } catch (error) {
    return MOCK_CLASSROOMS;
  }
}

export async function listStudentsByClassroom(classroomId: string): Promise<Student[]> {
  if (IS_SANDBOX) return MOCK_STUDENTS.filter(s => s.classroomId === classroomId);
  try {
    const q = query(collection(db, 'students'), where('classroomId', '==', classroomId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return MOCK_STUDENTS.filter(s => s.classroomId === classroomId);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  } catch (error) {
    return MOCK_STUDENTS.filter(s => s.classroomId === classroomId);
  }
}

export async function saveLessonReport(report: LessonReport): Promise<void> {
  if (IS_SANDBOX) {
    MOCK_LESSONS.push(report);
    return;
  }
  try {
    await setDoc(doc(db, 'lessons', report.id), {
      ...report,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving lesson report:", error);
  }
}

export async function saveMonthlyReport(report: MonthlyReport): Promise<void> {
  if (IS_SANDBOX) {
    MOCK_MONTHLY.push(report);
    return;
  }
  try {
    await setDoc(doc(db, 'monthlyReports', report.id), {
      ...report,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving monthly report:", error);
  }
}

export async function listAllLessonReports(): Promise<LessonReport[]> {
  if (IS_SANDBOX) return MOCK_LESSONS;
  try {
    const q = query(collection(db, 'lessons'), orderBy('date', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LessonReport));
  } catch (error) {
    return MOCK_LESSONS;
  }
}

export async function listAllMonthlyReports(): Promise<MonthlyReport[]> {
  if (IS_SANDBOX) return MOCK_MONTHLY;
  try {
    const q = query(collection(db, 'monthlyReports'), orderBy('month', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyReport));
  } catch (error) {
    return MOCK_MONTHLY;
  }
}

export async function listLessonReportsByStudent(studentId: string): Promise<LessonReport[]> {
  if (IS_SANDBOX) return MOCK_LESSONS.filter(l => l.studentId === studentId);
  try {
    const q = query(collection(db, 'lessons'), where('studentId', '==', studentId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LessonReport));
  } catch (error) {
    return MOCK_LESSONS.filter(l => l.studentId === studentId);
  }
}

export async function listMonthlyReportsByStudent(studentId: string): Promise<MonthlyReport[]> {
  if (IS_SANDBOX) return MOCK_MONTHLY.filter(m => m.studentId === studentId);
  try {
    const q = query(collection(db, 'monthlyReports'), where('studentId', '==', studentId), orderBy('month', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyReport));
  } catch (error) {
    return MOCK_MONTHLY.filter(m => m.studentId === studentId);
  }
}

export async function saveActivityAttempt(attempt: ActivityAttempt): Promise<void> {
  if (IS_SANDBOX) {
    MOCK_ATTEMPTS.push(attempt);
    return;
  }
  try {
    await addDoc(collection(db, 'activityAttempts'), {
      ...attempt,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving activity attempt:", error);
  }
}

export async function listActivityAttemptsByStudent(studentId: string): Promise<ActivityAttempt[]> {
  if (IS_SANDBOX) return MOCK_ATTEMPTS.filter(a => a.studentId === studentId);
  try {
    const q = query(collection(db, 'activityAttempts'), where('studentId', '==', studentId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityAttempt));
  } catch (error) {
    return MOCK_ATTEMPTS.filter(a => a.studentId === studentId);
  }
}

export async function getStudentById(studentId: string): Promise<Student | undefined> {
  if (IS_SANDBOX) return MOCK_STUDENTS.find(s => s.id === studentId);
  try {
    const docRef = doc(db, 'students', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Student;
    return MOCK_STUDENTS.find(s => s.id === studentId);
  } catch (error) {
    return MOCK_STUDENTS.find(s => s.id === studentId);
  }
}

export async function getClassroomById(classroomId: string): Promise<Classroom | undefined> {
  if (IS_SANDBOX) return MOCK_CLASSROOMS.find(c => c.id === classroomId);
  try {
    const docRef = doc(db, 'classrooms', classroomId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Classroom;
    return MOCK_CLASSROOMS.find(c => c.id === classroomId);
  } catch (error) {
    return MOCK_CLASSROOMS.find(c => c.id === classroomId);
  }
}

export async function addClassroom(classroom: Omit<Classroom, 'id'>): Promise<string> {
  const id = `c-${Date.now()}`;
  if (IS_SANDBOX) {
    MOCK_CLASSROOMS.push({ id, ...classroom });
    return id;
  }
  try {
    const docRef = await addDoc(collection(db, 'classrooms'), {
      ...classroom,
      active: true,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    MOCK_CLASSROOMS.push({ id, ...classroom });
    return id;
  }
}

export async function updateClassroom(id: string, classroom: Partial<Classroom>): Promise<void> {
  if (IS_SANDBOX) {
    const idx = MOCK_CLASSROOMS.findIndex(c => c.id === id);
    if (idx !== -1) MOCK_CLASSROOMS[idx] = { ...MOCK_CLASSROOMS[idx], ...classroom };
    return;
  }
  try {
    await setDoc(doc(db, 'classrooms', id), classroom, { merge: true });
  } catch (error) {
    const idx = MOCK_CLASSROOMS.findIndex(c => c.id === id);
    if (idx !== -1) MOCK_CLASSROOMS[idx] = { ...MOCK_CLASSROOMS[idx], ...classroom };
  }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<string> {
  const id = `s-${Date.now()}`;
  if (IS_SANDBOX) {
    MOCK_STUDENTS.push({ id, ...student });
    return id;
  }
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...student,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    MOCK_STUDENTS.push({ id, ...student });
    return id;
  }
}

export async function updateStudent(id: string, student: Partial<Student>): Promise<void> {
  if (IS_SANDBOX) {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx !== -1) MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...student };
    return;
  }
  try {
    await setDoc(doc(db, 'students', id), student, { merge: true });
  } catch (error) {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx !== -1) MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...student };
  }
}
