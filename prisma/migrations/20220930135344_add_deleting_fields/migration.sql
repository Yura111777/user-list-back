-- DropForeignKey
ALTER TABLE "Positions" DROP CONSTRAINT "Positions_userId_fkey";

-- AddForeignKey
ALTER TABLE "Positions" ADD CONSTRAINT "Positions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
