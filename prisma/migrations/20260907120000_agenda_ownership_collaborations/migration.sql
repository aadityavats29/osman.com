-- Precision pack 2026-09-07: agenda event fields, release ownership context,
-- collaborations with verification/rights states. Additive only.

-- New EventType values (PG12+: allowed in a transaction while unused in it)
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'FESTIVAL';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'PRIVATE_EVENT';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'OTHER';

-- CreateEnum
CREATE TYPE "TicketingType" AS ENUM ('TICKETED', 'FREE', 'INFO_ONLY', 'NONE');
CREATE TYPE "RelationshipType" AS ENUM ('OWN_RELEASE', 'CONTRIBUTING_ARTIST', 'COLLABORATION_RELEASE');
CREATE TYPE "RightsStatus" AS ENUM ('VERIFIED', 'PENDING', 'DO_NOT_PUBLISH');
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING', 'REJECTED');

-- AlterTable Event
ALTER TABLE "Event"
  ADD COLUMN "imageAlt" TEXT,
  ADD COLUMN "imageCredit" TEXT,
  ADD COLUMN "ticketingType" "TicketingType",
  ADD COLUMN "ctaLabel" TEXT,
  ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable Release
ALTER TABLE "Release"
  ADD COLUMN "relationshipType" "RelationshipType" NOT NULL DEFAULT 'OWN_RELEASE',
  ADD COLUMN "primaryArtistName" TEXT,
  ADD COLUMN "osmanCredit" TEXT,
  ADD COLUMN "labelName" TEXT,
  ADD COLUMN "catalogNumber" TEXT,
  ADD COLUMN "artworkCredit" TEXT,
  ADD COLUMN "rightsStatus" "RightsStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "sourceUrl" TEXT,
  ADD COLUMN "collaborationSlug" TEXT;

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT,
    "heroImageCredit" TEXT,
    "heroImageRights" "RightsStatus" NOT NULL DEFAULT 'PENDING',
    "collaborators" TEXT,
    "externalUrl" TEXT,
    "memorialTitle" TEXT,
    "memorialName" TEXT,
    "memorialYears" TEXT,
    "memorialText" TEXT,
    "showMemorial" BOOLEAN NOT NULL DEFAULT false,
    "publicCulturalNote" TEXT,
    "culturalNoteStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaboration_slug_key" ON "Collaboration"("slug");
CREATE INDEX "Collaboration_status_sortOrder_idx" ON "Collaboration"("status", "sortOrder");
