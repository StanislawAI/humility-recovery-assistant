'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, History, BarChart3 } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Today',
      icon: Home,
    },
    {
      href: '/history',
      label: 'History',
      icon: History,
    },
    {
      href: '/insights',
      label: 'Insights',
      icon: BarChart3,
    },
  ]

  return (
    <nav className="flex space-x-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}


