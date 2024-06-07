// /pages/students/edit/[id].tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthResponse, Student } from '../../../../lib/types';
import NavigationButton from '../../../../lib/components/NavigationButton';

export default function EditStudent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((res) => res.json())
      .then((data: { student: Student }) => {
        setName(data.student.name);
        setEmail(data.student.email);
        setDescription(data.student.description);
      });
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, description }),
    });

    if (res.ok) {
      router.push('/students');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Edit student</h1>
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
        <label className="block mb-4">
          <span className="text-gray-700">Student description</span>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
        >
          Save
        </button>
        <NavigationButton path="/students">Cancel</NavigationButton>
      </form>
    </div>
  );
}
