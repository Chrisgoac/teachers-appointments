// components/NavigationButton.js
import React from 'react';
import { useRouter } from 'next/navigation';

const NavigationButton = ({ path, children } : { path: string, children: string }) => {
  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <button
      className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default NavigationButton;
