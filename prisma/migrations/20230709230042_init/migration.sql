-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "academicNumber" TEXT,
    "isAdmin" BOOLEAN,
    "isDoctor" BOOLEAN,
    "isStudent" BOOLEAN,
    "departmentId" INTEGER,
    "Edit" BOOLEAN NOT NULL DEFAULT true,
    "registered" INTEGER DEFAULT 0,
    "succeeded" INTEGER DEFAULT 0,
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stateOFsub" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "degree" REAL DEFAULT 0,
    "name" TEXT,
    "state" TEXT,
    "user_Id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    CONSTRAINT "stateOFsub_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stateOFsub_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "departmentId" INTEGER,
    "userId" INTEGER,
    "dependencies" TEXT DEFAULT '',
    "state" TEXT,
    CONSTRAINT "Subject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "state" TEXT
);

-- CreateTable
CREATE TABLE "Files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Url" TEXT,
    "SubjectId" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Files_SubjectId_fkey" FOREIGN KEY ("SubjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
