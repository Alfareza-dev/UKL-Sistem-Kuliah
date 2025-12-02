-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "mahasiswaId" INTEGER,
    CONSTRAINT "User_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dosen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nidn" INTEGER NOT NULL,
    "nama_dosen" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "alamat" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nim" TEXT NOT NULL,
    "nama_mahasiswa" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Matakuliah" (
    "id_matakuliah" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_matakuliah" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    CONSTRAINT "Matakuliah_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Penjadwalan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_dosen" INTEGER NOT NULL,
    "id_matakuliah" INTEGER NOT NULL,
    "jadwal" TEXT NOT NULL,
    "tahun_ajaran" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    CONSTRAINT "Penjadwalan_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Penjadwalan_id_matakuliah_fkey" FOREIGN KEY ("id_matakuliah") REFERENCES "Matakuliah" ("id_matakuliah") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Krs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mahasiswa_id" INTEGER NOT NULL,
    "matakuliah_id" INTEGER NOT NULL,
    CONSTRAINT "Krs_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "Mahasiswa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Krs_matakuliah_id_fkey" FOREIGN KEY ("matakuliah_id") REFERENCES "Matakuliah" ("id_matakuliah") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_mahasiswaId_key" ON "User"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_nidn_key" ON "Dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Krs_mahasiswa_id_matakuliah_id_key" ON "Krs"("mahasiswa_id", "matakuliah_id");
