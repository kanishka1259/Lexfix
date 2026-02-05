import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import SocialLogin from './SocialLogin';
import { useNavigate } from 'react-router-dom';

// Base Schema
const baseSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const disabilitiesOptions = [
    "Dyslexia",
    "Dysgraphia",
    "Dyscalculia",
    "ADHD",
    "Auditory Processing Disorder",
    "Language Processing Disorder",
    "Other"
];

const SignupModal = ({ trigger }) => {
    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userType: contextUserType, setUserType: setContextUserType, setUser } = useAppContext();
    const navigate = useNavigate();

    const [activeUserType, setActiveUserType] = useState(contextUserType || 'student');
    const userRole = activeUserType.charAt(0).toUpperCase() + activeUserType.slice(1);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Student specific state
    const [selectedDisabilities, setSelectedDisabilities] = useState([]);

    // Parent specific state
    const [childIds, setChildIds] = useState(['']);

    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDisabilityChange = (disability) => {
        if (selectedDisabilities.includes(disability)) {
            setSelectedDisabilities(selectedDisabilities.filter(d => d !== disability));
        } else {
            setSelectedDisabilities([...selectedDisabilities, disability]);
        }
    };

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

    const handleNext = (e) => {
        e.preventDefault();
        try {
            baseSchema.parse(formData);
            setError({});
            setStep(2);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = {};
                err.errors.forEach(e => {
                    fieldErrors[e.path[0]] = e.message;
                });
                setError(fieldErrors);
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Final Validation for Step 2
        if (userType === 'parent') {
            const validIds = childIds.filter(id => id.trim().length > 0);
            if (validIds.length === 0) {
                setError({ ...error, custom: "Please enter at least one Child Student ID." });
                return;
            }
        }

        setIsSubmitting(true);
        setError({});

        try {
            const payload = {
                ...formData,
                userType: activeUserType,
                disabilities: activeUserType === 'student' ? selectedDisabilities : undefined,
                childIds: activeUserType === 'parent' ? childIds.filter(id => id.trim().length > 0) : undefined
            };

            console.log("SignupModal: Sending payload:", payload);

            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("SignupModal: Response received:", data);

            if (response.ok) {
                if (userType === 'student') {
                    alert(`Sign up successful! Your new Student ID is: ${data.studentId}`);
                }
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                navigate('/dashboard');
            } else {
                setError({ ...error, custom: data.message || 'Signup failed' });
            }

        } catch (err) {
            console.error("SignupModal: Error during submit:", err);
            setError({ ...error, custom: 'An error occurred. Please try again. check console.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="flex flex-col gap-3">
            {/* Role Selector inside Modal */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-2">
                {['student', 'teacher', 'parent'].map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setActiveUserType(role)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeUserType === role
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>

            {error.custom && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-md border border-red-200">
                    {error.custom}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">Username</label>
                <input
                    type="text"
                    className={`h-10 px-3 rounded-md border ${error.username ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
                {error.username && <span className="text-xs text-red-500">{error.username}</span>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">Email</label>
                <input
                    type="email"
                    className={`h-10 px-3 rounded-md border ${error.email ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                {error.email && <span className="text-xs text-red-500">{error.email}</span>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <input
                    type="password"
                    className={`h-10 px-3 rounded-md border ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                {error.password && <span className="text-xs text-red-500">{error.password}</span>}
            </div>

            {activeUserType === 'teacher' ? (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-10 bg-brand-orange text-gray-900 font-bold rounded-md hover:opacity-90 mt-1 border border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 flex items-center justify-center gap-2 bg-brand-orange text-gray-900 font-bold rounded-md hover:opacity-90 mt-1 border border-brand-orange"
                >
                    Next <ArrowRight size={18} />
                </button>
            )}

            <SocialLogin />
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => setStep(1)}
                className="self-start flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Student Specifics */}
            {activeUserType === 'student' && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Do you have any known disabilities?</label>
                    <p className="text-xs text-gray-500 mb-1">Select all that apply (optional)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {disabilitiesOptions.map(option => (
                            <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedDisabilities.includes(option)}
                                    onChange={() => handleDisabilityChange(option)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Parent Specifics */}
            {activeUserType === 'parent' && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Link Student Account(s)</label>
                    <p className="text-xs text-gray-500 mb-1">Enter the Student ID generated from your child's account.</p>

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
                                    title="Remove Child ID"
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
                    {error.custom && <span className="text-sm text-red-500">{error.custom}</span>}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 bg-brand-orange text-gray-900 font-bold rounded-md hover:opacity-90 mt-4 border border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
        </div>
    );

    return (
        <Dialog.Root onOpenChange={(open) => { if (!open) setStep(1); }}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-40" />
                <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[12px] bg-white p-[25px] shadow-xl z-50 focus:outline-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <Dialog.Title className="text-2xl font-bold text-gray-900">
                                Sign Up as {userRole}
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-500 text-sm mt-1">
                                {step === 1 ? "Create your account details." : "Just a few more details."}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-600 outline-none"><X size={20} /></button>
                        </Dialog.Close>
                    </div>

                    {step === 1 ? renderStep1() : renderStep2()}

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SignupModal;
