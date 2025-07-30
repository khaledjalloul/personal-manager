-- DropForeignKey
ALTER TABLE "JournalSection" DROP CONSTRAINT "JournalSection_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "JournalSection" ADD CONSTRAINT "JournalSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JournalCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
