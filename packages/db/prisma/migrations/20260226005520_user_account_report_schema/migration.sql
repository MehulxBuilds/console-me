/*
  Warnings:

  - You are about to drop the column `accReportReason` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isAccReport` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PostReportReason" AS ENUM ('SPAM', 'ABUSE', 'COPYRIGHT', 'NSFW_VIOLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "UserReportReason" AS ENUM ('SPAM', 'ABUSE', 'COPYRIGHT', 'NSFW_VIOLATION', 'OTHER');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "accReportReason",
DROP COLUMN "isAccReport",
ADD COLUMN     "banReason" VARCHAR(500),
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Report";

-- DropEnum
DROP TYPE "ReportReason";

-- CreateTable
CREATE TABLE "ReportPost" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "postId" TEXT,
    "reason" "PostReportReason" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportAccount" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "userId" TEXT,
    "reason" "UserReportReason" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportPost" ADD CONSTRAINT "ReportPost_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAccount" ADD CONSTRAINT "ReportAccount_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
