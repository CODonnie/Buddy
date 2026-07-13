-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('CONFUSED', 'FOCUSED', 'TIRED', 'MOTIVATED');

-- CreateTable
CREATE TABLE "LearningEntry" (
    "id" TEXT NOT NULL,
    "studySessionId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "notes" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "understanding" INTEGER,
    "mood" "Mood",
    "usedAI" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalStudyMinutes" INTEGER NOT NULL DEFAULT 0,
    "studyStreak" INTEGER NOT NULL DEFAULT 0,
    "averageUnderstanding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastStudyDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningEntry_studySessionId_key" ON "LearningEntry"("studySessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_key" ON "LearningProfile"("userId");

-- AddForeignKey
ALTER TABLE "LearningEntry" ADD CONSTRAINT "LearningEntry_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
