'use client'

import { useInView } from 'react-intersection-observer'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'none'
}

export function FadeIn({ children, className = '', delay = 0, direction = 'up' }: FadeInProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0)'
          : direction === 'up' ? 'translateY(18px)' : 'translateY(0)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
