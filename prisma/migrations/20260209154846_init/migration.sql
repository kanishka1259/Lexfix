/*
  Warnings:

  - The values [LEARNER,PARENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdLessons` on the `EducatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `EducatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `EducatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `HomeschoolFamily` table. All the data in the column will be lost.
  - You are about to drop the column `primaryParentId` on the `HomeschoolFamily` table. All the data in the column will be lost.
  - You are about to drop the column `competencyCode` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `dateAchieved` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `evidenceLinks` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevel` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `learnerId` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `masteryLevel` on the `NICompetency` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `NICompetency` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[educatorId,studentId]` on the table `EducatorStudent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `HomeschoolFamily` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `HomeschoolFamily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `NICompetency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NICompetency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'EDUCATOR', 'PARENT_EDUCATOR', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "EducatorProfile" DROP CONSTRAINT "EducatorProfile_userId_fkey";

-- DropIndex
DROP INDEX "HomeschoolFamily_primaryParentId_key";

-- AlterTable
ALTER TABLE "EducatorProfile" DROP COLUMN "createdLessons",
DROP COLUMN "fullName",
DROP COLUMN "specialization",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "institution" TEXT;

-- AlterTable
ALTER TABLE "EducatorStudent" ADD COLUMN     "competencyId" TEXT;

-- AlterTable
ALTER TABLE "HomeschoolFamily" DROP COLUMN "children",
DROP COLUMN "primaryParentId",
ADD COLUMN     "members" TEXT[],
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NICompetency" DROP COLUMN "competencyCode",
DROP COLUMN "dateAchieved",
DROP COLUMN "evidenceLinks",
DROP COLUMN "gradeLevel",
DROP COLUMN "learnerId",
DROP COLUMN "masteryLevel",
DROP COLUMN "subject",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- DropEnum
DROP TYPE "MasteryLevel";

-- CreateIndex
CREATE UNIQUE INDEX "EducatorStudent_educatorId_studentId_key" ON "EducatorStudent"("educatorId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeschoolFamily_userId_key" ON "HomeschoolFamily"("userId");

-- AddForeignKey
ALTER TABLE "EducatorProfile" ADD CONSTRAINT "EducatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "NICompetency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeschoolFamily" ADD CONSTRAINT "HomeschoolFamily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
