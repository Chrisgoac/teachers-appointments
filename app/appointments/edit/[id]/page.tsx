'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Appointment, AuthResponse } from '../../../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';

export default function EditAppointment() {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<{ id: number, name: string }[]>([]);
  const [appointmentType, setAppointmentType] = useState('');
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
              const startDateTime = new Date(data.appointment.startDate);
              const endDateTime = new Date(data.appointment.endDate);

              // Get the offset in minutes and adjust the time
              const offsetInMinutes = startDateTime.getTimezoneOffset();
              startDateTime.setMinutes(startDateTime.getMinutes() - offsetInMinutes);
              endDateTime.setMinutes(endDateTime.getMinutes() - offsetInMinutes);

              // Get the date in YYYY-MM-DD format
              setDate(startDateTime.toISOString().substring(0, 10));

              // Get the time in HH:MM format
              setStartTime(startDateTime.toISOString().substring(11, 16));
              setEndTime(endDateTime.toISOString().substring(11, 16));

              setDescription(data.appointment.description);
              setStudentId(data.appointment.studentId);
              setAppointmentType(data.appointment.type);
            });
          fetch('/api/students')
            .then((res) => res.json())
            .then((data: { students: { id: number, name: string }[] }) => setStudents(data.students));
        }
      });
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate: startDateTime, endDate: endDateTime, description, studentId, type: appointmentType }),
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
          <span className="text-gray-700">Appointment date</span>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Appointment start time</span>
          <input
            type="time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Appointment end time</span>
          <input
            type="time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Appointment Type</span>
          <select
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="in person">In Person</option>
          </select>
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
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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

