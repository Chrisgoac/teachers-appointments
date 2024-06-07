// /pages/appointments/edit/[id].tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Appointment, AuthResponse } from '../../../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';

export default function EditAppointment() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<{ id: number, name: string }[]>([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetch('/api/check-auth')
      .then((res) => res.json())
      .then((data: AuthResponse) => {
        if (!data.success) {
          router.push('/');
        } else {
          fetch(`/api/appointments/${id}`)
            .then((res) => res.json())
            .then((data: { appointment: Appointment }) => {
              // Adjust the time for Europe Central Time (CET)
              const startDateTime = new Date(data.appointment.startDate);
              const endDateTime = new Date(data.appointment.endDate);

              // Get the offset in minutes and adjust the time
              const offsetInMinutes = startDateTime.getTimezoneOffset();
              startDateTime.setMinutes(startDateTime.getMinutes() - offsetInMinutes);
              endDateTime.setMinutes(endDateTime.getMinutes() - offsetInMinutes);

              setStartDate(startDateTime.toISOString().substring(0, 16));
              setEndDate(endDateTime.toISOString().substring(0, 16));
              setDescription(data.appointment.description);
              setStudentId(data.appointment.studentId);
            });
          fetch('/api/students')
            .then((res) => res.json())
            .then((data: { students: { id: number, name: string }[] }) => setStudents(data.students));
        }
      });
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate, description, studentId }),
    });

    if (res.ok) {
      router.push('/appointments');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-green-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Edit appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-700">Appointment start date</span>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Appointment end date</span>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Appointment description</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Student</span>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentId ?? ''}
            onChange={(e) => setStudentId(Number(e.target.value))}
          >
            <option value="" disabled>Select a student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Save
        </button>
        <NavigationButton path="/appointments">Cancel</NavigationButton>
      </form>
    </div>
  );
}
