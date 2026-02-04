import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
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
    const [error, setError] = useState({});

    // Capitalize first letter
    const userRole = userType.charAt(0).toUpperCase() + userType.slice(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            loginSchema.parse(formData);

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save user data/token if needed
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                setError({});
                navigate('/dashboard');
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
                setError({ custom: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-40" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] bg-white p-[25px] shadow-xl z-50 focus:outline-none">
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

                        <button type="submit" className="h-11 bg-brand-orange text-gray-900 font-bold rounded-md hover:opacity-90 mt-2 border border-brand-orange">
                            Log In
                        </button>
                    </form>

                    <SocialLogin />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default LoginModal;
