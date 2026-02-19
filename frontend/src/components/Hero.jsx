import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { BookOpen, Users, BarChart, Mic, Gamepad2, Settings } from 'lucide-react'; // Example icons
import SignupModal from './auth/SignupModal';

const contentData = {
    student: {
        title: "Learning tailored for YOU",
        subtitle: "Overcome challenges with tools designed for your success.",
        features: [
            {
                icon: <Mic className="w-8 h-8 text-blue-600 mb-3" />,
                title: "Text-to-Speech",
                description: "Listen to lessons while you read to boost understanding."
            },
            {
                icon: <Gamepad2 className="w-8 h-8 text-green-600 mb-3" />,
                title: "Gamified Learning",
                description: "Earn rewards and badges while you master new skills."
            },
            {
                icon: <Settings className="w-8 h-8 text-purple-600 mb-3" />,
                title: "Personalized Settings",
                description: "Adjust fonts, backgrounds, and reading speeds to fit your needs."
            }
        ],
        bgColor: "bg-blue-50"
    },
    teacher: {
        title: "Empower every student in your classroom",
        subtitle: "Data-driven insights and structured literacy tools.",
        features: [
            {
                icon: <BarChart className="w-8 h-8 text-indigo-600 mb-3" />,
                title: "Progress Tracking",
                description: "Monitor student growth with detailed analytics and reports."
            },
            {
                icon: <BookOpen className="w-8 h-8 text-orange-600 mb-3" />,
                title: "Structured Curriculum",
                description: "Access research-based lessons designed for diverse learners."
            },
            {
                icon: <Users className="w-8 h-8 text-teal-600 mb-3" />,
                title: "Classroom Management",
                description: "Easily assign tasks and manage groups of students."
            }
        ],
        bgColor: "bg-indigo-50"
    },
    parent: {
        title: "Support your child's learning journey",
        subtitle: "Stay connected and see them thrive.",
        features: [
            {
                icon: <Users className="w-8 h-8 text-rose-600 mb-3" />,
                title: "Parent Dashboard",
                description: "View your child's progress and celebrate their milestones."
            },
            {
                icon: <BookOpen className="w-8 h-8 text-cyan-600 mb-3" />,
                title: "At-Home Activities",
                description: "Get resources to support learning outside the classroom."
            },
            {
                icon: <Settings className="w-8 h-8 text-yellow-600 mb-3" />,
                title: "Safe Environment",
                description: "A secure platform focused purely on educational growth."
            }
        ],
        bgColor: "bg-rose-50"
    }
};

const Hero = () => {
    const { userType } = useAppContext();
    // Fallback to student if userType is somehow undefined, though it defaults in context
    const content = contentData[userType] || contentData.student;

    return (
        <main className="flex-1 flex flex-col w-full relative">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center py-20 px-6 text-center relative overflow-hidden bg-brand-cream" aria-labelledby="hero-title">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>

                <h1 id="hero-title" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10 max-w-3xl">
                    {content.title}
                </h1>
                <p className="text-xl text-gray-800 mb-8 max-w-2xl relative z-10">
                    {content.subtitle}
                </p>
                <SignupModal
                    trigger={
                        <button className="px-8 py-3 bg-brand-orange text-gray-950 border border-brand-orange rounded-full font-semibold hover:opacity-90 transition relative z-10 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Get Started Free
                        </button>
                    }
                />
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 md:px-12 bg-white" aria-labelledby="features-title">
                <div className="max-w-6xl mx-auto">
                    <h2 id="features-title" className="text-2xl font-bold text-center mb-12 text-gray-800">Why efficient for {userType}s?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-center md:justify-start">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-800">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Hero;
