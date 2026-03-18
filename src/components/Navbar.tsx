/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ navData, onCategorySelect }: { navData: any, onCategorySelect?: (category: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isProjectsHovered, setIsProjectsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "about", "projects", "contact"];
      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About us", href: "#about" },
    { name: "Projects", href: "#projects", hasDropdown: true },
    { name: "Contact us", href: "#contact" },
  ];

  const projectCategories = [
    "All",
    "Residential",
    "Commercial",
    "Infrastructure",
    "Completed Projects",
    "Ongoing",
    "Upcoming",
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white/90 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
          >
            {navData?.site?.siteName || "Sairaj Spaces"}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsProjectsHovered(true)}
                    onMouseLeave={() => setIsProjectsHovered(false)}
                  >
                    <a
                      href={link.href}
                      className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                        isActive
                          ? "text-[#2563eb] font-semibold"
                          : "text-gray-600 hover:text-[#2563eb]"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          isProjectsHovered ? "rotate-180 text-[#2563eb]" : ""
                        }`}
                      />
                    </a>

                    <AnimatePresence>
                      {isProjectsHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                        >
                          {projectCategories.map((cat) => (
                            <a
                              key={cat}
                              href="#projects"
                              onClick={(e) => {
                                e.preventDefault();
                                onCategorySelect?.(cat);
                                setIsProjectsHovered(false);
                                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="block px-5 py-3 text-sm text-gray-600 hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors font-medium border-l-4 border-transparent hover:border-[#2563eb]"
                            >
                              {cat}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? "text-[#2563eb] font-semibold"
                      : "text-gray-600 hover:text-[#2563eb]"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#2563eb] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
            {/* Admin Button */}
            <Link
              href="/admin"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all duration-200 shadow-md hover:shadow-blue-300/50 hover:-translate-y-0.5 transform active:scale-95"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors text-gray-700 hover:text-[#2563eb]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col space-y-5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <div key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-medium transition-colors flex items-center justify-between ${
                        isActive ? "text-[#2563eb] font-semibold" : "text-gray-600 hover:text-[#2563eb]"
                      }`}
                    >
                      {link.name}
                      {link.hasDropdown && <ChevronDown size={18} />}
                    </a>
                    {link.hasDropdown && (
                      <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-2 border-gray-100 pl-4">
                        {projectCategories.map((cat) => (
                          <a
                            key={cat}
                            href="#projects"
                            onClick={(e) => {
                              e.preventDefault();
                              onCategorySelect?.(cat);
                              setIsOpen(false);
                              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-sm text-gray-500 hover:text-[#2563eb] py-1 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            {cat}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-lg bg-[#2563eb] text-white font-semibold text-sm hover:bg-[#1d4ed8] transition-all shadow-md active:scale-95"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
