/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Save, User, Settings, Lock, Upload, Trash2, Camera, Phone, 
  LayoutDashboard, Home, Image as ImageIcon, MapPin, MessageSquare, 
  ShieldCheck, ChevronRight, Eye, EyeOff, CheckCircle2, AlertCircle, Mail
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        if (!sessionStorage.getItem("admin_auth")) {
          router.replace("/");
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchData();
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      setMessages(json);
    } catch (e) {
      console.error("Messages fetch error:", e);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/content", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        toast.success("Logged in successfully");
        fetchData();
        fetchMessages();
      } else {
        toast.error("Invalid credentials");
      }
    } catch {
      toast.error("Firewall Interface Error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    sessionStorage.removeItem("admin_auth");
    setTimeout(() => {
      window.location.replace("/");
    }, 1000);
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (data) {
      setData({
        ...data,
        [section]: {
          ...data[section],
          [field]: value,
        },
      });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    if (data) {
      const newArray = [...data[field]];
      newArray[index] = value;
      setData({
        ...data,
        [field]: newArray,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section?: string, field?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, filename: `content_${Date.now()}.png` }),
        });
        
        if (res.ok) {
          const { url } = await res.json();
          if (section && field) {
             handleChange(section, field, url);
          } else if (section) { // Case for top-level fields like specificationsImage
             setData({ ...data, [section]: url });
          } else {
             handleChange("adminProfile", "profilePic", url);
          }
        } else {
          alert("Failed to upload image.");
        }
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("Error uploading image");
      setIsSaving(false);
    }
  };

  const handleDeleteProfilePic = () => {
    handleChange("adminProfile", "profilePic", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Changes saved successfully");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving content.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] relative overflow-hidden">
        {/* Architectural Design Elements */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[380px] px-4 relative z-10"
        >
          <div className="bg-[#1e293b] p-8 rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 transform rotate-6 shadow-xl">
                <ShieldCheck className="text-amber" size={32} />
              </div>
              <h2 className="text-3xl font-black text-white mb-1 tracking-tighter">Secure Link</h2>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Administrator Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access ID</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@sairaj.com"
                  className="w-full bg-[#0a0f1c] border border-white/5 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security Key</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0f1c] border border-white/5 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-xl text-base font-black transition-all uppercase tracking-widest transform hover:-translate-y-1 bg-white text-black hover:bg-[#e0f2fe] hover:text-[#0c4a6e] shadow-xl shadow-black/20 flex items-center justify-center space-x-3 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-4 border-[#0c4a6e] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center space-x-3 text-slate-600 pt-2 opacity-50">
                <Lock size={12} />
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">Encrypted Access</p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080f]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 border-4 border-amber border-t-transparent rounded-full animate-spin" 
        />
      </div>
    );
  }

  const sidebarLinks = [
    { id: "hero", label: "Hero Banner", icon: ImageIcon },
    { id: "about", label: "About Us", icon: Home },
    { id: "amenities", label: "Amenities", icon: CheckCircle2 },
    { id: "specifications", label: "Technical", icon: Settings },
    { id: "location", label: "Location", icon: MapPin },
    { id: "messages", label: "Client Inquiries", icon: MessageSquare },
    { id: "footer", label: "Footer Settings", icon: Settings },
    { id: "profile", label: "Profile & Security", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 flex overflow-hidden font-sans">
      
      {/* Sidebar Section */}
      <aside className="w-72 bg-[#0f172a] border-r border-white/5 flex flex-col h-screen overflow-y-auto">
        <div className="p-8 border-b border-white/5 mb-6">
          <h1 className="text-2xl font-black text-white tracking-tighter flex items-center space-x-2">
            <span>Sairaj</span>
            <span className="text-amber">-Admin</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Professional Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === link.id
                      ? "bg-amber text-midnight shadow-lg shadow-amber/20 scale-105"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <link.icon size={22} className={activeTab === link.id ? "text-midnight" : "text-amber transition-colors"} />
                  <span className="font-bold tracking-tight">{link.label}</span>
                  {activeTab === link.id && <ChevronRight size={18} className="ml-auto" />}
                </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-[#05080f] to-[#0f172a]/30">
        
        {/* Header Ribbon */}
        <header className="sticky top-0 z-40 bg-[#05080f]/80 backdrop-blur-xl border-b border-white/5 px-10 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight capitalize">{activeTab.replace("-", " ")}</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Management Console</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest transform hover:-translate-y-1 bg-white text-black hover:bg-[#e0f2fe] hover:text-[#0c4a6e] shadow-lg shadow-black/5 hover:shadow-sky-200/50 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-[#0c4a6e] border-t-transparent animate-spin rounded-full" /> : <Save size={18} />}
              <span>{isSaving ? "Syncing..." : "Publish Changes"}</span>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-white/5 text-center shadow-xl">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-amber/10 border-2 border-amber/20 overflow-hidden mx-auto mb-6 relative group transform rotate-3">
                        {data.adminProfile?.profilePic ? (
                          <Image src={data.adminProfile.profilePic} alt="Admin" fill className="object-cover" />
                        ) : (
                          <Camera className="text-amber w-1/3 h-1/3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                        <div className="absolute inset-0 bg-[#0f172a]/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-4">
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="p-2 bg-white/10 hover:bg-amber hover:text-midnight rounded-xl transition-all"
                             title="Upload New"
                           >
                             <Upload size={20} />
                           </button>
                           {data.adminProfile?.profilePic && (
                             <button 
                               onClick={handleDeleteProfilePic}
                               className="p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                               title="Delete Picture"
                             >
                               <Trash2 size={20} />
                             </button>
                           )}
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      <div className="space-y-1">
                        <h4 className="text-white font-bold tracking-tight">Profile Identity</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Management Access Only</p>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-6">{data.adminProfile?.name}</h3>
                      <p className="text-slate-500 font-medium text-sm">{data.adminProfile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-8 flex items-center space-x-3">
                         < ShieldCheck className="text-amber" size={20} />
                         <span>Account Security</span>
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Administrator Name</label>
                            <input
                              type="text"
                              value={data.adminProfile?.name || ""}
                              onChange={(e) => handleChange("adminProfile", "name", e.target.value)}
                              className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Login Email</label>
                            <input
                              type="email"
                              value={data.adminProfile?.email || ""}
                              onChange={(e) => handleChange("adminProfile", "email", e.target.value)}
                              className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all font-medium"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Secure Password</label>
                          <input
                            type="password"
                            placeholder="Enter new password to reset"
                            onChange={(e) => handleChange("adminProfile", "password", e.target.value)}
                            className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Tab */}
              {activeTab === "hero" && (
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl space-y-8">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Main Headline</label>
                    <input
                      type="text"
                      value={data.hero?.title || ""}
                      onChange={(e) => handleChange("hero", "title", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 text-2xl font-black text-white focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Landing Hero Image</label>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/20">
                          {data.hero?.image ? (
                             <Image src={data.hero.image} alt="Hero" fill className="object-cover" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic">No image set</div>
                          )}
                       </div>
                       <div className="flex flex-col justify-center space-y-4">
                          <input 
                            type="text" 
                            placeholder="Image URL" 
                            value={data.hero?.image || ""} 
                            onChange={(e) => handleChange("hero", "image", e.target.value)}
                            className="w-full bg-[#05080f] border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-amber/50 outline-none"
                          />
                          <div className="flex items-center space-x-3">
                             <label className="flex-1 bg-amber/10 hover:bg-amber/20 text-amber font-bold py-3 rounded-xl transition-all cursor-pointer text-center text-sm flex items-center justify-center space-x-2">
                                <Upload size={16} />
                                <span>Upload Image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "hero", "image")} />
                             </label>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tagline & Introduction</label>
                    <textarea
                      rows={4}
                      value={data.hero?.subtitle || ""}
                      onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all font-medium leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === "about" && (
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl space-y-8">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Section Title</label>
                    <input
                      type="text"
                      value={data.about?.title || ""}
                      onChange={(e) => handleChange("about", "title", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 text-xl font-bold text-white focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">About Section Image</label>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/20">
                          {data.about?.image ? (
                             <Image src={data.about.image} alt="About" fill className="object-cover" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic">No image set</div>
                          )}
                       </div>
                       <div className="flex flex-col justify-center space-y-4">
                          <input 
                            type="text" 
                            placeholder="Image URL" 
                            value={data.about?.image || ""} 
                            onChange={(e) => handleChange("about", "image", e.target.value)}
                            className="w-full bg-[#05080f] border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-amber/50 outline-none"
                          />
                          <label className="bg-amber/10 hover:bg-amber/20 text-amber font-bold py-3 rounded-xl transition-all cursor-pointer text-center text-sm flex items-center justify-center space-x-2">
                             <Upload size={16} />
                             <span>Upload Image</span>
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "about", "image")} />
                          </label>
                       </div>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Detailed Narrative</label>
                    <textarea
                      rows={8}
                      value={data.about?.description || ""}
                      onChange={(e) => handleChange("about", "description", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all font-medium leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Amenities Tab */}
              {activeTab === "amenities" && (
                <div className="grid grid-cols-2 gap-6">
                  {data.amenities?.map((item: string, idx: number) => (
                    <div key={idx} className="bg-[#0f172a] p-8 rounded-[2rem] border border-white/5 shadow-lg group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Amenity #{idx + 1}</label>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange("amenities", idx, e.target.value)}
                        className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber/50 transition-all font-bold"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Specifications Tab */}
              {activeTab === "specifications" && (
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl space-y-6">
                  {data.specifications?.map((spec: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber rounded-2xl flex items-center justify-center text-midnight font-black">{idx + 1}</div>
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleArrayChange("specifications", idx, e.target.value)}
                        className="flex-1 bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-amber/50 transition-all font-bold"
                      />
                    </div>
                  ))}

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Specifications Banner Image</label>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/20">
                          {data.specificationsImage ? (
                             <Image src={data.specificationsImage} alt="Specifications" fill className="object-cover" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic">No image set</div>
                          )}
                       </div>
                       <div className="flex flex-col justify-center space-y-4">
                          <input 
                            type="text" 
                            placeholder="Image URL" 
                            value={data.specificationsImage || ""} 
                            onChange={(e) => setData({ ...data, specificationsImage: e.target.value })}
                            className="w-full bg-[#05080f] border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-amber/50 outline-none"
                          />
                          <label className="bg-amber/10 hover:bg-amber/20 text-amber font-bold py-3 rounded-xl transition-all cursor-pointer text-center text-sm flex items-center justify-center space-x-2">
                             <Upload size={16} />
                             <span>Upload Image</span>
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "specificationsImage")} />
                          </label>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === "location" && (
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl space-y-8">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Office Address</label>
                    <input
                      type="text"
                      value={data.location?.address || ""}
                      onChange={(e) => handleChange("location", "address", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 font-bold text-white focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Map Embed URL (Source Only)</label>
                    <input
                      type="text"
                      value={data.location?.mapUrl || ""}
                      onChange={(e) => handleChange("location", "mapUrl", e.target.value)}
                      className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 font-mono text-xs text-amber focus:ring-2 focus:ring-amber/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="bg-[#05080f] h-64 rounded-3xl overflow-hidden border border-white/5 opacity-50 flex items-center justify-center italic text-slate-600">
                    Interactive Map Preview Rendering Placeholder
                  </div>
                </div>
              )}
              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="bg-[#0f172a] p-20 rounded-[3rem] border border-white/5 text-center shadow-xl">
                       <MessageSquare className="mx-auto text-slate-700 mb-6" size={60} />
                       <h3 className="text-2xl font-bold text-slate-500">No active inquiries at this time.</h3>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:border-amber/20 transition-all group"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-amber/10 rounded-2xl flex items-center justify-center text-amber border border-amber/20">
                              <User size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-white">{msg.name}</h3>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                             <a href={`mailto:${msg.email}`} className="px-4 py-2 bg-white/5 hover:bg-amber hover:text-midnight rounded-xl text-xs font-black transition-all flex items-center space-x-2 border border-white/5">
                               <Mail size={14} />
                               <span>Email Client</span>
                             </a>
                             <a href={`tel:${msg.phone}`} className="px-4 py-2 bg-white/5 hover:bg-blue-500 hover:text-white rounded-xl text-xs font-black transition-all flex items-center space-x-2 border border-white/5">
                               <Phone size={14} />
                               <span>Connect Phone</span>
                             </a>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                           <div className="md:col-span-1 space-y-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Subject Strategy</label>
                                <p className="text-amber font-bold">{msg.subject}</p>
                              </div>
                              <div className="pt-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Digital Identity</label>
                                <p className="text-white font-medium text-sm truncate">{msg.email}</p>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Secure Contact</label>
                                <p className="text-white font-medium text-sm">{msg.phone}</p>
                              </div>
                           </div>
                           <div className="md:col-span-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Architectural Vision / Message</label>
                              <div className="bg-[#05080f] p-6 rounded-2xl border border-white/5 text-slate-300 text-sm leading-relaxed font-medium">
                                {msg.message}
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
              {/* Footer Tab */}
              {activeTab === "footer" && (
                <div className="space-y-8">
                  <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-8">Contact & Footer</h3>
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Business Hotline</label>
                        <input
                          type="text"
                          value={data.contact?.number || ""}
                          onChange={(e) => handleChange("contact", "number", e.target.value)}
                          className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 font-bold text-white focus:ring-2 focus:ring-amber/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Official Support Email</label>
                        <input
                          type="email"
                          value={data.contact?.email || ""}
                          onChange={(e) => handleChange("contact", "email", e.target.value)}
                          className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 font-bold text-white focus:ring-2 focus:ring-amber/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Company Description</label>
                      <textarea
                        rows={4}
                        value={data.footer?.description || ""}
                        onChange={(e) => handleChange("footer", "description", e.target.value)}
                        className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-amber/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-8">Social Ecosystem</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                        <div key={social} className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 capitalize">{social} URL</label>
                          <input
                            type="text"
                            value={data.footer?.[social] || ""}
                            onChange={(e) => handleChange("footer", social, e.target.value)}
                            className="w-full bg-[#05080f] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber/50 text-sm font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

