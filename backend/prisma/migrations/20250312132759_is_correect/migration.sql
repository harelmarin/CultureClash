/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `Question` table. All the data in the column will be lost.
  - Added the required column `isCorrect` to the `Choice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Choice` ADD COLUMN `isCorrect` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `correctAnswer`;
