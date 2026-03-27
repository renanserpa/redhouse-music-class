/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

/**
 * SERVIÇOS DE DADOS (FIRESTORE COM FALLBACK MOCK)
 * Refatorado para persistência real.
 */

// MOCK DATA (Fallback)
const MOCK_CLASSROOMS: Classroom[] = [
  { id: 'c1', name: 'Turma A - Kids', schedule: 'Segunda 14:00', ageRange: '5-7 anos', schoolId: 'school-cuiaba' },
  { id: 'c2', name: 'Turma B - Teens', schedule: 'Quarta 16:00', ageRange: '12-15 anos', schoolId: 'school-cuiaba' },
];

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'João Silva', age: 7, instrument: 'violao', classroomId: 'c1', xp: 120, coins: 50, schoolId: 'school-cuiaba' },
  { id: 's2', name: 'Maria Oliveira', age: 6, instrument: 'ukulele', classroomId: 'c1', xp: 80, coins: 30, schoolId: 'school-cuiaba' },
  { id: 's3', name: 'Pedro Santos', age: 14, instrument: 'violao', classroomId: 'c2', xp: 250, coins: 100, schoolId: 'school-cuiaba' },
];

export async function listClassrooms(): Promise<Classroom[]> {
  try {
    const q = query(collection(db, 'classrooms'), where('active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return MOCK_CLASSROOMS;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
  } catch (error) {
    console.warn("Firestore listClassrooms failed, using mocks:", error);
    return MOCK_CLASSROOMS;
  }
}

export async function listStudentsByClassroom(classroomId: string): Promise<Student[]> {
  try {
    const q = query(collection(db, 'students'), where('classroomId', '==', classroomId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return MOCK_STUDENTS.filter(s => s.classroomId === classroomId);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  } catch (error) {
    console.warn("Firestore listStudentsByClassroom failed, using mocks:", error);
    return MOCK_STUDENTS.filter(s => s.classroomId === classroomId);
  }
}

export async function saveLessonReport(report: LessonReport): Promise<void> {
  try {
    await setDoc(doc(db, 'lessons', report.id), {
      ...report,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving lesson report to Firestore:", error);
    throw error;
  }
}

export async function saveMonthlyReport(report: MonthlyReport): Promise<void> {
  try {
    await setDoc(doc(db, 'monthlyReports', report.id), {
      ...report,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving monthly report to Firestore:", error);
    throw error;
  }
}

export async function listAllLessonReports(): Promise<LessonReport[]> {
  try {
    const q = query(collection(db, 'lessons'), orderBy('date', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LessonReport));
  } catch (error) {
    console.warn("Firestore listAllLessonReports failed:", error);
    return [];
  }
}

export async function listAllMonthlyReports(): Promise<MonthlyReport[]> {
  try {
    const q = query(collection(db, 'monthlyReports'), orderBy('month', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyReport));
  } catch (error) {
    console.warn("Firestore listAllMonthlyReports failed:", error);
    return [];
  }
}

export async function listLessonReportsByStudent(studentId: string): Promise<LessonReport[]> {
  try {
    const q = query(collection(db, 'lessons'), where('studentId', '==', studentId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LessonReport));
  } catch (error) {
    console.warn("Firestore listLessonReportsByStudent failed:", error);
    return [];
  }
}

export async function listMonthlyReportsByStudent(studentId: string): Promise<MonthlyReport[]> {
  try {
    const q = query(collection(db, 'monthlyReports'), where('studentId', '==', studentId), orderBy('month', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyReport));
  } catch (error) {
    console.warn("Firestore listMonthlyReportsByStudent failed:", error);
    return [];
  }
}

export async function saveActivityAttempt(attempt: ActivityAttempt): Promise<void> {
  try {
    await addDoc(collection(db, 'activityAttempts'), {
      ...attempt,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving activity attempt to Firestore:", error);
    throw error;
  }
}

export async function listActivityAttemptsByStudent(studentId: string): Promise<ActivityAttempt[]> {
  try {
    const q = query(collection(db, 'activityAttempts'), where('studentId', '==', studentId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityAttempt));
  } catch (error) {
    console.warn("Firestore listActivityAttemptsByStudent failed:", error);
    return [];
  }
}

export async function getStudentById(studentId: string): Promise<Student | undefined> {
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
  try {
    const docRef = await addDoc(collection(db, 'classrooms'), {
      ...classroom,
      active: true,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding classroom:", error);
    const id = `c-${Date.now()}`;
    MOCK_CLASSROOMS.push({ id, ...classroom });
    return id;
  }
}

export async function updateClassroom(id: string, classroom: Partial<Classroom>): Promise<void> {
  try {
    await setDoc(doc(db, 'classrooms', id), classroom, { merge: true });
  } catch (error) {
    console.error("Error updating classroom:", error);
    const idx = MOCK_CLASSROOMS.findIndex(c => c.id === id);
    if (idx !== -1) MOCK_CLASSROOMS[idx] = { ...MOCK_CLASSROOMS[idx], ...classroom };
  }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...student,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding student:", error);
    const id = `s-${Date.now()}`;
    MOCK_STUDENTS.push({ id, ...student });
    return id;
  }
}

export async function updateStudent(id: string, student: Partial<Student>): Promise<void> {
  try {
    await setDoc(doc(db, 'students', id), student, { merge: true });
  } catch (error) {
    console.error("Error updating student:", error);
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx !== -1) MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...student };
  }
}
