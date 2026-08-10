/**
 * Seeds a PostgreSQL database with the same verified content the demo backend uses,
 * plus the owner account.
 *
 * Usage:
 *   DATABASE_URL=... STUDIO_EMAIL=... STUDIO_PASSWORD=... npx prisma db seed
 *
 * The owner password is read from STUDIO_PASSWORD (plain text, seed-time only),
 * hashed with bcrypt and never stored in code. Demo events are clearly labelled
 * "[DEMO]" — delete them from the Studio before launch, or seed without them by
 * setting SEED_DEMO_EVENTS=false.
 */
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  demoEvents,
  demoMedia,
  demoProducts,
  demoReleases,
  demoServices,
  demoSettings,
  demoVideos,
} from "../src/data/demo/content";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required to seed");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  const email = process.env.STUDIO_EMAIL;
  const password = process.env.STUDIO_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set STUDIO_EMAIL and STUDIO_PASSWORD in the environment to create the owner account (they are not stored in code)."
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase(),
      name: "Osman Meyredi",
      passwordHash,
      role: "OWNER",
    },
  });

  for (const s of demoServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        id: s.id,
        slug: s.slug,
        serviceType: s.serviceType,
        title: s.title,
        shortDescription: s.shortDescription,
        body: s.body,
        imageUrl: s.imageUrl,
        status: s.status,
        sortOrder: s.sortOrder,
      },
    });
  }

  for (const v of demoVideos) {
    await prisma.liveVideo.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        id: v.id,
        slug: v.slug,
        title: v.title,
        description: v.description,
        platform: v.platform,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        venue: v.venue,
        performanceDate: v.performanceDate ? new Date(v.performanceDate) : null,
        year: v.year,
        tags: v.tags,
        status: v.status,
        featured: v.featured,
        sortOrder: v.sortOrder,
      },
    });
  }

  for (const r of demoReleases) {
    await prisma.release.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        id: r.id,
        slug: r.slug,
        title: r.title,
        releaseType: r.releaseType,
        artworkUrl: r.artworkUrl,
        releaseDate: r.releaseDate ? new Date(r.releaseDate) : null,
        year: r.year,
        description: r.description,
        credits: r.credits,
        spotifyUrl: r.spotifyUrl,
        appleMusicUrl: r.appleMusicUrl,
        youtubeUrl: r.youtubeUrl,
        bandcampUrl: r.bandcampUrl,
        otherUrl: r.otherUrl,
        status: r.status,
        featured: r.featured,
        sortOrder: r.sortOrder,
      },
    });
  }

  for (const m of demoMedia) {
    await prisma.mediaItem.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        id: m.id,
        slug: m.slug,
        publication: m.publication,
        headline: m.headline,
        mediaType: m.mediaType,
        date: m.date ? new Date(m.date) : null,
        articleUrl: m.articleUrl,
        imageUrl: m.imageUrl,
        summary: m.summary,
        status: m.status,
        featured: m.featured,
      },
    });
  }

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        category: p.category,
        priceText: p.priceText,
        status: p.status,
        externalCommerceId: p.externalCommerceId,
        externalUrl: p.externalUrl,
        featured: p.featured,
        sortOrder: p.sortOrder,
      },
    });
  }

  if (process.env.SEED_DEMO_EVENTS !== "false") {
    for (const e of demoEvents) {
      await prisma.event.upsert({
        where: { slug: e.slug },
        update: {},
        create: {
          id: e.id,
          slug: e.slug,
          eventType: e.eventType,
          title: e.title,
          description: e.description,
          date: new Date(`${e.date}T00:00:00.000Z`),
          startTime: e.startTime,
          endTime: e.endTime,
          venue: e.venue,
          address: e.address,
          city: e.city,
          country: e.country,
          imageUrl: e.imageUrl,
          ticketUrl: e.ticketUrl,
          venueUrl: e.venueUrl,
          priceText: e.priceText,
          collaborators: e.collaborators,
          status: e.status,
          eventState: e.eventState,
          featured: e.featured,
          publishedAt: e.publishedAt ? new Date(e.publishedAt) : null,
        },
      });
    }
  }

  const settingsEntries = Object.entries(demoSettings).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  for (const [key, value] of settingsEntries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log("Seed complete.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
