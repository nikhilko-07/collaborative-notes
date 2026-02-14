import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { login } from "../../config/redux/action/authAction";

const LoginPage = () => {
    const dispatch = useDispatch();
    const { token, status, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: '', password: '' });

    if (token) return <Navigate to="/notes" replace />;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Welcome Back 👋
                </h2>
                <p className="text-gray-500 text-center mb-6">
                    Login to continue collaborating
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-blue-300"
                    >
                        {status === 'loading' ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <p className="text-red-500 mt-4 text-center font-medium">
                        {error}
                    </p>
                )}

                {/* Signup Link */}
                <p className="text-center text-gray-600 mt-6">
                    New here?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Create an account
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;
