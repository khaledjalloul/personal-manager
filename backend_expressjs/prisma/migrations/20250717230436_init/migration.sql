-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('manual', 'auto');

-- CreateEnum
CREATE TYPE "PianoPieceStatus" AS ENUM ('Planned', 'Learning', 'Learned', 'Learned_Forgotten');

-- CreateEnum
CREATE TYPE "VideoGameType" AS ENUM ('Online', 'Single_Player', 'Both');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpensesCategory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "ExpensesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,
    "description" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tags" TEXT[],
    "type" "ExpenseType" NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpensesCategoryKeyword" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "ExpensesCategoryKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "ascent" DOUBLE PRECISION NOT NULL,
    "descent" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationWithBreaks" INTEGER NOT NULL,
    "coverImage" TEXT NOT NULL,
    "images" TEXT[],
    "googleMapsUrl" TEXT NOT NULL,

    CONSTRAINT "Hike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PianoPiece" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "composer" TEXT NOT NULL,
    "status" "PianoPieceStatus" NOT NULL,
    "sheetMusicUrl" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "monthLearned" TIMESTAMP(3),

    CONSTRAINT "PianoPiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteCategory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "NoteCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL,
    "dateModified" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "workContent" TEXT NOT NULL,

    CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoGameExtraPurchase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "videoGameId" INTEGER NOT NULL,

    CONSTRAINT "VideoGameExtraPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoGame" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "type" "VideoGameType" NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "firstPlayed" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,

    CONSTRAINT "VideoGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ExpensesCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensesCategoryKeyword" ADD CONSTRAINT "ExpensesCategoryKeyword_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ExpensesCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "NoteCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoGameExtraPurchase" ADD CONSTRAINT "VideoGameExtraPurchase_videoGameId_fkey" FOREIGN KEY ("videoGameId") REFERENCES "VideoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
