import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";
import { Tenant } from "@/types";
import {
  Building,
  Users,
  Settings,
  Lock,
  Globe,
  Upload,
  Check,
} from "lucide-react";

export default function MultiTenantSettingsPanel() {
  const { currentTenant, updateTenant } = useTenant();
  const [isEditing, setIsEditing] = useState(false);
  const [tenantData, setTenantData] = useState<Partial<Tenant>>({
    name: currentTenant?.name || "",
    logo: currentTenant?.logo || "",
    primaryColor: currentTenant?.primaryColor || "#3b82f6",
    active: currentTenant?.active || true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!currentTenant?.id) return;

    setIsSaving(true);
    try {
      await updateTenant(currentTenant.id, tenantData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating tenant:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Mock data for users
  const mockUsers = [
    {
      id: "u1",
      name: "John Smith",
      email: "john@example.com",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "u3",
      name: "Mike Davis",
      email: "mike@example.com",
      role: "staff",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-tenant Settings</CardTitle>
        <CardDescription>
          Configure settings for your wholesale business tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Building className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Globe className="mr-2 h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tenant Information</h3>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Settings
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center justify-center p-6 border rounded-lg">
                  <Avatar className="h-24 w-24 mb-4" src={tenantData.logo} />
                  {isEditing && (
                    <div className="mt-2">
                      <Label
                        htmlFor="logo"
                        className="text-sm font-medium mb-2 block text-center"
                      >
                        Tenant Logo
                      </Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="md:w-2/3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tenant Name</Label>
                    <Input
                      id="name"
                      value={tenantData.name}
                      onChange={(e) =>
                        setTenantData({ ...tenantData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Brand Color</Label>
                    <div className="flex gap-4">
                      <Input
                        id="primaryColor"
                        type="color"
                        className="w-16 h-10"
                        value={tenantData.primaryColor}
                        onChange={(e) =>
                          setTenantData({
                            ...tenantData,
                            primaryColor: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                      <Input
                        value={tenantData.primaryColor}
                        onChange={(e) =>
                          setTenantData({
                            ...tenantData,
                            primaryColor: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={tenantData.active}
                      onCheckedChange={(checked) =>
                        setTenantData({ ...tenantData, active: checked })
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="active">Tenant Active</Label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Tenant Details</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Tenant ID</dt>
                    <dd className="font-medium">
                      {currentTenant?.id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="font-medium">May 10, 2023</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Subscription Plan</dt>
                    <dd className="font-medium">Professional</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Next Billing Date</dt>
                    <dd className="font-medium">June 10, 2023</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">User Management</h3>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>

            <div className="border rounded-lg divide-y">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10" src={user.avatar} />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={user.role === "admin" ? "default" : "outline"}
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "manager"
                          ? "Manager"
                          : "Staff"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-20" defaultValue="30" />
                    <span className="text-sm text-muted-foreground">
                      minutes
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Password Policy</p>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Security Audit Log</h4>
                <div className="space-y-2">
                  {[
                    {
                      event: "User Login",
                      user: "John Smith",
                      time: "Today, 10:45 AM",
                      ip: "192.168.1.1",
                    },
                    {
                      event: "Password Changed",
                      user: "Sarah Johnson",
                      time: "Yesterday, 3:20 PM",
                      ip: "192.168.1.2",
                    },
                    {
                      event: "New User Invited",
                      user: "John Smith",
                      time: "May 20, 2023",
                      ip: "192.168.1.1",
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="text-sm flex justify-between border-b pb-2 last:border-0 last:pb-0"
                    >
                      <div>
                        <span className="font-medium">{log.event}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          by {log.user}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {log.time} • {log.ip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <h3 className="text-lg font-medium">Available Integrations</h3>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "Accounting Software",
                  description:
                    "Connect to your accounting system for seamless financial tracking",
                  connected: true,
                  icon: "💰",
                },
                {
                  name: "Shipping Provider",
                  description:
                    "Integrate with shipping carriers for real-time rates and tracking",
                  connected: false,
                  icon: "🚚",
                },
                {
                  name: "Payment Gateway",
                  description:
                    "Process payments directly through your preferred provider",
                  connected: true,
                  icon: "💳",
                },
                {
                  name: "CRM System",
                  description:
                    "Sync customer data with your customer relationship management tool",
                  connected: false,
                  icon: "👥",
                },
              ].map((integration, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  {integration.connected ? (
                    <Badge className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
