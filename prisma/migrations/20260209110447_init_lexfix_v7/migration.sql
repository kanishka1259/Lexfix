-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LEARNER', 'PARENT', 'EDUCATOR', 'PARENT_EDUCATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "MasteryLevel" AS ENUM ('NOT_STARTED', 'EMERGING', 'DEVELOPING', 'PROFICIENT', 'MASTERED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LEARNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "createdLessons" TEXT[],

    CONSTRAINT "EducatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorStudent" (
    "id" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EducatorStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeschoolFamily" (
    "id" TEXT NOT NULL,
    "primaryParentId" TEXT NOT NULL,
    "children" TEXT[],

    CONSTRAINT "HomeschoolFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NICompetency" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "competencyCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "gradeLevel" INTEGER NOT NULL,
    "masteryLevel" "MasteryLevel" NOT NULL DEFAULT 'NOT_STARTED',
    "dateAchieved" TIMESTAMP(3),
    "evidenceLinks" JSONB,

    CONSTRAINT "NICompetency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EducatorProfile_userId_key" ON "EducatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeschoolFamily_primaryParentId_key" ON "HomeschoolFamily"("primaryParentId");

-- AddForeignKey
ALTER TABLE "EducatorProfile" ADD CONSTRAINT "EducatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "EducatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
