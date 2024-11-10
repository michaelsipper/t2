'use client';
import { Home, Footprints, PlusCircle, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Feed', href: '/feed' },
  { icon: Footprints, label: 'Footprint', href: '/footprint' },
  { icon: PlusCircle, label: 'Create', href: '/create' },
  { icon: Mail, label: 'Inbox', href: '/inbox' },
  { icon: User, label: 'Profile', href: '/profile' }
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center ${
                isActive ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}