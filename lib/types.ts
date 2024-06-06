export interface User {
    id: number;
    email: string;
    name: string;
}
  
export interface Student {
    id: number;
    name: string;
    email: string;
    appointments: Appointment[];
}
  
export interface Appointment {
    id: number;
    studentId: number;
    startDate: Date;
    endDate: Date;
    description: string;
    student: Student;
}
  
export interface AuthResponse {
    success: boolean;
    user?: User | null;
    message?: string;
}
  