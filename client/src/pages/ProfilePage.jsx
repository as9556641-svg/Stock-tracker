import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const { logout, updateUser, user } = useAuth();
  const { addToast } = useNotifications();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/profile");
        setProfile({
          name: response.data.name || "",
          email: response.data.email || ""
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await api.put("/auth/profile", profile);
      updateUser({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email
      });
      addToast("Profile updated");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to update profile.";
      setError(message);
      addToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    addToast("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Navbar onLogout={handleLogout} user={user} />
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Logout"
        isOpen={isLogoutModalOpen}
        message="Are you sure you want to logout?"
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm logout"
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="panel p-8 dark:border-slate-800/80 dark:bg-slate-900/85">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Profile</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">
            Your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Update your personal details without changing the existing authentication flow.
          </p>

          {loading ? (
            <div className="mt-10">
              <LoadingSpinner label="Loading profile..." />
            </div>
          ) : (
            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              {error ? <Alert message={error} /> : null}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Full Name
                </span>
                <input
                  className="input"
                  name="name"
                  onChange={handleChange}
                  required
                  value={profile.name}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email Address
                </span>
                <input
                  className="input"
                  name="email"
                  onChange={handleChange}
                  required
                  type="email"
                  value={profile.email}
                />
              </label>

              <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Signed in as <span className="font-semibold text-slate-800 dark:text-white">{user?.name}</span>
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  JWT auth and API flow remain unchanged. Only your profile details are updated.
                </p>
              </div>

              <button className="btn-primary w-full sm:w-auto" disabled={saving} type="submit">
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
