import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { CheckCircle2, Bell, Moon, Mail, Globe } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: false,
    newsletter: false,
    darkMode: false,
    language: "en",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    toast.success("Settings updated successfully!", {
      description: "Your preferences have been saved.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>

      {/* Preferences Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-muted-foreground" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Enable Notifications</span>
            <Switch checked={settings.notifications} onCheckedChange={() => handleToggle("notifications")} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Subscribe to Newsletter</span>
            <Switch checked={settings.newsletter} onCheckedChange={() => handleToggle("newsletter")} />
          </div>
        </CardContent>
      </Card>

      
      {/* Language Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-muted-foreground" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
          </select>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="text-right">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
