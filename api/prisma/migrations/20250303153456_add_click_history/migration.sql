-- CreateTable
CREATE TABLE "video_click_history" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_click_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_click_history_video_id_key" ON "video_click_history"("video_id");

-- AddForeignKey
ALTER TABLE "video_click_history" ADD CONSTRAINT "video_click_history_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
