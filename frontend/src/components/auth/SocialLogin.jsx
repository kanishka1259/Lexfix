import React from 'react';

// Simple icons for buttons (Google, Facebook, Apple)
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-6.095 5.86-6.095.688 0 2.214.288 2.378.337V8.52h-2.146c-1.393 0-1.873 1.258-1.873 2.72v1.127h3.805l-.612 3.667h-3.193v7.98h-4.22z" /></svg>
);

// Apple icon path
const AppleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.52-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.79C2.79 14.21 5.6 9.55 9.38 9.63c1.01.02 1.96.69 2.54.69.57 0 1.62-.86 2.72-.79 1.15.06 2.02.46 2.57 1.25-2.28 1.34-1.9 4.8.52 6.04-.33.85-.8 2.05-1.68 3.46zM12.01 7.54c.5-2.88 2.67-4.28 2.67-4.28s-.42 2.67-2.01 4.54c-1.33 1.57-2.9 1.33-2.9 1.33s.18-2.63 2.24-1.59z" /></svg>
);

const SocialLogin = () => {
    return (
        <>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">or</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <button type="button" className="flex items-center justify-center gap-3 h-10 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                    <GoogleIcon />
                    Continue with Google
                </button>
                <button type="button" className="flex items-center justify-center gap-3 h-10 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                    <FacebookIcon />
                    Continue with Facebook
                </button>
                <button type="button" className="flex items-center justify-center gap-3 h-10 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                    <AppleIcon />
                    Continue with Apple
                </button>
            </div>

            <div className="mt-4 text-center text-sm">
                <a href="#" className="text-blue-600 hover:underline">Sign up with your organization</a>
            </div>
        </>
    );
};

export default SocialLogin;
