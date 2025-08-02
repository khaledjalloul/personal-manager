/*
  Warnings:

  - You are about to drop the column `subEntries` on the `JournalEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "subEntries";

-- CreateTable
CREATE TABLE "JournalSubEntry" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "JournalSubEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalSubEntry" ADD CONSTRAINT "JournalSubEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
