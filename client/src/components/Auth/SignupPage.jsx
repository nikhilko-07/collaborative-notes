import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { register } from '../../config/redux/action/authAction';

const SignupPage = () => {
    const dispatch = useDispatch();
    const { token, status, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER',
    });

    if (token) return <Navigate to="/notes" replace />;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                    Sign up
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Create an account to start collaborating on notes
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 mt-1">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
