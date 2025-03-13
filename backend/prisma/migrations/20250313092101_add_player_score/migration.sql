-- AlterTable
ALTER TABLE `MatchmakingSession` ADD COLUMN `playerOneScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `playerTwoScore` INTEGER NOT NULL DEFAULT 0;
