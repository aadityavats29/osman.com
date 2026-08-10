import type {
  EventRecord,
  LiveVideoRecord,
  MediaItemRecord,
  ProductRecord,
  ReleaseRecord,
  ServiceRecord,
  SiteSettings,
  UserRecord,
} from "@/lib/types";

/**
 * Persistence boundary. The UI and server actions depend on these interfaces only;
 * implementations are `demo` (in-memory + optional JSON snapshot, used when
 * DATABASE_URL is absent) and `prisma` (PostgreSQL).
 */

export interface CollectionRepo<T extends { id: string; slug: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  getBySlug(slug: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt"> & Partial<Pick<T, "id">>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, "id">>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface UserRepo {
  findByEmail(email: string): Promise<UserRecord | null>;
}

export interface SettingsRepo {
  get(): Promise<SiteSettings>;
  set(settings: SiteSettings): Promise<SiteSettings>;
}

export interface Repos {
  events: CollectionRepo<EventRecord>;
  videos: CollectionRepo<LiveVideoRecord>;
  releases: CollectionRepo<ReleaseRecord>;
  media: CollectionRepo<MediaItemRecord>;
  services: CollectionRepo<ServiceRecord>;
  products: CollectionRepo<ProductRecord>;
  users: UserRepo;
  settings: SettingsRepo;
  /** "demo" or "postgres" — surfaced in the Studio so Osman's team knows which mode is live. */
  backend: "demo" | "postgres";
}
