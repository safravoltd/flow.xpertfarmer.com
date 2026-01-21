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

interface CreateFarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFarmDialog({
  open,
  onOpenChange,
}: CreateFarmDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    cropType: '',
    managerId: '',
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
      !formData.location ||
      !formData.size ||
      !formData.cropType
    ) {
      setError('All fields are required')
      return
    }

    const result = await post('/farms', {
      ...formData,
      size: parseFloat(formData.size),
    })
    if (result) {
      onOpenChange(false)
      setFormData({
        name: '',
        location: '',
        size: '',
        cropType: '',
        managerId: '',
      })
    } else {
      setError('Failed to create farm')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Farm</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Farm Name</label>
            <Input
              placeholder="Green Valley Farm"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Location</label>
            <Input
              placeholder="County, State"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Size (acres)</label>
            <Input
              type="number"
              placeholder="500"
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Crop Type</label>
            <Input
              placeholder="Corn, Wheat, etc."
              value={formData.cropType}
              onChange={(e) => handleChange('cropType', e.target.value)}
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
              Create Farm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
