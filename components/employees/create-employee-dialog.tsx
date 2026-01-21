'use client'

import React from "react"

import { useState } from 'react'
import { useApi } from '@/lib/hooks/use-api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2 } from 'lucide-react'

interface CreateEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEmployeeDialog({
  open,
  onOpenChange,
}: CreateEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    farmId: '',
    hireDate: '',
  })
  const [error, setError] = useState('')
  const { post, loading } = useApi()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.position ||
      !formData.farmId ||
      !formData.hireDate
    ) {
      setError('All fields are required')
      return
    }

    const result = await post('/employees', formData)
    if (result) {
      onOpenChange(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        farmId: '',
        hireDate: '',
      })
    } else {
      setError('Failed to create employee')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Full Name</label>
            <Input
              placeholder="John Smith"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="john@farm.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone</label>
            <Input
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Position</label>
            <Input
              placeholder="Farm Manager"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Farm ID</label>
            <Input
              placeholder="farm-123"
              value={formData.farmId}
              onChange={(e) => handleChange('farmId', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Hire Date</label>
            <Input
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
