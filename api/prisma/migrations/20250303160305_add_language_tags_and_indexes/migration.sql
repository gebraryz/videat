-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "language" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateIndex
CREATE INDEX "videos_title_idx" ON "videos"("title");

-- CreateIndex
CREATE INDEX "videos_tags_idx" ON "videos" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "videos_created_at_idx" ON "videos"("created_at");
