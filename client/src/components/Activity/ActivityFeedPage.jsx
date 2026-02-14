import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timeAgo } from '../../utils/timeAgo';
import { getActivityText } from '../../utils/activityText';
import { Link } from 'react-router-dom';
import { fetchActivityFeed } from "../../config/redux/action/activityAction";

const ActivityFeedPage = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.activityFeed);
    const { user } = useSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchActivityFeed());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

                    <h1 className="text-2xl font-bold text-blue-600">
                        CollabNotes
                    </h1>

                    <span className="text-gray-700 font-semibold">
                        Activity
                    </span>

                    <Link
                        to="/notes"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        ← Back to notes
                    </Link>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-3xl mx-auto px-4 py-10">

                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    Recent Activity
                </h2>

                {/* STATES */}
                {loading && (
                    <div className="text-center text-gray-500">
                        Loading activity...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {/* EMPTY */}
                {items.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
                        No recent activity.
                    </div>
                )}

                {/* ACTIVITY LIST */}
                <div className="space-y-4">
                    {items.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border"
                        >
                            <div className="flex justify-between items-start">

                                <div className="text-gray-800 font-medium">
                                    {getActivityText(a, user?.id)}
                                </div>

                                <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                                    {timeAgo(a.createdAt)}
                                </span>

                            </div>

                            {a.note && (
                                <Link
                                    to={`/notes/${a.note.id}`}
                                    className="inline-block mt-3 text-sm text-blue-600 font-semibold hover:underline"
                                >
                                    Open note →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ActivityFeedPage;
