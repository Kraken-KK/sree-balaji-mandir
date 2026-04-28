// Helper utilities for detecting and rendering embedded media (YouTube, Google Drive)
// in the gallery alongside regular images.

export type MediaKind = 'image' | 'video' | 'youtube' | 'gdrive';

export interface MediaInfo {
  kind: MediaKind;
  /** URL suitable for <img>, <video>, or <iframe> src */
  src: string;
  /** Optional thumbnail URL (used in grid view) */
  thumbnail?: string;
  /** Original URL */
  original: string;
}

const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;

const GDRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]{10,})/i;
const GDRIVE_OPEN_RE = /drive\.google\.com\/open\?id=([A-Za-z0-9_-]{10,})/i;
const GDRIVE_UC_RE = /drive\.google\.com\/uc\?(?:.*&)?id=([A-Za-z0-9_-]{10,})/i;

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|avif|svg|bmp|heic)(\?.*)?$/i;

export function detectMedia(url: string): MediaInfo {
  const trimmed = (url || '').trim();

  // YouTube
  const yt = trimmed.match(YOUTUBE_RE);
  if (yt) {
    const id = yt[1];
    return {
      kind: 'youtube',
      src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      original: trimmed,
    };
  }

  // Google Drive
  const gd =
    trimmed.match(GDRIVE_FILE_RE) ||
    trimmed.match(GDRIVE_OPEN_RE) ||
    trimmed.match(GDRIVE_UC_RE);
  if (gd) {
    const id = gd[1];
    return {
      kind: 'gdrive',
      src: `https://drive.google.com/file/d/${id}/preview`,
      thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
      original: trimmed,
    };
  }

  // Direct video file
  if (VIDEO_EXT_RE.test(trimmed)) {
    return { kind: 'video', src: trimmed, thumbnail: trimmed, original: trimmed };
  }

  // Default → image
  return { kind: 'image', src: trimmed, thumbnail: trimmed, original: trimmed };
}

export const isEmbedMedia = (kind: MediaKind) =>
  kind === 'youtube' || kind === 'gdrive';
