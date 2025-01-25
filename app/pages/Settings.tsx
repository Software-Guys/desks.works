import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../app/auth/login";
import { MainNav } from "../components/main-nav";

interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string;
}

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  async function fetchProfile() {
    try {
      const response = await fetch(`${baseUrl}/profile/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        type: "error",
        text: error.message.includes("Failed to fetch")
          ? "Network error. Please try again later."
          : "Failed to load profile.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (!profile.username.trim()) {
      setMessage({ type: "error", text: "Username cannot be empty" });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...profile,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message.includes("Failed to fetch")
          ? "Network error. Please try again later."
          : "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <>
        <MainNav />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded-md"></div>
            <div className="h-6 bg-gray-300 rounded-md"></div>
            <div className="h-6 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Settings</h1>

          {message.text && (
            <div
              className={`mb-4 p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={updateProfile} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
                aria-label="Username Input"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium mb-2"
                aria-label="Bio Input"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>

            <div>
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium mb-2"
                aria-label="Avatar URL Input"
              >
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={profile.avatarUrl}
                onChange={(e) =>
                  setProfile({ ...profile, avatarUrl: e.target.value })
                }
                className="w-full p-2 rounded-md border border-input bg-background"
              />
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full mt-2"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
