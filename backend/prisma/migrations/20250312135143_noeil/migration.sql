-- AlterTable
ALTER TABLE `question` ADD COLUMN `correctAnswerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_correctAnswerId_fkey` FOREIGN KEY (`correctAnswerId`) REFERENCES `Choice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
