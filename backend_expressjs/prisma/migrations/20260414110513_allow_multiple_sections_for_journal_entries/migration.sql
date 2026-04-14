-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_sectionId_fkey";

-- CreateTable
CREATE TABLE "_JournalEntryToJournalSection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JournalEntryToJournalSection_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JournalEntryToJournalSection_B_index" ON "_JournalEntryToJournalSection"("B");

-- AddForeignKey
ALTER TABLE "_JournalEntryToJournalSection" ADD CONSTRAINT "_JournalEntryToJournalSection_A_fkey" FOREIGN KEY ("A") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalEntryToJournalSection" ADD CONSTRAINT "_JournalEntryToJournalSection_B_fkey" FOREIGN KEY ("B") REFERENCES "JournalSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
