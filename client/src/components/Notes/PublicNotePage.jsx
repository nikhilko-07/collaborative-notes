import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientServer from '../../config/redux';

const PublicNotePage = () => {
    const { shareId } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPublic = async () => {
            try {
                const raw = localStorage.getItem('token');
                const token = raw ? raw.replace(/['"]+/g, '') : null;
                const res = await clientServer.get(`/notes/public/${shareId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setNote(res.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.error || 'This note is not available.');
            }
        };
        loadPublic();
    }, [shareId]);


    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                    CollabNotes
                </h1>

                <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                    <p className="text-red-500 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">Loading note...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* TOP BAR */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">

                    <h1 className="text-2xl font-bold text-blue-600">
                        CollabNotes
                    </h1>

                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                        Public • Read Only
                    </span>
                </div>
            </header>

            {/* DOCUMENT */}
            <main className="max-w-4xl mx-auto px-6 py-12">

                <article className="bg-white shadow-md rounded-2xl p-10">

                    <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                        {note.title}
                    </h2>

                    <div className="border-t pt-6">
                        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-7">
                            {note.content}
                        </pre>
                    </div>

                </article>

            </main>
        </div>
    );
};

export default PublicNotePage;