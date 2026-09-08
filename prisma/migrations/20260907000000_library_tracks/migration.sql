-- Music Library (Keynote 02-09-2026): original tracks ready to license,
-- managed from the Studio. Additive only — no existing data is touched.

-- CreateTable
CREATE TABLE "LibraryTrack" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT,
    "moods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "useCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "durationSec" INTEGER,
    "audioUrl" TEXT,
    "description" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LibraryTrack_slug_key" ON "LibraryTrack"("slug");

-- CreateIndex
CREATE INDEX "LibraryTrack_status_sortOrder_idx" ON "LibraryTrack"("status", "sortOrder");
