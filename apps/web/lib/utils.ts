import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export shared utils for backwards compatibility
export { formatCurrency, formatDate, getDaysUntil, generateInvoiceNumber } from '@earnhq/utils'

export function getBrandLogoUrl(brandName: string): string {
  const domain = brandName.toLowerCase().replace(/\s+/g, '') + '.com'
  return `https://logo.clearbit.com/${domain}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
