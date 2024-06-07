'use client'
import NavigationButton from '@/lib/components/NavigationButton'
import { AuthResponse, DbFile } from '@/lib/types'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Files() {
    const router = useRouter();
    const [file, setFile] = useState<File>()
    const [files, setFiles] = useState<DbFile[]>([])

    useEffect(() => {
        fetch('/api/check-auth')
          .then((res) => res.json())
          .then((data: AuthResponse) => {
            if (!data.success) {
              router.push('/');
            } else {
              fetch('/api/files')
                .then((res) => res.json())
                .then((data: { files: DbFile[] }) => setFiles(data.files));
            }
          });
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const currentFile = event.target.files[0]
            setFile(currentFile)
        }
    }

    const handleDownload = async (filename: string) => {
        const response = await fetch('/api/files/' + filename + '/download')
        const blob = await response.blob()
        const fileURL = window.URL.createObjectURL(blob)
        let anchor = document.createElement('a')
        anchor.href = fileURL
        anchor.download = filename
        anchor.click()
    }

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/files/${id}`, {
          method: 'DELETE',
        });
    
        if (res.ok) {
          setFiles(files.filter(file => file.id !== id)); 
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file, file.name);

        const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
        });

        const { url } = await response.json();
        await fetch(url, {
            method: 'PUT',
            body: formData,
        });
    };

    return (
        <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <h1 className="text-4xl font-bold mb-8">My files</h1>
            <ul className="bg-white text-black rounded-lg p-4 shadow-lg w-full max-w-2xl mb-8">
                {files.map(file => (
                <li key={file.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
                    <div>
                        <p>{file.name}</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="rounded-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 transition duration-300 transform hover:scale-105 mr-2" 
                            onClick={(e) => handleDownload(file.name)}
                        >
                            Download
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => handleDelete(file.id)}
                        >
                            Erase
                        </button>
                    </div>
                </li>
                ))}
            </ul>
            <h1 className="text-4xl font-bold mb-8">Teacher PDFs</h1>
            <p className="text-sm leading-6 text-gray-400 mb-10">
                Upload all the pdfs you have created.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
                <div className="sm:col-span-6">
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 mb-4">  
                        <div className="text-center">
                            <div className="mt-4 text-sm leading-6 text-gray-400">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        id="file-upload"
                                        name="file-upload"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            <p className="text-xs leading-5 text-gray-400">
                                {file?.name ? file.name : 'PDF up to 100MB'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-6 mt-6 mb-4">
                <button
                    type="submit"
                    className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 transition duration-300 transform hover:scale-105"
                    onClick={handleUpload}
                >
                    Upload
                </button>
            </div>
            <NavigationButton path="/dashboard">Return to dashboard</NavigationButton> 
        </div>
    </>
    );
}