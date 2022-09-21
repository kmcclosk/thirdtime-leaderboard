/*
  Warnings:

  - You are about to drop the column `name` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `pic` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamerName` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePic` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gamerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "profilePic" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Entry_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("id", "rank", "score") SELECT "id", "rank", "score" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
