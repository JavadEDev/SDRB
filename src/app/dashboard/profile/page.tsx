"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Edit, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Modal, FormModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
  });
  const [saving, setSaving] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [personalInfoForm, setPersonalInfoForm] = useState<any>({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  });
  const [addressForm, setAddressForm] = useState<any>({
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated" && session?.user) {
      const userData = session.user as any;
      setUser({
        id: userData.id,
        email: userData.email,
        imageUrl: userData.imageUrl || null,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        country: userData.country || "",
        cityState: userData.cityState || "",
        postalCode: userData.postalCode || "",
        taxId: userData.taxId || "",
      });
      setForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        country: userData.country || "",
        cityState: userData.cityState || "",
        postalCode: userData.postalCode || "",
        taxId: userData.taxId || "",
      });
      setPersonalInfoForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
      });
      setAddressForm({
        country: userData.country || "",
        cityState: userData.cityState || "",
        postalCode: userData.postalCode || "",
        taxId: userData.taxId || "",
      });
      const fullName =
        userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : "";
      setProfileName(fullName);
      setProfileImageUrl(userData.imageUrl || null);
      setPreviewUrl(userData.imageUrl || null);
    }
  }, [session, status, router]);

  const handleUpdate = async () => {
    await update();
    router.refresh();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

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
      setProfileImageUrl(data.url);
      setPreviewUrl(data.url);

      // Update imageUrl only, don't change name
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.url }),
      });

      await handleUpdate();
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setPreviewUrl(profileImageUrl);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = () => {
    setProfileImageUrl(null);
    setPreviewUrl(null);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: profileImageUrl,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      await handleUpdate();
      setUser((prev: any) => ({
        ...prev,
        imageUrl: profileImageUrl,
      }));
      setEditProfile(false);
      toast.success("Profile picture updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const savePersonalInfo = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalInfoForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      await handleUpdate();
      setUser((prev: any) => ({
        ...prev,
        firstName: personalInfoForm.firstName,
        lastName: personalInfoForm.lastName,
        phone: personalInfoForm.phone,
        bio: personalInfoForm.bio,
      }));
      setEditPersonalInfo(false);
      toast.success("Personal information updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      await handleUpdate();
      setUser((prev: any) => ({
        ...prev,
        country: addressForm.country,
        cityState: addressForm.cityState,
        postalCode: addressForm.postalCode,
        taxId: addressForm.taxId,
      }));
      setEditAddress(false);
      toast.success("Address updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[var(--muted-text)]" />
      </div>
    );
  }

  const getInitials = (
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "User";
  const displayRole = user.bio || "";
  const displayLocation = user.cityState || user.country || "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--card-text)]">
        Profile
      </h1>

      {/* Card 1: User Profile Summary */}
      <div className="rounded-[calc(var(--radius)*2)] border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {user.imageUrl ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--input-border)]">
                {user.imageUrl.startsWith("/") ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={user.imageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center font-semibold text-xl border-2 border-[var(--input-border)]">
                {getInitials(user.firstName, user.lastName, user.email)}
              </div>
            )}
          </div>

          {/* Name and Details */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--card-text)] mb-1">
              {displayName}
            </h2>
          </div>

          {/* Edit Button */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--input-border)] hover:bg-[var(--muted-bg)] transition-colors text-sm font-medium"
              onClick={() => {
                const fullName =
                  user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.lastName || "";
                setProfileName(fullName);
                setProfileImageUrl(user.imageUrl || null);
                setPreviewUrl(user.imageUrl || null);
                setEditProfile(true);
              }}
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Personal Information */}
      <div className="rounded-[calc(var(--radius)*2)] border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--card-text)]">
            Personal Information
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--input-border)] hover:bg-[var(--muted-bg)] transition-colors text-sm font-medium"
            onClick={() => {
              setPersonalInfoForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                bio: user.bio || "",
              });
              setEditPersonalInfo(true);
            }}
          >
            <Edit size={16} />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              First Name
            </label>
            <p className="text-[var(--card-text)]">{user.firstName || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Last Name
            </label>
            <p className="text-[var(--card-text)]">{user.lastName || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Email address
            </label>
            <p className="text-[var(--card-text)]">{user.email || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Phone
            </label>
            <p className="text-[var(--card-text)]">{user.phone || "-"}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Bio
            </label>
            <p className="text-[var(--card-text)]">{user.bio || "-"}</p>
          </div>
        </div>
      </div>

      {/* Card 3: Address */}
      <div className="rounded-[calc(var(--radius)*2)] border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--card-text)]">
            Address
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--input-border)] hover:bg-[var(--muted-bg)] transition-colors text-sm font-medium"
            onClick={() => {
              setAddressForm({
                country: user.country || "",
                cityState: user.cityState || "",
                postalCode: user.postalCode || "",
                taxId: user.taxId || "",
              });
              setEditAddress(true);
            }}
          >
            <Edit size={16} />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Country
            </label>
            <p className="text-[var(--card-text)]">{user.country || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              City/State
            </label>
            <p className="text-[var(--card-text)]">{user.cityState || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Postal Code
            </label>
            <p className="text-[var(--card-text)]">{user.postalCode || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              TAX ID
            </label>
            <p className="text-[var(--card-text)]">{user.taxId || "-"}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Summary Modal - Using new Modal component */}
      <Modal
        open={editProfile}
        onOpenChange={setEditProfile}
        title="Edit Profile Picture"
        description="Update your profile picture to keep your profile up-to-date."
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditProfile(false)}
              disabled={saving}
            >
              Close
            </Button>
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        }
      >
        <div className="flex justify-center items-center py-6">
          <div className="relative">
            {previewUrl ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--input-border)]">
                {previewUrl.startsWith("/") ? (
                  <img
                    src={previewUrl}
                    alt={displayName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt={displayName || "Profile"}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center font-semibold text-3xl border-2 border-[var(--input-border)]">
                {getInitials(user.firstName, user.lastName, user.email)}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-10 h-10 rounded-full bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                aria-label="Upload image"
              >
                {isUploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
              </button>
              {previewUrl && (
                <button
                  onClick={handleDeleteImage}
                  className="w-10 h-10 rounded-full bg-[var(--action-destructive-bg)] text-[var(--action-destructive-text)] flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                  aria-label="Delete image"
                >
                  <X size={18} />
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
        </div>
      </Modal>

      {/* Edit Personal Information Modal - Using FormModal component */}
      <FormModal
        open={editPersonalInfo}
        onOpenChange={setEditPersonalInfo}
        title="Edit Personal Information"
        description="Update your details to keep your profile up-to-date."
        size="2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          await savePersonalInfo();
        }}
        submitText="Save Changes"
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              value={personalInfoForm.firstName}
              onChange={(e) =>
                setPersonalInfoForm({
                  ...personalInfoForm,
                  firstName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={personalInfoForm.lastName}
              onChange={(e) =>
                setPersonalInfoForm({
                  ...personalInfoForm,
                  lastName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--muted-bg)] text-[var(--muted-text)] opacity-70 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={personalInfoForm.phone}
              onChange={(e) =>
                setPersonalInfoForm({
                  ...personalInfoForm,
                  phone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              rows={3}
              value={personalInfoForm.bio}
              onChange={(e) =>
                setPersonalInfoForm({
                  ...personalInfoForm,
                  bio: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Address Modal - Using FormModal component */}
      <FormModal
        open={editAddress}
        onOpenChange={setEditAddress}
        title="Edit Address"
        description="Update your details to keep your profile up-to-date."
        size="2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveAddress();
        }}
        submitText="Save Changes"
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={addressForm.country}
              onChange={(e) =>
                setAddressForm({ ...addressForm, country: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City/State</label>
            <input
              type="text"
              value={addressForm.cityState}
              onChange={(e) =>
                setAddressForm({ ...addressForm, cityState: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={addressForm.postalCode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, postalCode: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">TAX ID</label>
            <input
              type="text"
              value={addressForm.taxId}
              onChange={(e) =>
                setAddressForm({ ...addressForm, taxId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-[var(--radius)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
