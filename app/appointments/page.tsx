'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse, Appointment } from '../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/check-auth')
      .then((res) => res.json())
      .then((data: AuthResponse) => {
        if (!data.success) {
          router.push('/');
        } else {
          fetch('/api/appointments')
            .then((res) => res.json())
            .then((data: { appointments: Appointment[] }) => setAppointments(data.appointments));
        }
      });
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/appointments/edit/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
      <h1 className="text-4xl font-bold mb-8">My appointments</h1>
      <ul className="bg-white text-black rounded-lg p-4 shadow-lg w-full max-w-2xl mb-8">
        {appointments.map(appointment => (
          <li key={appointment.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
            <div>
              <p>
                {new Date(appointment.startDate).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}{' '} | {' '}
                {new Date(appointment.startDate).toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' })}{' '}
                -{' '}
                {new Date(appointment.endDate).toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-gray-600">Description: {appointment.description}</p>
              <p className="text-gray-600">Student: {appointment.student.name}</p>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                onClick={() => handleEdit(appointment.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => handleDelete(appointment.id)}
              >
                Erase
              </button>
            </div>
          </li>
        ))}
      </ul>
      <NavigationButton path="/dashboard">Return to dashboard</NavigationButton> 
    </div>
  );
}
