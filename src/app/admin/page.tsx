/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
   LogOut, Save, User, Lock, Upload, Trash2, Camera,
   Home, Image as ImageIcon, MessageSquare,
   ShieldCheck, ChevronRight, Eye, EyeOff, Users,
   Building2, Briefcase, Star, Plus, X, Menu, SlidersHorizontal
} from "lucide-react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import CropModal from "@/components/admin/CropModal";

export default function AdminPage() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState<any>(null);
   const [prevData, setPrevData] = useState<any>(null);
   const [isSaving, setIsSaving] = useState(false);
   const [activeTab, setActiveTab] = useState("hero");
   const [messages, setMessages] = useState<any[]>([]);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [cropData, setCropData] = useState<{ image: string; section: string; field: string; nestedField?: string } | null>(null);
   const router = useRouter();

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

   const handleDeleteMessage = async (id: string) => {
      if (!confirm("Are you sure you want to delete this message?")) return;

      try {
         const res = await fetch(`/api/contact?id=${id}`, {
            method: "DELETE",
         });
         if (res.ok) {
            toast.success("Message deleted");
            fetchMessages();
         } else {
            toast.error("Failed to delete message");
         }
      } catch {
         toast.error("Error deleting message");
      }
   };

   const fetchData = async () => {
      try {
         setIsLoading(true);
         const res = await fetch("/api/content", { cache: "no-store" });
         const json = await res.json();
         setData(json);
         setPrevData(json);
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

   const handleNestedChange = (section: string, subSection: string, field: string, value: any) => {
      if (data) {
         setData({
            ...data,
            [section]: {
               ...data[section],
               [subSection]: {
                  ...data[section][subSection],
                  [field]: value
               }
            }
         })
      }
   }

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

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section?: string, field?: string, nestedField?: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
         setCropData({
            image: reader.result as string,
            section: section || "adminProfile",
            field: field || "profilePic",
            nestedField
         });
      };
      reader.readAsDataURL(file);
   };

   const handleCropComplete = async (croppedImage: string) => {
      if (!cropData) return;
      const { section, field, nestedField } = cropData;
      setCropData(null);

      try {
         setIsSaving(true);
         const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64: croppedImage, filename: `content_${Date.now()}.png` }),
         });

         if (res.ok) {
            const { url } = await res.json();
            if (section && field && nestedField) {
               handleNestedChange(section, field, nestedField, url);
            } else if (section && field) {
               handleChange(section, field, url);
            } else if (section) {
               setData({ ...data, [section]: url });
            }
            toast.success("Image updated");
         } else {
            toast.error("Upload failed");
         }
      } catch {
         toast.error("Upload error");
      } finally {
         setIsSaving(false);
      }
   };

   const handleSave = async () => {
      if (JSON.stringify(data) === JSON.stringify(prevData)) {
         toast.error("Nothing updated to publish");
         return;
      }

      try {
         setIsSaving(true);
         const res = await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         });
         if (res.ok) {
            toast.success("Changes saved successfully");
            setPrevData(data);
         } else {
            toast.error("Failed to save changes");
         }
      } catch (e) {
         console.error(e);
         toast.error("Error saving content.");
      } finally {
         setIsSaving(false);
      }
   };

   const addItem = (field: string, defaultValue: any) => {
      if (data) {
         setData({
            ...data,
            [field]: [...data[field], defaultValue]
         })
      }
   }

   const removeItem = (field: string, index: number) => {
      if (data) {
         setData({
            ...data,
            [field]: data[field].filter((_: any, i: number) => i !== index)
         })
      }
   }

   const handleItemChange = (field: string, index: number, subField: string, value: any) => {
      if (data) {
         const newList = [...data[field]];
         newList[index] = { ...newList[index], [subField]: value };
         setData({ ...data, [field]: newList });
      }
   }

   if (!isAuthenticated) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <Toaster position="top-center" />
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-md px-4 relative z-10"
            >
               <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                  <div className="text-center mb-6 lg:mb-8">
                     <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <ShieldCheck className="text-blue-600" size={32} />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tighter">Admin Portal</h2>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Sairaj Spaces Management</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 lg:space-y-5">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Access ID</label>
                        <input
                           type="email"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="admin@sairajspaces.com"
                           className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-3 lg:py-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Security Key</label>
                        <div className="relative">
                           <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-3 lg:py-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm pr-14"
                           />
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                           >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>

                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 mt-4"
                     >
                        {isLoading ? (
                           <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <>
                              <span>Sign In</span>
                              <ChevronRight size={18} />
                           </>
                        )}
                     </button>

                     <div className="flex items-center justify-center space-x-2 text-gray-300 pt-4">
                        <Lock size={12} />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Session</p>
                     </div>
                  </form>
               </div>
            </motion.div>
         </div>
      );
   }

   if (isLoading || !data) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
               animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
         </div>
      );
   }

    const sidebarLinks = [
       { id: "hero", label: "Hero Banner", icon: ImageIcon },
       { id: "services", label: "Our Services", icon: Briefcase },
       { id: "about", label: "About Section", icon: Home },
       { id: "projects", label: "Portfolio", icon: Building2 },
       { id: "team", label: "Expert Team", icon: Users },
       { id: "footer", label: "Footer Settings", icon: SlidersHorizontal },
       { id: "messages", label: "Inquiries", icon: MessageSquare },
       { id: "profile", label: "Profile", icon: User },
    ];

   return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex overflow-hidden font-sans">
         <Toaster position="top-right" />

         {/* Sidebar - Desktop & Tablet */}
         <aside className={`fixed lg:relative z-50 lg:z-0 w-72 bg-white border-r border-gray-100 flex flex-col h-screen overflow-y-auto shadow-xl lg:shadow-none transition-transform duration-500 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="p-8 lg:p-10 mb-6 flex justify-between items-center">
               <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
                     Sairaj<span className="text-blue-600">.Admin</span>
                  </h1>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">v2.0 Workspace</p>
               </div>
               <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-blue-600">
                  <X size={20} />
               </button>
            </div>

            <nav className="flex-1 px-6 space-y-2">
               {sidebarLinks.map((link) => (
                  <button
                     key={link.id}
                     onClick={() => {
                        setActiveTab(link.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                     }}
                     className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === link.id
                           ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-2"
                           : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                  >
                     <link.icon size={20} className={activeTab === link.id ? "text-white" : "group-hover:text-blue-600"} />
                     <span className="font-bold tracking-tight text-sm">{link.label}</span>
                     {activeTab === link.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
               ))}
            </nav>

            <div className="p-8 mt-auto border-t border-gray-50">
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all transform active:scale-95 text-sm"
               >
                  <LogOut size={16} />
                  <span>Sign Out</span>
               </button>
            </div>
         </aside>

         {/* Mobile Backdrop */}
         <AnimatePresence>
            {isSidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
               />
            )}
         </AnimatePresence>

         {/* Main Content Area */}
         <main className="flex-1 h-screen overflow-y-auto w-full">
            {/* Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 lg:px-12 py-6 lg:py-8 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => setIsSidebarOpen(true)}
                     className="lg:hidden p-3 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100"
                  >
                     <Menu size={20} />
                  </button>
                  <div>
                     <h2 className="text-xl lg:text-3xl font-black text-gray-900 tracking-tight capitalize">{activeTab}</h2>
                     <p className="hidden sm:block text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Section Configurator</p>
                  </div>
               </div>

               <div className="flex items-center space-x-3">
                  <button
                     onClick={handleSave}
                     disabled={isSaving}
                     className="px-6 lg:px-10 py-3 lg:py-4 bg-blue-600 text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center space-x-2 lg:space-x-3"
                  >
                     {isSaving ? <div className="w-4 lg:w-5 h-4 lg:h-5 border-2 lg:border-3 border-white border-t-transparent animate-spin rounded-full" /> : <Save size={16} className="lg:w-[18px]" />}
                     <span>{isSaving ? "Saving..." : "Publish"}</span>
                  </button>

                  <button
                     onClick={handleLogout}
                     className="w-12 h-12 lg:w-14 lg:h-14 bg-red-50 text-red-500 rounded-xl lg:rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                     title="Sign Out"
                  >
                     <LogOut size={20} />
                  </button>
               </div>
            </header>

            <div className="p-6 lg:p-12 max-w-6xl mx-auto pb-32">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.4 }}
                     className="space-y-10"
                  >

                     {/* Hero Settings */}
                     {activeTab === "hero" && (
                        <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 lg:space-y-10">
                           <div className="space-y-3">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Main Landing Header</label>
                              <input
                                 type="text"
                                 value={data.hero?.title || ""}
                                 onChange={(e) => handleChange("hero", "title", e.target.value)}
                                 className="w-full bg-gray-50 border-none rounded-3xl px-8 py-6 text-2xl font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                              />
                           </div>

                           <div className="grid md:grid-cols-2 gap-10 pt-4">
                              <div className="space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Hero Background Image</label>
                                 <div className="relative aspect-[16/6] rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group">
                                    {data.hero?.image ? (
                                       <Image src={data.hero.image} alt="Hero" fill className="object-cover" />
                                    ) : (
                                       <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                                    )}
                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all cursor-pointer flex items-center justify-center">
                                       <label className="cursor-pointer bg-white/90 p-4 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Upload className="text-blue-600" />
                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "hero", "image")} />
                                       </label>
                                    </div>
                                 </div>
                                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center">Recommended: 1920x800 Wide Image</p>
                              </div>
                              <div className="space-y-3 flex flex-col justify-center">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Banner Description</label>
                                 <textarea
                                    rows={5}
                                    value={data.hero?.subtitle || ""}
                                    onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-3xl px-8 py-6 font-bold text-gray-500 leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                                 />
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === "services" && (
                        <div className="space-y-8">
                           <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 mb-4 gap-4">
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Core Services</h3>
                              <button
                                 onClick={() => addItem("services", { image: "", title: "New Service", description: "Service details..." })}
                                 className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Plus size={18} />
                                 <span>Inject Service</span>
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {data.services?.map((service: any, i: number) => (
                                 <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group text-center">
                                    <button
                                       onClick={() => removeItem("services", i)}
                                       className="absolute -top-3 -right-3 w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500 hover:text-white z-10"
                                    >
                                       <X size={18} />
                                    </button>

                                    <div className="relative w-40 h-40 mx-auto rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 mb-6 group/pic">
                                       {service.image ? (
                                          <Image src={service.image} alt={service.title} fill className="object-cover" />
                                       ) : (
                                          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                             <ImageIcon size={40} />
                                          </div>
                                       )}
                                       <label className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                          <Camera className="text-white" size={24} />
                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "services", i.toString(), "image")} />
                                       </label>
                                    </div>

                                    <div className="space-y-4">
                                       <input
                                          type="text"
                                          placeholder="Service Title"
                                          value={service.title}
                                          onChange={(e) => handleItemChange("services", i, "title", e.target.value)}
                                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-black text-gray-900 outline-none text-center"
                                       />
                                       <textarea
                                          placeholder="Describe service..."
                                          value={service.description}
                                          onChange={(e) => handleItemChange("services", i, "description", e.target.value)}
                                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-400 text-sm outline-none resize-none text-center"
                                          rows={3}
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* About Section Settings */}
                     {activeTab === "about" && (
                        <div className="space-y-10">
                           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-6">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Overall Section Title</label>
                              <input
                                 type="text"
                                 value={data.about?.title || ""}
                                 onChange={(e) => handleChange("about", "title", e.target.value)}
                                 className="w-full bg-gray-50 border-none rounded-2xl px-8 py-5 text-xl font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                              />
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mt-4">Section Introduction</label>
                              <textarea
                                 value={data.about?.description || ""}
                                 onChange={(e) => handleChange("about", "description", e.target.value)}
                                 className="w-full bg-gray-50 border-none rounded-2xl px-8 py-5 font-bold text-gray-500 focus:bg-white outline-none"
                                 rows={3}
                              />
                           </div>

                           {/* Sub-sections Grid */}
                           <div className="grid grid-cols-1 gap-8">
                              {["whoWeAre", "mission", "vision"].map((sub) => (
                                  <div key={sub} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm grid md:grid-cols-3 gap-8 items-start">
                                     <div className="md:col-span-1">
                                        <h4 className="text-lg font-black text-blue-600 mb-4 capitalize">{sub.replace(/([A-Z])/g, " $1")}</h4>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group cursor-pointer">
                                           {data.about?.[sub]?.image ? (
                                              <Image src={data.about[sub].image} alt={sub} fill className="object-cover" />
                                           ) : (
                                              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
                                                 <ImageIcon size={28} />
                                                 <span className="text-[9px] font-black uppercase tracking-widest">No Image</span>
                                              </div>
                                           )}
                                           <label className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all flex items-center justify-center cursor-pointer">
                                              <span className="bg-white/90 px-3 py-2 rounded-xl shadow-lg text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                 <Upload size={12} /> Change
                                              </span>
                                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "about", sub, "image")} />
                                           </label>
                                        </div>
                                     </div>
                                     <div className="md:col-span-2 space-y-4">
                                        <input
                                           type="text"
                                           placeholder="Feature Title"
                                           value={data.about?.[sub]?.title || ""}
                                           onChange={(e) => handleNestedChange("about", sub, "title", e.target.value)}
                                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-black text-gray-900 outline-none"
                                        />
                                        <textarea
                                           placeholder="Feature Narrative"
                                           value={data.about?.[sub]?.description || ""}
                                           onChange={(e) => handleNestedChange("about", sub, "description", e.target.value)}
                                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-400 text-sm outline-none resize-none"
                                           rows={5}
                                        />
                                     </div>
                                  </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Portfolio Settings */}
                     {activeTab === "projects" && (
                        <div className="space-y-8">
                           <div className="flex justify-between items-center bg-white p-8 px-12 rounded-[2.5rem] border border-gray-100 mb-4">
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Project Catalog</h3>
                              <button
                                 onClick={() => addItem("projects", { image: "", title: "New Project", location: "Mumbai", type: "Residential", status: "Ongoing" })}
                                 className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Plus size={18} />
                                 <span>Append Entry</span>
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {data.projects?.map((project: any, i: number) => (
                                 <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                                    <button
                                       onClick={() => removeItem("projects", i)}
                                       className="absolute -top-3 -right-3 w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500 hover:text-white z-10"
                                    >
                                       <X size={18} />
                                    </button>

                                    <div className="flex flex-col space-y-5">
                                       <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer group/img">
                                          {project.image ? (
                                             <Image src={project.image} alt="Project" fill className="object-cover" />
                                          ) : (
                                             <div className="absolute inset-0 flex items-center justify-center text-gray-200"><ImageIcon size={32} /></div>
                                          )}
                                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                             <Upload className="text-white" />
                                             <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                handleFileUpload(e, "projects", i.toString(), "image");
                                             }} />
                                          </label>
                                       </div>
                                       <div className="space-y-3">
                                          <input
                                             type="text"
                                             value={project.title}
                                             onChange={(e) => handleItemChange("projects", i, "title", e.target.value)}
                                             className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 font-black text-gray-900 outline-none focus:bg-white"
                                             placeholder="Project Name"
                                          />
                                          <div className="grid grid-cols-2 gap-3">
                                             <input
                                                type="text"
                                                value={project.location}
                                                onChange={(e) => handleItemChange("projects", i, "location", e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 font-bold text-gray-400 text-xs outline-none"
                                                placeholder="Location"
                                             />
                                             <select
                                                value={project.type}
                                                onChange={(e) => handleItemChange("projects", i, "type", e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 font-bold text-gray-400 text-xs outline-none appearance-none"
                                             >
                                                <option>Residential</option>
                                                <option>Commercial</option>
                                                <option>Infrastructure</option>
                                             </select>
                                          </div>
                                          <select
                                             value={project.status}
                                             onChange={(e) => handleItemChange("projects", i, "status", e.target.value)}
                                             className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 font-black text-blue-600 text-xs outline-none appearance-none"
                                          >
                                             <option>Ongoing</option>
                                             <option>Upcoming</option>
                                             <option>Completed Projects</option>
                                          </select>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Team Settings */}
                     {activeTab === "team" && (
                        <div className="space-y-8">
                           <div className="flex justify-between items-center bg-white p-8 px-12 rounded-[2.5rem] border border-gray-100 mb-4">
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Staffing Configuration</h3>
                              <button
                                 onClick={() => addItem("team", { image: "", name: "New Member", role: "Specialist", experience: "5+ Years", rating: 5.0 })}
                                 className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Plus size={18} />
                                 <span>Onboard Member</span>
                              </button>
                           </div>

                           <div className="grid md:grid-cols-3 gap-8">
                              {data.team?.map((member: any, i: number) => (
                                 <div key={i} className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm relative group">
                                    <button
                                       onClick={() => removeItem("team", i)}
                                       className="absolute -top-2 -right-2 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white z-10"
                                    >
                                       <Trash2 size={14} />
                                    </button>
                                    <div className="flex flex-col items-center space-y-6">
                                       <div className="w-28 h-28 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group/pic cursor-pointer shadow-sm">
                                          {member.image ? (
                                             <Image src={member.image} alt={member.name} fill className="object-cover" />
                                          ) : (
                                             <User className="text-gray-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={40} />
                                          )}
                                          <label className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                             <Camera className="text-white" size={20} />
                                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "team", i.toString(), "image")} />
                                          </label>
                                       </div>
                                       <div className="w-full space-y-3">
                                          <input
                                             type="text"
                                             value={member.name}
                                             onChange={(e) => handleItemChange("team", i, "name", e.target.value)}
                                             className="w-full text-center bg-gray-50 border-none rounded-xl py-3 font-black text-gray-900 text-sm outline-none"
                                          />
                                          <input
                                             type="text"
                                             value={member.role}
                                             onChange={(e) => handleItemChange("team", i, "role", e.target.value)}
                                             className="w-full text-center bg-transparent border-none rounded-xl py-1 font-bold text-blue-600 text-[10px] uppercase tracking-widest outline-none"
                                          />
                                          <div className="grid grid-cols-2 gap-2 pt-2">
                                             <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center">
                                                <Briefcase size={12} className="text-gray-300 mb-1" />
                                                <input
                                                   type="text"
                                                   value={member.experience}
                                                   onChange={(e) => handleItemChange("team", i, "experience", e.target.value)}
                                                   className="w-full text-center bg-transparent border-none text-[9px] font-black text-gray-400 outline-none"
                                                />
                                             </div>
                                             <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center">
                                                <Star size={12} className="text-yellow-400 mb-1" />
                                                <input
                                                   type="number"
                                                   step="0.1"
                                                   value={member.rating}
                                                   onChange={(e) => handleItemChange("team", i, "rating", e.target.value)}
                                                   className="w-full text-center bg-transparent border-none text-[9px] font-black text-gray-400 outline-none"
                                                />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                     {/* Inquiries (Messages) - Kept mostly same but updated theme */}

                     {activeTab === "messages" && (
                        <div className="space-y-8">
                           {messages.length === 0 ? (
                              <div className="bg-white p-24 rounded-[4rem] border border-gray-100 text-center shadow-sm">
                                 <MessageSquare className="mx-auto text-gray-100 mb-8" size={80} />
                                 <h3 className="text-2xl font-black text-gray-300 tracking-tighter">Communication Queue Empty</h3>
                                 <p className="text-xs font-bold text-gray-200 uppercase tracking-widest mt-2">Zero Active Inquiries</p>
                              </div>
                           ) : (
                              messages.map((msg, idx) => (
                                 <motion.div
                                    key={idx}
                                    className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:ring-2 hover:ring-blue-500/5 transition-all"
                                 >
                                    <div className="flex flex-wrap justify-between items-start gap-6 mb-8 pb-8 border-b border-gray-50">
                                       <div className="flex items-center space-x-5">
                                          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                                             <User size={28} />
                                          </div>
                                          <div>
                                             <h3 className="text-2xl font-black text-gray-900 tracking-tight">{msg.name}</h3>
                                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                                          </div>
                                       </div>
                                       <div className="flex space-x-3">
                                          <button onClick={() => handleDeleteMessage(msg._id)} className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                                          <a href={`mailto:${msg.email}`} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20">Reply</a>
                                       </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10">
                                       <div className="space-y-4">
                                          <div className="bg-gray-50 p-6 rounded-3xl">
                                             <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-2">Message Intent</label>
                                             <p className="text-blue-600 font-black text-lg">{msg.subject}</p>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                             <div className="bg-gray-50 p-6 rounded-3xl">
                                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Email</label>
                                                <p className="text-gray-900 font-bold text-xs truncate">{msg.email}</p>
                                             </div>
                                             <div className="bg-gray-50 p-6 rounded-3xl">
                                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Phone</label>
                                                <p className="text-gray-900 font-bold text-xs">{msg.phone}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="bg-gray-50 p-8 rounded-3xl">
                                          <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-4">Detailed Inquiry</label>
                                          <p className="text-sm font-bold text-gray-500 leading-relaxed italic">&quot;{msg.message}&quot;</p>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))
                           )}
                        </div>
                     )}

                     {activeTab === "footer" && (
                        <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                           <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><SlidersHorizontal size={24} /></div>
                              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Footer Branding</h3>
                           </div>

                           <div className="grid md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                 <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Footer Description</label>
                                    <textarea
                                       rows={4}
                                       value={data.footer?.description || ""}
                                       onChange={(e) => handleChange("footer", "description", e.target.value)}
                                       className="w-full bg-gray-50 border-none rounded-3xl px-8 py-6 font-bold text-sm text-gray-500 leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                                    />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                                       <div key={social} className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">{social}</label>
                                          <input
                                             type="text"
                                             value={data.footer?.[social] || ""}
                                             onChange={(e) => handleChange("footer", social, e.target.value)}
                                             className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-gray-900 focus:bg-white transition-all outline-none"
                                             placeholder="#"
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Footer Background Asset</label>
                                 <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group">
                                    {data.footer?.bgImage ? (
                                       <Image src={data.footer.bgImage} alt="Footer BG" fill className="object-cover brightness-50" />
                                    ) : (
                                       <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                                    )}
                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all cursor-pointer flex items-center justify-center">
                                       <label className="cursor-pointer bg-white/90 p-4 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Upload className="text-blue-600" />
                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "footer", "bgImage")} />
                                       </label>
                                    </div>
                                 </div>
                                 <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center mt-2">Recommended: Dark Skyline Pattern</p>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === "profile" && (
                        <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-10">
                           <div className="flex flex-col items-center">
                              <div className="w-40 h-40 rounded-[3rem] bg-gray-50 border-2 border-dashed border-gray-200 relative group overflow-hidden shadow-sm">
                                 {data.adminProfile?.profilePic ? (
                                    <Image src={data.adminProfile.profilePic} alt="Admin" fill className="object-cover" />
                                 ) : (
                                    <Camera className="text-gray-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={48} />
                                 )}
                                 <label className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                                    <Upload className="text-white" size={28} />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "adminProfile", "profilePic")} />
                                 </label>
                              </div>
                              <h3 className="text-2xl font-black text-gray-900 mt-6 tracking-tighter">Security & Profile</h3>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-2">Personal Management</p>
                           </div>

                           <div className="grid md:grid-cols-2 gap-8 pt-6">
                              <div className="md:col-span-2 space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Global Branding (Site Name)</label>
                                 <input
                                    type="text"
                                    value={data.site?.siteName || ""}
                                    onChange={(e) => handleChange("site", "siteName", e.target.value)}
                                    className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-6 py-4 font-black text-blue-600 outline-none focus:bg-white transition-all"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Display Identity</label>
                                 <input
                                    type="text"
                                    value={data.adminProfile?.name || ""}
                                    onChange={(e) => handleChange("adminProfile", "name", e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 outline-none"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Digital Signature (Email)</label>
                                 <input
                                    type="email"
                                    value={data.adminProfile?.email || ""}
                                    onChange={(e) => handleChange("adminProfile", "email", e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 outline-none"
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-3">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Update Security Key</label>
                                 <input
                                    type="password"
                                    placeholder="Enter new credential key..."
                                    onChange={(e) => handleChange("adminProfile", "password", e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-gray-900 outline-none"
                                 />
                              </div>
                           </div>
                        </div>
                     )}

                  </motion.div>
               </AnimatePresence>
            </div>
         </main>

         {cropData && (
            <CropModal
               image={cropData.image}
               onCropComplete={handleCropComplete}
               onClose={() => setCropData(null)}
               aspect={
                  cropData.section === "hero" ? 16 / 6 : 
                  cropData.section === "services" ? 1 / 1 :
                  cropData.section === "projects" ? 4 / 3 :
                  cropData.field === "profilePic" ? 1 / 1 : 16 / 9
               }
            />
         )}
      </div>
   );
}
