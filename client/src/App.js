import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import NotesListPage from './components/Notes/NotesListPage';
import NoteEditorPage from './components/Notes/NoteEditorPage';
import PublicNotePage from './components/Notes/PublicNotePage';
import ActivityFeedPage from './components/Activity/ActivityFeedPage';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected app pages */}
                <Route
                    path="/notes"
                    element={
                        <PrivateRoute>
                            <NotesListPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notes/:id"
                    element={
                        <PrivateRoute>
                            <NoteEditorPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/activity"
                    element={
                        <PrivateRoute>
                            <ActivityFeedPage />
                        </PrivateRoute>
                    }
                />

                {/* Public shared note */}
                <Route path="/public/:shareId" element={<PublicNotePage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/notes" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
