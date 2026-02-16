import React from 'react';
import type { Metadata } from 'next';
import prisma from '../../../lib/prisma'; 
// Import types from the specific client file
import type { EducatorStudent } from '../../../src/generated/prisma/client';

export const metadata: Metadata = {
  title: 'Educator Dashboard | LexFix',
  description: 'WCAG AAA Compliant Educator Interface',
};

export default async function EducatorDashboard() {
  /**
   * We fetch the data. Prisma 7 returns an array of EducatorStudent.
   * If the type inference is still failing, we can explicitly cast it.
   */
  const students: EducatorStudent[] = await prisma.educatorStudent.findMany({
    orderBy: {
      assignedAt: 'desc'
    }
  });

  return (
    <main className="p-8 space-y-8 bg-[#FDFDFD] min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Educator Overview
          </h1>
          <p className="text-slate-600 mt-1">
            Monitoring <span className="font-semibold text-blue-700">{students.length}</span> active learners.
          </p>
        </div>
        <button 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm"
          aria-label="Create new lesson"
        >
          + Create New Lesson
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? (
          // Explicitly typing the parameter here resolves ts(7006)
          students.map((student: EducatorStudent) => (
            <div 
              key={student.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  ID: {student.studentId.substring(0, 8)}
                </h2>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">
                  Connected
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-blue-600">74%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: '74%' }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Linked on: {new Date(student.assignedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-500">No students found in the PostgreSQL database.</p>
          </div>
        )}
      </section>
    </main>
  );
}