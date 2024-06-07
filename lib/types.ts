export interface User {
    id: number;
    email: string;
    name: string;
}
  
export interface Student {
    id: number;
    name: string;
    email: string;
    description: string;
    appointments: Appointment[];
}
  
export interface Appointment {
    id: number;
    completed: boolean;
    studentId: number;
    startDate: Date;
    endDate: Date;
    type: string;
    description: string;
    student: Student;
}
  
export interface AuthResponse {
    success: boolean;
    user?: User | null;
    message?: string;
}
  