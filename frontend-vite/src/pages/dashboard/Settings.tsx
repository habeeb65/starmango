
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CircleCheck, Upload } from "lucide-react";

const BrandingSettings = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0EA5E9');
  const [accentColor, setAccentColor] = useState('#818CF8');
  const [aboutText, setAboutText] = useState("We are a wholesale business dedicated to providing the best products to our customers.");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setLogoPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Your branding settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your branding settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Company Branding</CardTitle>
          <CardDescription>
            Customize how your company appears to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <div className="flex items-center space-x-5">
              <div className="h-24 w-24 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Company logo preview" 
                    className="h-full w-full object-contain" 
                  />
                ) : (
                  <div className="text-slate-400 text-center p-4">
                    <Upload className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs">No logo</span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2">
                  <Button type="button" size="sm" variant="outline" className="relative" asChild>
                    <label>
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended size: 512x512px. <br />
                  PNG or JPEG. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Color scheme */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Scheme</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-8 w-8 rounded-md border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-8 w-8 rounded-md border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About information */}
          <div className="space-y-2">
            <label htmlFor="about" className="text-sm font-medium">
              About Information
            </label>
            <Textarea
              id="about"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell customers about your business..."
              rows={5}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This information will be displayed on your public profile.
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium">Preview</h4>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo" 
                      className="h-full w-full object-contain" 
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Logo</span>
                  )}
                </div>
                <h3 className="font-semibold">Your Company</h3>
              </div>
              
              <div 
                className="h-6 rounded-full mb-3"
                style={{ backgroundColor: primaryColor }}
              ></div>
              
              <div 
                className="h-6 w-1/2 rounded-full mb-4"
                style={{ backgroundColor: accentColor }}
              ></div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {aboutText}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="btn-3d" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

const ProfileSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Profile settings content */}
        <p className="text-slate-600 dark:text-slate-300">
          Profile settings will be implemented here
        </p>
      </CardContent>
    </Card>
  );
};

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage your notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Notification settings content */}
        <p className="text-slate-600 dark:text-slate-300">
          Notification settings will be implemented here
        </p>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="branding" className="space-y-6">
          <BrandingSettings />
        </TabsContent>
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
