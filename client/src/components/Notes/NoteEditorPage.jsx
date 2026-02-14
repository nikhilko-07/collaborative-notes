import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '../../hooks/useSocket';
import {
    deleteNote,
    fetchNoteById,
    shareNote,
} from '../../config/redux/action/noteAction';
import CollaboratorsPanel from './CollaboratorsPanel';

const NoteEditorPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentNote, status, shareError } = useSelector((state) => state.notes);

    const [localTitle, setLocalTitle] = useState('');
    const [localContent, setLocalContent] = useState('');
    const [publicUrl, setPublicUrl] = useState(null);

    const { emitUpdate } = useSocket(id);

    useEffect(() => {
        dispatch(fetchNoteById(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (!currentNote) return;

        setLocalTitle(currentNote.title || '');
        setLocalContent(currentNote.content || '');

        if (currentNote.publicShareId) {
            setPublicUrl(`${window.location.origin}/public/${currentNote.publicShareId}`);
        }
    }, [currentNote]);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setLocalTitle(value);
        emitUpdate({ title: value, content: localContent });
    };

    const handleContentChange = (e) => {
        const value = e.target.value;
        setLocalContent(value);
        emitUpdate({ title: localTitle, content: value });
    };

    const handleDelete = async () => {
        const ok = window.confirm('Are you sure you want to delete this note?');
        if (!ok) return;

        const action = await dispatch(deleteNote(id));
        if (deleteNote.fulfilled.match(action)) {
            navigate('/notes');
        }
    };

    const handleShare = async () => {
        if (currentNote?.publicShareId) {
            setPublicUrl(`${window.location.origin}/public/${currentNote.publicShareId}`);
            return;
        }

        const action = await dispatch(shareNote(id));
        if (shareNote.fulfilled.match(action)) {
            const { publicShareId } = action.payload;
            setPublicUrl(`${window.location.origin}/public/${publicShareId}`);
        }
    };

    if (status === 'loading' || !currentNote) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                Loading note...
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">

                <input
                    className="text-2xl font-semibold w-[45%] outline-none border-b-2 border-transparent focus:border-indigo-500 transition"
                    value={localTitle}
                    onChange={handleTitleChange}
                    placeholder="Untitled note"
                />

                <div className="flex items-center gap-3">

                    <Link
                        to="/notes"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        ← Back to notes
                    </Link>

                    <button
                        onClick={handleShare}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        Share
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        Delete
                    </button>

                    {shareError && (
                        <span className="text-red-500 text-sm">
                            {shareError}
                        </span>
                    )}
                </div>
            </header>

            {/* Public Link */}
            {publicUrl && (
                <div className="bg-indigo-50 border-b px-6 py-2 flex items-center gap-3">
                    <span className="text-sm font-medium text-indigo-700">
                        Public link:
                    </span>

                    <input
                        value={publicUrl}
                        readOnly
                        onClick={(e) => e.target.select()}
                        className="flex-1 bg-white border rounded-lg px-3 py-1 text-sm"
                    />
                </div>
            )}

            {/* Main */}
            <main className="flex flex-1 overflow-hidden">

                {/* Editor */}
                <section className="flex-1 p-6 overflow-y-auto">

          <textarea
              value={localContent}
              onChange={handleContentChange}
              placeholder="Start typing your note..."
              className="
                  w-full
                  h-full
                  resize-none
                  outline-none
                  bg-white
                  p-6
                  rounded-xl
                  shadow-sm
                  text-gray-700
                  leading-relaxed
                  text-[16px]
              "
          />

                </section>

                {/* Right Sidebar */}
                <aside className="w-[340px] bg-white border-l p-4 flex flex-col gap-4 overflow-y-auto">

                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                        <h2 className="font-semibold mb-2">
                            Collaborators
                        </h2>
                        <CollaboratorsPanel noteId={id} />
                    </div>

                </aside>

            </main>
        </div>
    );
};

export default NoteEditorPage;
