'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SettingsPage() {
  const { data: session } = useSession()

  const userInitials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and system preferences
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Account Information</h3>
        <div className="flex items-center gap-6 pb-6 border-b border-border">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
            <p className="text-sm text-muted-foreground capitalize mt-2">
              Role: {(session?.user as any)?.role || 'User'}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Full Name</label>
            <Input
              value={session?.user?.name || ''}
              readOnly
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email Address</label>
            <Input
              value={session?.user?.email || ''}
              readOnly
              className="bg-muted/50"
            />
          </div>

          <div className="pt-4">
            <Button disabled>Update Profile</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Choose your preferred display theme
              </p>
            </div>
            <Button variant="outline">System</Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about farm activities
              </p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-sm text-muted-foreground mb-3">
              Change your account password
            </p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground mb-3">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
