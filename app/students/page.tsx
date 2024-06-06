'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse, Student } from '../../lib/types';
import NavigationButton from '@/lib/components/NavigationButton';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/check-auth')
      .then((res) => res.json())
      .then((data: AuthResponse) => {
        if (!data.success) {
          router.push('/');
        } else {
          fetch('/api/students')
            .then((res) => res.json())
            .then((data: { students: Student[] }) => setStudents(data.students));
        }
      });
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/students/edit/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8">My students</h1>
      <ul className="bg-white text-black rounded-lg p-4 shadow-lg w-full max-w-2xl mb-8">
        {students.map(student => (
          <li key={student.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
            <div>
              <p>{student.name}</p>
              <p className="text-gray-600">{student.email}</p>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                onClick={() => handleEdit(student.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => handleDelete(student.id)}
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
