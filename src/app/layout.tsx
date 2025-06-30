"use client";

import { Bodoni_Moda, DM_Sans, Raleway } from "next/font/google";
import React, { useState } from "react";

import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${raleway.variable} ${bodoniModa.variable} font-sans tracking-tight antialiased`}
      >
        <header className="shadow-md">
          <div className="container mx-auto p-8">
            <div className="flex justify-between items-center">
              <a href="/">
                <div className="text-xl font-bold">
                  <span className="text-blue-900 font-display font-medium">
                    grace
                  </span>
                  <span className="bg-yellow-500 text-white font-raleway">
                    floww.
                  </span>
                </div>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-gray-700 focus:outline-none cursor-pointer"
                aria-label="Toggle Menu"
              >
                {menuOpen ? "✖" : "☰"}
              </button>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-8 text-yellow-500 duration-300 transition-all">
                <a href="/about" className="hover:text-yellow-600 font-medium">
                  About
                </a>
                <a href="/tools" className="hover:text-yellow-600 font-medium">
                  Tools
                </a>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
              className={`md:hidden ${menuOpen ? "block" : "hidden"} transition-all duration-300 pt-8`}
            >
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="block pr-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/tools"
                    className="block pr-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Tools
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        {children}
        <footer className="text-white py-12 animate-slide-in shadow-md">
          <div className="container mx-auto px-4">
            <div className="mt-8 text-center text-gray-400">
              <p className="mb-2 italic">Omnia per Christum.</p>
              <p className="mb-2 text-sm">
                matthew@gracefloww.com |{" "}
                <a
                  href="https://www.linkedin.com/in/matthewbilo/"
                  target="_blank"
                  className="underline hover:text-gray-500 transition-all duration-300"
                >
                  Linkedin
                </a>
              </p>
              <p>&copy; 2025 Gracefloww Pty Ltd. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
