/*
  Warnings:

  - You are about to drop the column `token` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Application" ("createdAt", "firstName", "id", "lastName", "name", "updatedAt") SELECT "createdAt", "firstName", "id", "lastName", "name", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
