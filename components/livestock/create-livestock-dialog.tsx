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

interface CreateLivestockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLivestockDialog({
  open,
  onOpenChange,
}: CreateLivestockDialogProps) {
  const [formData, setFormData] = useState({
    type: '',
    breed: '',
    count: '',
    farmId: '',
    lastCheckupDate: '',
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
      !formData.type ||
      !formData.breed ||
      !formData.count ||
      !formData.farmId ||
      !formData.lastCheckupDate
    ) {
      setError('All fields are required')
      return
    }

    const result = await post('/livestock', {
      ...formData,
      count: parseInt(formData.count),
    })
    if (result) {
      onOpenChange(false)
      setFormData({
        type: '',
        breed: '',
        count: '',
        farmId: '',
        lastCheckupDate: '',
      })
    } else {
      setError('Failed to add livestock')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Livestock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Animal Type</label>
            <Input
              placeholder="Cattle, Sheep, Chickens"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Breed</label>
            <Input
              placeholder="Holstein, Merino, etc."
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Count</label>
            <Input
              type="number"
              placeholder="100"
              value={formData.count}
              onChange={(e) => handleChange('count', e.target.value)}
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
            <label className="block text-sm font-medium">Last Checkup Date</label>
            <Input
              type="date"
              value={formData.lastCheckupDate}
              onChange={(e) => handleChange('lastCheckupDate', e.target.value)}
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
              Add Livestock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
