import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getAdminProfile, getAdminSettings, updateAdminProfile, updateAdminSettings, createAdmin, updateAdminPassword, AdminProfile, AdminSettings as IAdminSettings } from "@/services/admin";
import { getWebAuthnDevices, deleteWebAuthnDevice } from "@/services/auth";
import { toast } from "sonner";
import { Loader2, UserPlus, Settings as SettingsIcon, Bell, Monitor, Lock, Fingerprint, Trash2, ShieldCheck } from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [settings, setSettings] = useState<IAdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [newAdmin, setNewAdmin] = useState({ fullName: "", email: "", password: "" });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [devices, setDevices] = useState<any[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, settingsData] = await Promise.all([
        getAdminProfile(),
        getAdminSettings()
      ]);
      setProfile(profileData);
      setSettings(settingsData);
      fetchDevices();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      setDevicesLoading(true);
      const data = await getWebAuthnDevices();
      setDevices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleDeleteDevice = async (credentialId: string) => {
    if (!confirm("Are you sure you want to remove this biometric device?")) return;
    try {
      await deleteWebAuthnDevice(credentialId);
      toast.success("Device removed");
      fetchDevices();
    } catch (error) {
      toast.error("Failed to remove device");
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSavingProfile(true);
      await updateAdminProfile({
        fullName: profile.fullName,
        email: profile.email
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in current and new passwords");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setUpdatingPassword(true);
      await updateAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSettingToggle = async (key: keyof IAdminSettings, value: boolean) => {
    if (!settings) return;
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await updateAdminSettings({ [key]: value });
      toast.success("Settings updated");
    } catch (error: any) {
      toast.error("Failed to update settings");
      setSettings(settings); // Revert
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setCreatingAdmin(true);
      await createAdmin(newAdmin);
      toast.success("New admin created successfully");
      setNewAdmin({ fullName: "", email: "", password: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin");
    } finally {
      setCreatingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your admin panel preferences and security</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-md">
          <form onSubmit={handleProfileSave}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <CardTitle>Account Details</CardTitle>
              </div>
              <CardDescription>Update your email and full name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input
                  id="admin-name"
                  value={profile?.fullName || ''}
                  onChange={(e) => setProfile(p => p ? { ...p, fullName: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={profile?.email || ''}
                  onChange={(e) => setProfile(p => p ? { ...p, email: e.target.value } : null)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Profile Changes"}
              </Button>
            </CardContent>
          </form>
        </Card>

        <Card className="shadow-md">
          <form onSubmit={handleChangePassword}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Change your login password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="curr-pw">Current Password</Label>
                <Input
                  id="curr-pw"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <Input
                    id="new-pw"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf-pw">Confirm</Label>
                  <Input
                    id="conf-pw"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={updatingPassword}
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Event-based alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User registrations</Label>
                <p className="text-sm text-muted-foreground">Alert on new agent signups</p>
              </div>
              <Switch
                checked={settings?.notifyOnNewUser || false}
                onCheckedChange={(val) => handleSettingToggle('notifyOnNewUser', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transfer Requests</Label>
                <p className="text-sm text-muted-foreground">Alert on interest submissions</p>
              </div>
              <Switch
                checked={settings?.notifyOnTransferRequest || false}
                onCheckedChange={(val) => handleSettingToggle('notifyOnTransferRequest', val)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              <CardTitle>System Preferences</CardTitle>
            </div>
            <CardDescription>Global behaviors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve verified agents</Label>
                <p className="text-sm text-muted-foreground">Skip manual review</p>
              </div>
              <Switch
                checked={settings?.autoApproveVerifiedAgents || false}
                onCheckedChange={(val) => handleSettingToggle('autoApproveVerifiedAgents', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications</Label>
                <p className="text-sm text-muted-foreground">Auto-email agents</p>
              </div>
              <Switch
                checked={settings?.sendEmailNotifications || false}
                onCheckedChange={(val) => handleSettingToggle('sendEmailNotifications', val)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              <CardTitle>Biometric Devices</CardTitle>
            </div>
            <CardDescription>Manage registered WebAuthn / Passkey devices</CardDescription>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="py-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : devices.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                No biometric devices registered.
              </div>
            ) : (
              <div className="space-y-3">
                {devices.map((device, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg group hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{device.name || `Device ${i + 1}`}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{new Date(device.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteDevice(device.credentialId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-4 text-center">
              You can register new devices during login if your browser supports WebAuthn.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-primary/10">
        <form onSubmit={handleCreateAdmin}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <CardTitle>Create New Administrator</CardTitle>
            </div>
            <CardDescription>Grant full access to a new admin user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name</Label>
                <Input
                  id="new-name"
                  placeholder="John Doe"
                  value={newAdmin.fullName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="john@alfa.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Initial Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="mt-2"
              disabled={creatingAdmin}
            >
              {creatingAdmin ? "Creating..." : "Create Admin Account"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
