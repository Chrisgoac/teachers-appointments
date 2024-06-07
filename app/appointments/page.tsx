'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse, Appointment } from '../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';
export default function Appointments() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const router = useRouter();

  const loadAppointments = () => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data: { appointments: Appointment[] }) => {
        const sortedAppointments = data.appointments.sort((a, b) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
        
        setAppointments(sortedAppointments);
      });
  };

  useEffect(() => {
    fetch('/api/check-auth')
      .then((res) => res.json())
      .then((data: AuthResponse) => {
        if (!data.success) {
          router.push('/');
        } else {
          loadAppointments();
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

  const handleComplete = async (id: number) => {

    await fetch(`/api/appointments/${id}/mark-completed`, {
      method: 'PUT',
      body: JSON.stringify({ completed: true })
    });

    loadAppointments();
  };

  const handleUncomplete = async (id: number) => {

    await fetch(`/api/appointments/${id}/mark-completed`, {
      method: 'PUT',
      body: JSON.stringify({ completed: false })
    });

    loadAppointments();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
      <h1 className="text-4xl font-bold mb-8">My appointments</h1>
      

      <label className="inline-flex mb-4 items-center cursor-pointer">
        <span className="mr-2 text-md font-medium">Show completed appointments</span>
        <input 
          type="checkbox" 
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)} className="sr-only peer"/>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>

      <ul className="bg-white text-black rounded-lg p-4 shadow-lg w-full max-w-2xl mb-8">
        {appointments
          .filter(appointment => showCompleted ? true : !appointment.completed)
          .map(appointment => (
          <li key={appointment.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
            <div>
              <p>
                {new Date(appointment.startDate).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}{' '} | {' '}
                {new Date(appointment.startDate).toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' })}{' '}
                -{' '}
                {new Date(appointment.endDate).toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-gray-600">Description: {appointment.description}</p>
              <p className="text-gray-600">Type: {appointment.type}</p>
              <p className="text-gray-600">Student: {appointment.student.name}</p>
            </div>
            <div>
              {!appointment.completed && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                  onClick={() => handleComplete(appointment.id)}
                >
                  Mark as completed
                </button>
              )}
              {appointment.completed && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                  onClick={() => handleUncomplete(appointment.id)}
                >
                  Mark as uncompleted
                </button>
              )}
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
