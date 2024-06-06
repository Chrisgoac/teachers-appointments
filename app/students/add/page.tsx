'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavigationButton from '@/lib/components/NavigationButton';

export default function AddStudent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      router.push('/students');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Add student</h1>
      <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-8 shadow-lg w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-700">Student name</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Student email</span>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Add
        </button>
        <NavigationButton path="/dashboard">Cancel</NavigationButton>
      </form>
    </div>
  );
}
