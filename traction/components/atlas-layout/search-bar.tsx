'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/atlas-ui/avatar';
import type { UserProfile } from '@/lib/atlas-types';
import { usePathname } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    setQuery('');
  }, [pathname]);

  // Debounced search
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(`/atlas/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <form 
      className="relative w-full max-w-[320px]" 
      ref={dropdownRef}
      onSubmit={(e) => {
        e.preventDefault();
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) activeElement.blur();
      }}
    >
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input 
        type="search" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
        placeholder="Search by name, profession, company..."
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900"
      />

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col max-h-[400px]">
          {isLoading && results.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                Professionals
              </div>
              {results.map((user) => (
                <Link 
                  key={user.id} 
                  href={`/atlas/discover`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <Avatar name={user.name} avatar={user.avatar} size="sm" showStatus status={user.availability} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-900 truncate">{user.name}</span>
                    <span className="text-xs text-gray-500 truncate">{user.profession} at {user.company}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </form>
  );
}
