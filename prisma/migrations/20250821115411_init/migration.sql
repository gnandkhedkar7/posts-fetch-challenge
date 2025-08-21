-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiUserId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userApiId" INTEGER NOT NULL,
    CONSTRAINT "Post_userApiId_fkey" FOREIGN KEY ("userApiId") REFERENCES "User" ("apiUserId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_apiUserId_key" ON "User"("apiUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_postId_key" ON "Post"("postId");

-- CreateIndex
CREATE INDEX "Post_userApiId_idx" ON "Post"("userApiId");
