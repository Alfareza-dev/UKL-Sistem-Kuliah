/*
  Warnings:

  - You are about to drop the column `id_dosen` on the `Penjadwalan` table. All the data in the column will be lost.
  - You are about to drop the column `id_matakuliah` on the `Penjadwalan` table. All the data in the column will be lost.
  - Added the required column `dosen_nidn` to the `Penjadwalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matakuliah_id` to the `Penjadwalan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Penjadwalan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jadwal" TEXT NOT NULL,
    "tahun_ajaran" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "dosen_nidn" INTEGER NOT NULL,
    "matakuliah_id" INTEGER NOT NULL,
    CONSTRAINT "Penjadwalan_dosen_nidn_fkey" FOREIGN KEY ("dosen_nidn") REFERENCES "Dosen" ("nidn") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Penjadwalan_matakuliah_id_fkey" FOREIGN KEY ("matakuliah_id") REFERENCES "Matakuliah" ("id_matakuliah") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Penjadwalan" ("id", "jadwal", "semester", "tahun_ajaran") SELECT "id", "jadwal", "semester", "tahun_ajaran" FROM "Penjadwalan";
DROP TABLE "Penjadwalan";
ALTER TABLE "new_Penjadwalan" RENAME TO "Penjadwalan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
