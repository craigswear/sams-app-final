import { Timestamp } from 'firebase/firestore';
export type UserRole = 'admin' | 'teacher';
export interface UserProfile { uid: string; email: string; role: UserRole; firstName: string; lastName: string; }
export interface Accommodation { id: string; name: string; description: string; }
export interface Student { id: string; firstName: string; lastName: string; studentId: string; accommodations: Accommodation[]; }
export interface TeacherClass { id: string; name: string; teacherId: string; studentIds: string[]; }
export interface AccommodationLog { id: string; studentId: string; teacherId: string; accommodationId: string; date: Timestamp; implementationNotes: string; effectiveness: 1 | 2 | 3; }