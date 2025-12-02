/*
  Warnings:

  - You are about to drop the column `id_dosen` on the `Matakuliah` table. All the data in the column will be lost.
  - Added the required column `dosen_nidn` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Matakuliah" (
    "id_matakuliah" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_matakuliah" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "dosen_nidn" INTEGER NOT NULL,
    CONSTRAINT "Matakuliah_dosen_nidn_fkey" FOREIGN KEY ("dosen_nidn") REFERENCES "Dosen" ("nidn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Matakuliah" ("id_matakuliah", "nama_matakuliah", "sks") SELECT "id_matakuliah", "nama_matakuliah", "sks" FROM "Matakuliah";
DROP TABLE "Matakuliah";
ALTER TABLE "new_Matakuliah" RENAME TO "Matakuliah";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
