"use client";

import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { CheckCircle, MapPin, Star, Mail, Phone, ChevronRight, Facebook, Twitter, Instagram, Linkedin, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { toast } from "react-hot-toast";

export default function LandingPage({ initialData }: { initialData: any }) {
  const data = initialData || {};
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } catch (err: any) {
      toast.error(`System Interface Error: ${err.message || "Network latency"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-midnight min-h-screen text-slate-100 font-sans">
      <Navbar navData={data} />
      
      {/* Hero Section */}
      <section id="home" className="relative transition-all duration-300 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.hero?.image || "/hero_bg.png"}
            alt="Luxury Construction"
            fill
            className="object-cover brightness-[0.25]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-6 px-4 py-1 rounded-full border border-amber/30 bg-amber/10 text-amber font-semibold text-sm tracking-widest uppercase"
            >
              Premium Living Spaces
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {data.hero?.title?.split("Sairaj-Spaces").map((part: string, i: number) => (
                <span key={i}>
                  {part}
                  {i === 0 && <span className="text-amber">Sairaj-Spaces</span>}
                </span>
              )) || "Build Your Dream With Sairaj-Spaces"}
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-2xl">
              {data.hero?.subtitle || "Premium Construction and Builders Solutions"}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-black hover:bg-[#e0f2fe] hover:text-[#0c4a6e] font-black rounded-xl transition-all shadow-xl shadow-black/5 hover:shadow-sky-200/50 hover:scale-105 active:scale-95 flex items-center space-x-2 transform"
              >
                <span>Inquire Now</span>
                <ChevronRight size={20} />
              </a>
               <a
                href="#about"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 backdrop-blur-sm hover:scale-105 active:scale-95 transform"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden bg-white text-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[40px] overflow-hidden border-8 border-slate-50 shadow-2xl shadow-slate-200"
            >
              <Image
                src={data.about?.image || "/about_bg.png"}
                alt="Luxury Exterior"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-[#0f172a] font-bold tracking-widest uppercase mb-3 text-sm opacity-80">About Sairaj-Spaces</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6 leading-tight">
                {data.about?.title || "Crafting Excellence"}
              </h2>
              <div className="w-20 h-1.5 bg-amber mb-8 rounded-full" />
              <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                {data.about?.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                  <h4 className="text-amber font-bold text-3xl mb-1">10+</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Years Experience</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                  <h4 className="text-amber font-bold text-3xl mb-1">500+</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Happy Families</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 bg-midnight-950 relative overflow-hidden">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-amber font-bold tracking-widest uppercase mb-3 text-sm">Elevated Living</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">World Class Amenities</h2>
            <div className="w-24 h-1.5 bg-amber mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {data.amenities?.map((item: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="bg-midnight-800/40 backdrop-blur-md p-10 rounded-[40px] text-center border border-white/5 hover:border-amber/50 transition-all shadow-2xl group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-bl-full group-hover:bg-amber/10 transition-colors"></div>
                <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/5 border border-white/10 transition-all shadow-lg group-hover:shadow-amber/10 transform group-hover:rotate-6">
                  <CheckCircle2 className="text-amber group-hover:scale-110 transition-transform" size={40} />
                </div>
                <h3 className="text-white font-black text-xl tracking-tight leading-none">{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section id="specifications" className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">Technical Specifications</h2>
              <div className="space-y-4">
                {data.specifications?.map((spec: string, i: number) => (
                  <div key={i} className="flex items-center space-x-4 p-5 bg-midnight-800/80 border-l-8 border-amber rounded-2xl shadow-sm">
                    <CheckCircle className="text-amber" size={24} />
                    <p className="text-white/90 font-bold">{spec}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/5"
            >
              <Image
                src={data.specificationsImage || "/spec_bg.png"}
                alt="Architectural Specifications"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 bg-midnight relative overflow-hidden">
        {/* Architectural Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-amber font-bold tracking-widest uppercase mb-3 text-sm">Strategic Connectivity</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Found In The Heart Of Excellence</h2>
            <div className="w-24 h-1.5 bg-amber mx-auto rounded-full mb-12" />
            
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl mb-16 hover:bg-white/10 transition-all group">
              <MapPin size={24} className="text-amber group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-white/90">{data.location?.address}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[12px] border-white/5 h-[600px] relative group"
          >
            <iframe
              title="Sairaj-Spaces Location"
              src={data.location?.mapUrl}
              className="w-full h-full grayscale-[0.6] invert-[0.9] group-hover:grayscale-0 group-hover:invert-0 transition-all duration-1000"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            {/* Architectural Border Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber/30 m-8 rounded-tl-3xl pointer-events-none group-hover:border-amber transition-colors duration-500"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber/30 m-8 rounded-br-3xl pointer-events-none group-hover:border-amber transition-colors duration-500"></div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        {/* Architectural Grid Background Overlay - faint and clean */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-[#0f172a] font-bold tracking-widest uppercase mb-3 text-sm opacity-80">Strategic Contact</h4>
            <h2 className="text-4xl md:text-6xl font-black text-[#0f172a] mb-6 leading-tight">Elite Architectural Support</h2>
            <div className="w-24 h-2 bg-amber mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            {/* Contact Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-4"
            >
              <div className="bg-[#1e293b] p-8 md:p-10 rounded-[40px] border-l-8 border-amber shadow-2xl h-full flex flex-col justify-center">
                <div className="space-y-10">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 bg-amber rounded-2xl flex items-center justify-center text-midnight shadow-lg shadow-amber/30 group-hover:scale-110 transition-transform">
                      <Phone size={28} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Direct Line</p>
                      <p className="text-white text-xl font-black italic">{data.contact?.number}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-amber border border-white/10 group-hover:bg-white/10 transition-all">
                      <Mail size={28} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Electronic Mail</p>
                      <p className="text-white text-lg font-bold truncate max-w-[180px]">{data.contact?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-amber border border-white/10 group-hover:bg-white/10 transition-all">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Corporate Locale</p>
                      <p className="text-white font-bold leading-snug">{data.location?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                   <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                     Ready to transform your vision into a monumental legacy?
                   </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-8"
            >
              <div className="bg-[#1e293b] p-10 md:p-14 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden">
                <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Identity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="johndoe@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Subject Matter</label>
                    <input
                      type="text"
                      required
                      placeholder="What are you looking for?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Detailed Vision</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your dream space..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none leading-relaxed font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-blue-500/20 text-xl transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 group"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Establish Contact</span>
                          <CheckCircle2 size={24} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-midnight border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <h3 className="text-4xl font-bold text-white mb-8 tracking-tighter">Sairaj<span className="text-amber">-Spaces</span></h3>
              <p className="text-slate-400 max-w-sm leading-relaxed text-lg font-medium">
                {data.footer?.description || "Providing premium living spaces and top-notch construction quality since decades."}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 text-xl">Connectivity</h4>
              <p className="text-slate-400 mb-3 font-medium flex items-center space-x-2 hover:text-amber transition-colors">
                <Phone size={18} className="text-amber" />
                <span>{data.contact?.number}</span>
              </p>
              <p className="text-slate-400 font-medium flex items-center space-x-2 hover:text-amber transition-colors">
                <Mail size={18} className="text-amber" />
                <span>{data.contact?.email}</span>
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 text-xl">Social Presence</h4>
              <div className="flex space-x-4">
                <a href={data.footer?.facebook} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-amber hover:bg-amber/10 hover:-translate-y-2 transition-all"><Facebook size={24}/></a>
                <a href={data.footer?.twitter} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-amber hover:bg-amber/10 hover:-translate-y-2 transition-all"><Twitter size={24}/></a>
                <a href={data.footer?.instagram} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-amber hover:bg-amber/10 hover:-translate-y-2 transition-all"><Instagram size={24}/></a>
                <a href={data.footer?.linkedin} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-amber hover:bg-amber/10 hover:-translate-y-2 transition-all"><Linkedin size={24}/></a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-center text-white/20 text-sm font-semibold tracking-wider">
            &copy; {new Date().getFullYear()} SAIRAJ-SPACES PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
