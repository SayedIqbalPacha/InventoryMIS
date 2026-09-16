import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Profile() {
  const { user, loading, updateMe, updateMyPassword } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleEditProfile() {
    clearMessages();

    setName(user?.name || "");
    setEmail(user?.email || "");

    setIsEditingProfile(true);
    setIsChangingPassword(false);
  }

  function handleCancelProfile() {
    clearMessages();

    setName(user?.name || "");
    setEmail(user?.email || "");

    setIsEditingProfile(false);
  }

  function handleOpenPasswordForm() {
    clearMessages();

    setCurrentPassword("");
    setPassword("");
    setPasswordConfirm("");

    setIsChangingPassword(true);
    setIsEditingProfile(false);
  }

  function handleCancelPassword() {
    clearMessages();

    setCurrentPassword("");
    setPassword("");
    setPasswordConfirm("");

    setIsChangingPassword(false);
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    clearMessages();

    if (!name.trim()) {
      setErrorMessage("Please provide your name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please provide your email.");
      return;
    }

    try {
      setProfileLoading(true);

      await updateMe({
        name: name.trim(),
        email: email.trim(),
      });

      setSuccessMessage("Your profile was updated successfully.");

      setIsEditingProfile(false);
    } catch (error) {
      setErrorMessage(error.message || "Unable to update your profile.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    clearMessages();

    if (!currentPassword) {
      setErrorMessage("Please provide your current password.");
      return;
    }

    if (!password) {
      setErrorMessage("Please provide a new password.");
      return;
    }

    if (!passwordConfirm) {
      setErrorMessage("Please confirm your new password.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("New passwords are not the same.");
      return;
    }

    if (currentPassword === password) {
      setErrorMessage(
        "The new password must be different from the current password.",
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await updateMyPassword({
        currentPassword,
        password,
        passwordConfirm,
      });

      setSuccessMessage("Password changed successfully.");

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
      setIsChangingPassword(false);
    } catch (error) {
      setErrorMessage(error.message || "Unable to change your password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No user profile found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>

          <CardDescription>
            Manage your personal information and password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {successMessage && (
            <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {!isEditingProfile && !isChangingPassword && (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>

                  <p className="break-words font-medium">{user.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>

                  <p className="break-all font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
                <Button type="button" onClick={handleEditProfile}>
                  Edit Profile
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenPasswordForm}
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}

          {isEditingProfile && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>

                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={profileLoading}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>

                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={profileLoading}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelProfile}
                  disabled={profileLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>

                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>

                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>

                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Changing Password..." : "Change Password"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={passwordLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
