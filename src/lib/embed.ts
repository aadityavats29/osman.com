/** Video URL helpers for YouTube/Vimeo embeds (privacy-friendly, click-to-load). */

export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
  );
  return m ? m[1] : null;
}

export function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/);
  return m ? m[1] : null;
}

export function embedUrl(platform: "youtube" | "vimeo", videoUrl: string): string | null {
  if (platform === "youtube") {
    const id = youtubeId(videoUrl);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  const id = vimeoId(videoUrl);
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
}

/** Best-available static thumbnail without an API call (YouTube only). */
export function fallbackThumbnail(platform: "youtube" | "vimeo", videoUrl: string): string | null {
  if (platform === "youtube") {
    const id = youtubeId(videoUrl);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}
