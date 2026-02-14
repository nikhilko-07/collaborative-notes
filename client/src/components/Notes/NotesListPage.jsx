import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../config/redux/action/authAction";
import { createNote, fetchNotes, searchNotes } from "../../config/redux/action/noteAction";

const NotesListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notes, status, error } = useSelector((state) => state.notes);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await dispatch(createNote({ title: newTitle, content: '' }));
        setNewTitle('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(searchNotes(searchTerm));
        } else {
            dispatch(fetchNotes());
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">

            {/* Navbar */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                <h1
                    onClick={() => navigate("/notes")}
                    className="text-xl font-bold text-indigo-600 cursor-pointer"
                >
                    CollabNotes
                </h1>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/notes")}
                        className="font-semibold text-gray-600 hover:text-indigo-600 transition"
                    >
                        My Notes
                    </button>
                    <button
                        onClick={() => navigate("/activity")}
                        className="font-semibold text-gray-600 hover:text-indigo-600 transition"
                    >
                        My Activities
                    </button>
                </div>

                {/* User & Logout */}
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm text-gray-500">
                            {user.email} ({user.role})
                        </span>
                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <section className="w-[360px] bg-white border-r p-5 flex flex-col gap-4">

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="bg-gray-200 hover:bg-gray-300 px-4 rounded-lg font-medium">
                            Search
                        </button>
                    </form>

                    {/* Create Note */}
                    <form onSubmit={handleCreateNote} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New note title..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg font-semibold transition">
                            + New
                        </button>
                    </form>

                    {/* Notes List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">

                        {status === 'loading' && (
                            <p className="text-gray-500">Loading notes...</p>
                        )}

                        {error && (
                            <p className="text-red-500">{error}</p>
                        )}

                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => navigate(`/notes/${note.id}`)}
                                className="cursor-pointer bg-gray-50 hover:bg-indigo-50 border rounded-xl p-4 transition shadow-sm hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-800">
                                    {note.title || 'Untitled note'}
                                </h3>

                                <p className="text-xs text-indigo-600 font-medium mt-1">
                                    {note.ownerId === user.id ? 'Owner' : 'Collaborator'}
                                </p>

                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {(note.content || 'No content yet...')}
                                </p>
                            </div>
                        ))}

                    </div>
                </section>

                {/* Placeholder */}
                <section className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                    Select a note from the left or create a new one.
                </section>

            </main>
        </div>
    );
};

export default NotesListPage;
