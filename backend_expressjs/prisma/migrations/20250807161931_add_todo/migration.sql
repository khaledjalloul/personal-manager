-- CreateEnum
CREATE TYPE "ToDoTaskStatus" AS ENUM ('Pending', 'Completed', 'NotCompleted');

-- CreateTable
CREATE TABLE "ToDoMilestone" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ToDoMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToDoTask" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "milestoneId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ToDoTaskStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "ToDoTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToDoMilestone" ADD CONSTRAINT "ToDoMilestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDoTask" ADD CONSTRAINT "ToDoTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDoTask" ADD CONSTRAINT "ToDoTask_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "ToDoMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
