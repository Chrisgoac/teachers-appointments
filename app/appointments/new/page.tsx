'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '../../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';

export default function NewAppointment() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data: { students: Student[] }) => setStudents(data.students));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedStudentId) {
      alert('Por favor, selecciona un estudiante.');
      return;
    }

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId: selectedStudentId, startDate, endDate, description }),
    });

    if (res.ok) {
      router.push('/appointments');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Create new appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-700">Student</span>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          >
            <option className="text-gray-700 mx-2" value="" disabled>Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
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
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Create
        </button>
        <NavigationButton path="/dashboard">Cancel</NavigationButton>
      </form>
    </div>
  );
}
