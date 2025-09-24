/*
  Warnings:

  - You are about to drop the `PromptRefinement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PromptRefinement" DROP CONSTRAINT "PromptRefinement_promptId_fkey";

-- AlterTable
ALTER TABLE "public"."Prompt" ADD COLUMN     "refined" TEXT,
ADD COLUMN     "strategy" TEXT,
ALTER COLUMN "response" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."PromptRefinement";
