/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `CreatorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CreatorProfile` table without a default value. This is not possible if the table is not empty.
  - Made the column `payoutEmail` on table `CreatorProfile` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPPORT';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "subscriptionPrice" DROP NOT NULL,
ALTER COLUMN "totalEarnings" DROP NOT NULL,
ALTER COLUMN "payoutEmail" SET NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "notifyLink" TEXT,
ADD COLUMN     "topic" VARCHAR(100),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accReportReason" VARCHAR(500),
ADD COLUMN     "isAccReport" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_username_key" ON "CreatorProfile"("username");
