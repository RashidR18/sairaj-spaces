/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ navData }: { navData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ["home", "about", "amenities", "specifications", "location", "contact"];
      let current = "";
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
    { name: "About", href: "#about" },
    { name: "Amenities", href: "#amenities" },
    { name: "Specifications", href: "#specifications" },
    { name: "Location", href: "#location" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className="fixed w-full z-50 transition-all duration-500 bg-[#0f172a] py-4 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold tracking-tighter text-white">
            Sairaj<span className="text-amber">-Spaces</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold transition-all uppercase tracking-widest transform ${
                    isActive 
                      ? "text-amber scale-125 font-black" 
                      : scrolled ? "text-slate-300 hover:text-amber hover:scale-110" : "text-white/80 hover:text-amber hover:scale-110"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href={`tel:${navData?.contact?.number || "1234567899"}`}
              className={`text-sm font-bold transition-all uppercase tracking-widest hover:scale-110 transform ${
                scrolled ? "text-slate-300 hover:text-amber" : "text-white/80 hover:text-amber"
              }`}
            >
              {navData?.contact?.number || "1234567899"}
            </a>
            <Link
              href="/admin"
              className="px-6 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-widest transform hover:-translate-y-1 bg-white text-black hover:bg-[#e0f2fe] hover:text-[#0c4a6e] shadow-lg shadow-black/5 hover:shadow-sky-200/50"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="md:hidden fixed inset-y-0 right-0 w-3/4 bg-midnight/95 backdrop-blur-xl border-l border-white/5 shadow-2xl z-[60]"
        >
          <div className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-end">
               <button onClick={() => setIsOpen(false)} className="text-white hover:text-amber"><X size={32}/></button>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-white hover:text-amber transition-all"
              >
                {link.name}
              </a>
            ))}
            <a
              href={`tel:${navData?.contact?.number || "1234567899"}`}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-white hover:text-amber transition-all"
            >
              {navData?.contact?.number || "1234567899"}
            </a>
            <div className="pt-4">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 text-center rounded-2xl bg-amber text-midnight font-black text-xl flex items-center justify-center space-x-3 shadow-2xl shadow-amber/30 hover:bg-white transition-all transform active:scale-95"
              >
                <span>Admin Portal</span>
                <ChevronRight size={24} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
