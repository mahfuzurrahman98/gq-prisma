/*
  Warnings:

  - Added the required column `profile_image` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `profile_image` VARCHAR(191) NOT NULL;
