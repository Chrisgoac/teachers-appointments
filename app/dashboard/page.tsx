'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '../../lib/types';
import FileUpload from '@/lib/components/FileUpload';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/check-auth')
      .then((res) => res.json())
      .then((data: AuthResponse) => {
        if (!data.success) {
          router.push('/');
        } else {
          setUser(data.user || null);
        }
      });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/students')}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          My students
        </button>
        <button 
          onClick={() => router.push('/students/add')}
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Add new student
        </button>
        <button 
          onClick={() => router.push('/appointments/new')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Create new appointment
        </button>
        <button 
          onClick={() => router.push('/appointments')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          My appointments
        </button>
      </div>
    </div>
  );
}
