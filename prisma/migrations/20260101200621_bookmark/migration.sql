-- CreateEnum
CREATE TYPE "BookmarkType" AS ENUM ('POST');

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "BookmarkType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_targetId_key" ON "Bookmark"("targetId");
