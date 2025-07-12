-- CreateTable
CREATE TABLE "JoinsGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JoinsGroup_userId_groupId_key" ON "JoinsGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "JoinsGroup" ADD CONSTRAINT "JoinsGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinsGroup" ADD CONSTRAINT "JoinsGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
