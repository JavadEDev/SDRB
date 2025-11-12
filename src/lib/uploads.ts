import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DEFAULT_SUBDIR_SEGMENTS = ["uploads"];
const LEGACY_UPLOAD_DIR = path.join(PUBLIC_DIR, ...DEFAULT_SUBDIR_SEGMENTS);

type SaveImageOptions = {
  userId?: string | null;
};

function sanitizePathSegment(segment: string) {
  return segment.replace(/[^a-zA-Z0-9_-]/g, "");
}

async function resolveUploadTarget(options?: SaveImageOptions) {
  const segments = [...DEFAULT_SUBDIR_SEGMENTS];

  if (options?.userId) {
    const safeUserId = sanitizePathSegment(options.userId);
    if (safeUserId) {
      segments.splice(0, segments.length, "users", safeUserId);
    }
  }

  const directoryPath = path.join(PUBLIC_DIR, ...segments);
  await fs.mkdir(directoryPath, { recursive: true });

  const publicPath = `/${segments.join("/")}`;
  return { directoryPath, publicPath };
}

export async function ensureUploadDir() {
  await resolveUploadTarget();
}

export async function saveImageFile(file: File, options?: SaveImageOptions) {
  if (!(file instanceof File)) {
    throw new Error("Invalid file payload");
  }

  if (file.size === 0) {
    throw new Error("File is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum size of 5MB");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  const { directoryPath, publicPath } = await resolveUploadTarget(options);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension = mimeTypeToExtension(file.type);
  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(directoryPath, filename);

  await fs.writeFile(filepath, buffer);

  // Maintain legacy copy in /uploads so existing URLs keep working
  await fs.mkdir(LEGACY_UPLOAD_DIR, { recursive: true });
  const legacyPath = path.join(LEGACY_UPLOAD_DIR, filename);
  await fs.writeFile(legacyPath, buffer);

  return {
    filename,
    url: `${publicPath}/${filename}`,
    directory: publicPath,
    legacyUrl: `/uploads/${filename}`,
    size: file.size,
    type: file.type,
  };
}

function mimeTypeToExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}
