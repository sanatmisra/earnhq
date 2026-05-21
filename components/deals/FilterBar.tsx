'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, LayoutGrid, List } from 'lucide-react'
import type { DealStatus, Platform } from '@/types'
import { DEAL_STATUS_COLORS } from '@/types'

const STATUSES: { value: DealStatus; label: string }[] = [
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'contracted', label: 'Contracted' },
  { value: 'in_production', label: 'In Production' },
  { value: 'live', label: 'Live' },
  { value: 'invoiced', label: 'Invoiced' },
  { value: 'paid', label: 'Paid' },
]

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'newsletter', label: 'Newsletter' },
]

export type ViewMode = 'kanban' | 'table'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedStatuses: DealStatus[]
  onStatusToggle: (status: DealStatus) => void
  selectedPlatforms: Platform[]
  onPlatformToggle: (platform: Platform) => void
  onClearFilters: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  selectedPlatforms,
  onPlatformToggle,
  onClearFilters,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const hasFilters = searchQuery || selectedStatuses.length > 0 || selectedPlatforms.length > 0

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-[#0D0D0D] border-[#222222]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#111111] rounded-lg border border-[#222222]">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${viewMode === 'kanban' ? 'bg-[#222222]' : ''}`}
            onClick={() => onViewModeChange('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${viewMode === 'table' ? 'bg-[#222222]' : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Status:</span>
        {STATUSES.map((status) => {
          const isSelected = selectedStatuses.includes(status.value)
          return (
            <button
              key={status.value}
              onClick={() => onStatusToggle(status.value)}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                isSelected
                  ? 'border-current'
                  : 'border-transparent bg-[#1A1A1A] text-muted-foreground hover:text-foreground'
              }`}
              style={
                isSelected
                  ? {
                      backgroundColor: `${DEAL_STATUS_COLORS[status.value]}20`,
                      color: DEAL_STATUS_COLORS[status.value],
                      borderColor: `${DEAL_STATUS_COLORS[status.value]}50`,
                    }
                  : undefined
              }
            >
              {status.label}
            </button>
          )
        })}

        <span className="text-xs text-muted-foreground ml-2">Platform:</span>
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.value)
          return (
            <button
              key={platform.value}
              onClick={() => onPlatformToggle(platform.value)}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-transparent bg-[#1A1A1A] text-muted-foreground hover:text-foreground'
              }`}
            >
              {platform.label}
            </button>
          )
        })}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
