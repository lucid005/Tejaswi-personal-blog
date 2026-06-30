import { createClient } from "@supabase/supabase-js";

const COVER_BUCKET = "blog-images";
const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_COVER_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function getStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function cleanPathPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureCoverBucket() {
  const supabase = getStorageClient();
  const { data: bucket } = await supabase.storage.getBucket(COVER_BUCKET);

  if (bucket) {
    if (!bucket.public) {
      await supabase.storage.updateBucket(COVER_BUCKET, {
        public: true,
      });
    }

    return supabase;
  }

  const { error } = await supabase.storage.createBucket(COVER_BUCKET, {
    public: true,
    fileSizeLimit: MAX_COVER_IMAGE_SIZE,
    allowedMimeTypes: Array.from(ACCEPTED_COVER_TYPES.keys()),
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(`Could not create storage bucket: ${error.message}`);
  }

  return supabase;
}

export async function uploadCoverImage(file: File | null, postSlug: string) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.size > MAX_COVER_IMAGE_SIZE) {
    throw new Error("Cover image must be 5MB or smaller.");
  }

  const extension = ACCEPTED_COVER_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Cover image must be a JPG, PNG, or WebP file.");
  }

  const supabase = await ensureCoverBucket();
  const safeSlug = cleanPathPart(postSlug) || "post";
  const safeName = cleanPathPart(file.name.replace(/\.[^.]+$/, "")) || "cover";
  const path = `covers/${safeSlug}/${Date.now()}-${safeName}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, bytes, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Cover image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

export const coverImageUploadRules = {
  accept: Array.from(ACCEPTED_COVER_TYPES.keys()).join(","),
  maxSizeLabel: "5MB",
};
