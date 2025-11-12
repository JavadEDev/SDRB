"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileEditorProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    imageUrl?: string | null;
  };
  onUpdate: () => void;
}

export function ProfileEditor({ user, onUpdate }: ProfileEditorProps) {
  const { update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [imageUrl, setImageUrl] = useState(user.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when session/user updates (e.g., after Save Changes)
  // so we always display the newest imageUrl from the server/session.
  useEffect(() => {
    setImageUrl(user.imageUrl || null);
    setPreviewUrl(user.imageUrl || null);
  }, [user.imageUrl]);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
      setPreviewUrl(data.url);
      // Persist immediately so DB and session reflect the new image URL
      try {
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), imageUrl: data.url }),
        });
      } catch {}
      try {
        await update();
        router.refresh();
      } catch {}
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setPreviewUrl(imageUrl);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async () => {
    setImageUrl(null);
    setPreviewUrl(null);
    toast.success("Image removed");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.issues && Array.isArray(error.issues)) {
          const errorMessages = error.issues
            .map((issue: any) => issue.message)
            .join(", ");
          throw new Error(errorMessages || error.error || "Update failed");
        }
        throw new Error(error.error || "Update failed");
      }

      toast.success("Profile updated successfully");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    name !== (user.name || "") || imageUrl !== (user.imageUrl || null);

  return (
    <div className="space-y-6">
      <div className="rounded-[calc(var(--radius)*2)] border bg-[var(--card-bg)] p-8 shadow-sm">
        <h1 className="text-3xl font-serif font-normal mb-6 text-[var(--card-text)]">
          Profile
        </h1>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {previewUrl ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--input-border)]">
                  {previewUrl.startsWith("data:") ||
                  previewUrl.startsWith("/") ? (
                    <img
                      src={previewUrl}
                      alt={name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={previewUrl}
                      alt={name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center font-semibold text-2xl border-2 border-[var(--input-border)]">
                  {getInitials(name, user.email)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-8 h-8 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                  aria-label="Upload image"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                </button>
                {previewUrl && (
                  <button
                    onClick={handleDeleteImage}
                    className="w-8 h-8 rounded-full bg-[var(--action-destructive-bg)] text-[var(--action-destructive-text)] flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label="Delete image"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-[var(--muted-text)] mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-[var(--radius)] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium text-[var(--muted-text)] mb-2 block">
              Email
            </label>
            <p className="text-[var(--card-text)]">{user.email || "Not set"}</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
