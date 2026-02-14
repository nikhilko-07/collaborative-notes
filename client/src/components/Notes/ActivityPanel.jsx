import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityByNote } from "../../config/redux/action/activityAction";

const ActivityPanel = ({ noteId }) => {
    const dispatch = useDispatch();
    const { byNoteId = {}, loading, error } = useSelector((state) => state.activityFeed);

    const activity = byNoteId[noteId] || [];

    useEffect(() => {
        if (noteId) {
            dispatch(fetchActivityByNote(noteId));
        }
    }, [noteId, dispatch]);

    return (
        <div className="flex flex-col gap-4">

            {/* Heading */}
            <h2 className="text-lg font-semibold">
                Activity
            </h2>

            {/* Loading */}
            {loading && (
                <p className="text-sm text-gray-500">
                    Loading activity...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* Activity List */}
            <div className="
                flex flex-col gap-2
                max-h-[320px]
                overflow-y-auto
                pr-1
            ">

                {activity.map((a) => (
                    <div
                        key={a.id}
                        className="
                            bg-white
                            border
                            rounded-lg
                            p-3
                            hover:shadow-sm
                            transition
                        "
                    >
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">
                                {a.user?.email}
                            </span>

                            <span className="text-gray-500">
                                {" "}• {a.action}
                            </span>
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                            {new Date(a.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}

                {activity.length === 0 && !loading && !error && (
                    <p className="text-sm text-gray-500">
                        No activity yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActivityPanel;
