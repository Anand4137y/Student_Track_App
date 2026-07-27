"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const hideHeader = ['auth/login', 'auth/signup']
  const shouldHideHeader = hideHeader.some(path => pathname.includes(path))

  const { user, setUser } = useAuth();
  const name = user?.name ?? null;
  const role = user?.role ?? null;

  // Generate a nice background color based on the initial
  const getAvatarColor = (letter: any) => {
    const colors = [
      'bg-blue-900',
      'bg-green-900',
      'bg-purple-900',
      'bg-pink-900',
      'bg-indigo-900',
      'bg-teal-900',
      'bg-orange-900',
      'bg-cyan-900'
    ];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    Cookies.remove("token");
    router.push("/auth/login");
  };
  return (
    <header className={`w-full bg-white shadow-md px-8 py-4 flex items-center justify-between ${shouldHideHeader ? 'hidden' : ''}`}>

      {/* Left Logo */}
      <div className="text-2xl font-bold text-black">
        School Admin
      </div>

      {/* Center Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex gap-8">
        {
          role && role === 'school' && (
            <Link
              href="/teachers"
              className={`text-lg font-medium transition ${pathname === "/teachers"
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-600"
                }`}
            >
              Teachers
            </Link>
          )
        }

        <Link
          href="/students"
          className={`text-lg font-medium transition ${pathname === "/students"
            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600"
            }`}
        >
          Students
        </Link>

        <Link
          href="/reports"
          className={`text-lg font-medium transition ${pathname === "/reports"
            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600"
            }`}
        >
          Reports
        </Link>
      </nav>

      {/* Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className={`w-11 h-11 rounded-full flex items-center justify-center 
      text-black font-semibold text-lg cursor-pointer 
      border-2 border-gray-800 hover:scale-105 transition
      ${name ? getAvatarColor(name) : ''}`}
          title={name || 'Profile'}
        >
          {name ? name.charAt(0).toUpperCase() : ''}
        </div>

        {open && (
          <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border">
            <button
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-b-xl"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}