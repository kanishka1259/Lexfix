import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import SocialLogin from './SocialLogin';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

const LoginModal = ({ trigger }) => {
    const { userType, setUser } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [childIds, setChildIds] = useState(['']);
    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Capitalize first letter
    const userRole = (userType || 'student').charAt(0).toUpperCase() + (userType || 'student').slice(1);

    const handleChildIdChange = (index, value) => {
        const newIds = [...childIds];
        newIds[index] = value;
        setChildIds(newIds);
    };

    const addChildIdField = () => setChildIds([...childIds, '']);

    const removeChildIdField = (index) => {
        if (childIds.length > 1) {
            const newIds = childIds.filter((_, i) => i !== index);
            setChildIds(newIds);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parent specific validation
        if (userType === 'parent') {
            const validIds = childIds.filter(id => id.trim().length > 0);
            if (validIds.length === 0) {
                setError({ custom: "Please enter at least one Student ID." });
                return;
            }
        }

        setIsSubmitting(true);
        setError({});

        try {
            loginSchema.parse(formData);

            const payload = {
                ...formData,
                childIds: userType === 'parent' ? childIds.filter(id => id.trim().length > 0) : undefined
            };

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // Normalize backend response
                // Backend sends { success: true, data: { role, name, ... } }
                // Frontend expects user.userType and user.username
                const rawUser = data.data || data;

                const normalizedUser = {
                    ...rawUser,
                    userType: rawUser.role || rawUser.userType || 'student',
                    username: rawUser.name || rawUser.username || rawUser.email.split('@')[0],
                    studentId: rawUser.studentId || '', // Ensure studentId exists if needed
                    token: rawUser.token || data.token
                };

                localStorage.setItem('user', JSON.stringify(normalizedUser));
                setUser(normalizedUser);
                setError({});

                // Redirect based on role
                if (normalizedUser.userType === 'teacher') {
                    navigate('/dashboard'); // Or dedicated teacher route if ready
                } else if (normalizedUser.userType === 'parent') {
                    navigate('/dashboard'); // Or dedicated parent route
                } else {
                    // Student - check for disability specific route if needed, otherwise dashboard
                    navigate('/dashboard');
                }
            } else {
                setError({ custom: data.message || 'Login failed' });
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = {};
                err.errors.forEach(e => {
                    fieldErrors[e.path[0]] = e.message;
                });
                setError(fieldErrors);
            } else {
                console.error(err);
                setError({ custom: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root onOpenChange={(open) => { if (!open) { setError({}); setChildIds(['']); } }}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-40" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] bg-white p-[25px] shadow-xl z-50 focus:outline-none overflow-y-auto">
                    <div className="flex justify-end mb-2">
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-600 outline-none"><X size={20} /></button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                        Log In as {userRole}
                    </Dialog.Title>

                    {error.custom && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                            {error.custom}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-900">Email</label>
                            <input
                                type="email"
                                className={`h-11 px-3 rounded-md border ${error.email ? 'border-red-500' : 'border-gray-300'}`}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            {error.email && <span className="text-sm text-red-500">{error.email}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-900">Password</label>
                            <input
                                type="password"
                                className={`h-11 px-3 rounded-md border ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            {error.password && <span className="text-sm text-red-500">{error.password}</span>}
                        </div>

                        {/* Parent Specifics */}
                        {userType === 'parent' && (
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="text-sm font-semibold text-gray-900">Student ID(s)</label>
                                <p className="text-xs text-gray-500 mb-1">Enter your child's Student ID to continue.</p>
                                {childIds.map((id, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. STU-123456"
                                            className="flex-1 h-10 px-3 rounded-md border border-gray-300"
                                            value={id}
                                            onChange={(e) => handleChildIdChange(index, e.target.value)}
                                        />
                                        {childIds.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeChildIdField(index)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addChildIdField}
                                    className="self-start flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-brand-orange"
                                >
                                    <Plus size={16} /> Add another child
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 bg-brand-orange text-gray-900 font-bold rounded-md hover:opacity-90 mt-2 border border-brand-orange disabled:opacity-50"
                        >
                            {isSubmitting ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    <SocialLogin />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default LoginModal;
