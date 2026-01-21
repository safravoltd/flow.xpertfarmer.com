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

interface CreateSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSaleDialog({
  open,
  onOpenChange,
}: CreateSaleDialogProps) {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    price: '',
    farmId: '',
    saleDate: '',
    buyer: '',
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
      !formData.productName ||
      !formData.quantity ||
      !formData.price ||
      !formData.farmId ||
      !formData.saleDate ||
      !formData.buyer
    ) {
      setError('All fields are required')
      return
    }

    const result = await post('/sales', {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
    })
    if (result) {
      onOpenChange(false)
      setFormData({
        productName: '',
        quantity: '',
        price: '',
        farmId: '',
        saleDate: '',
        buyer: '',
      })
    } else {
      setError('Failed to record sale')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Sale</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Name</label>
            <Input
              placeholder="Corn, Wheat, Milk"
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Quantity</label>
            <Input
              type="number"
              placeholder="100"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Price Per Unit</label>
            <Input
              type="number"
              placeholder="10.50"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
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
            <label className="block text-sm font-medium">Sale Date</label>
            <Input
              type="date"
              value={formData.saleDate}
              onChange={(e) => handleChange('saleDate', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Buyer Name</label>
            <Input
              placeholder="Company Name"
              value={formData.buyer}
              onChange={(e) => handleChange('buyer', e.target.value)}
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
              Record Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
