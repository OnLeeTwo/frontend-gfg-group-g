'use client'

import Link from 'next/link'
import { useLogout } from '../hooks/auth'
import { useAuth } from '../hooks/authContext'
import React from 'react'

function Navbar() {
  const { isLoggedIn } = useAuth();
  const logout = useLogout();

  return (
    <nav className=" bg-[#92c529] sticky py-2 shadow-md top-0 z-10">
        <div className="mx-auto flex items-center px-2 justify-between ">
          <Link href="/">
            <img src="/logo.png" alt="SucoMart logo" className="w-24" />
          </Link>
          <ul className='flex flex-row gap-4'>
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
            </li>
            <li>
              <Link href="/product" className="text-gray-700 hover:text-blue-500">Product</Link>
            </li>
            <li>
              <Link href="/market" className="text-gray-700 hover:text-blue-500">Market</Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
            </li>
            <li>
              <Link href="/cart" className="text-gray-700 hover:text-blue-500">Cart</Link>
            </li>
            {isLoggedIn ? (
            <button 
              onClick={logout} 
              className="text-gray-700 hover:text-blue-500"
            >
              Logout
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-blue-500"
            >
              Login
            </Link>
            )}
            <li>
              <Link href="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
            </li>
          </ul>
        </div>
      </nav>
  )
}

export default Navbar