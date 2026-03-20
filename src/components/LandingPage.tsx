"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import {
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  CheckCircle2,
  Building2,
  Search,
  SlidersHorizontal,
  Star,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import Input from "./ui/Input";

export default function LandingPage({ initialData }: { initialData: any }) {
  const data = initialData || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim() || value.trim().length < 2) error = "Please enter a valid name";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Please enter a valid email address";
        break;
      case "phone":
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
          error = "Contact number must be exactly 10 digits";
        } else if (/^[1-4]/.test(cleanPhone)) {
          error = "Invalid format. Start with 5-9";
        }
        break;
      case "subject":
        if (!value.trim() || value.trim().length < 3) error = "Min 3 characters";
        break;
      case "message":
        if (!value.trim() || value.trim().length < 10) error = "Min 10 characters";
        break;
    }
    setErrors((prev: Record<string, string>) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = Object.keys(formData).every(key => 
      validateField(key, formData[key as keyof typeof formData])
    );

    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone: formData.phone.replace(/\D/g, "") }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Services data
  const services = data.services || [
    {
      image: "/luxury_villa.png",
      title: "Luxury Villa",
      description: "Premium modern villa construction with high-quality materials and elegant architectural design."
    },
    {
      image: "/modern_office.png",
      title: "Modern Office Building",
      description: "Contemporary office spaces designed for functionality, efficiency, and modern business needs."
    },
    {
      image: "/apartment_complex.png",
      title: "Apartment Complex",
      description: "Large residential apartment projects with comfortable living spaces and modern amenities."
    }
  ];

  // Projects data
  const allProjects = data.projects || [
    {
      image: "/project_residential.png",
      title: "Modern Residential Complex",
      location: "Pune",
      type: "Residential",
      status: "Completed Projects",
    },
    {
      image: "/project_suburban.png",
      title: "Luxury Suburban Villas",
      location: "Pune",
      type: "Commercial",
      status: "Completed Projects",
    },
    {
      image: "/project_retail.png",
      title: "Retail Shopping Center",
      location: "Pune",
      type: "Infrastructure",
      status: "Ongoing",
    },
    {
      image: "/upcoming_project_1.png",
      title: "Sustainable Glass Towers",
      location: "Mumbai",
      type: "Residential",
      status: "Upcoming",
    },
    {
      image: "/upcoming_project_2.png",
      title: "Smart Valley Villa",
      location: "Lonavala",
      type: "Residential",
      status: "Upcoming",
    },
    {
      image: "/completed_project_extra.png",
      title: "Metro Plaza HQ",
      location: "Pune",
      type: "Commercial",
      status: "Completed Projects",
    },
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

  const filteredProjects = allProjects.filter((p: any) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.type.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.type === selectedCategory ||
      p.status === selectedCategory;

    return matchesSearch && matchesCategory;
  }).slice(0, 6);

  // Team data
  const team = data.team || [
    {
      image: "/team_member_1.png",
      name: "Rajesh Sharma",
      role: "Chief Engineer",
      experience: "15+ Years",
      rating: 4.9,
    },
    {
      image: "/team_member_2.png",
      name: "Anita Patil",
      role: "Lead Architect",
      experience: "12+ Years",
      rating: 4.8,
    },
    {
      image: "/team_member_3.png",
      name: "Vikram Mehta",
      role: "Project Manager",
      experience: "10+ Years",
      rating: 4.7,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <Navbar navData={data} onCategorySelect={setSelectedCategory} />

      {/* ───────────────────────── HERO SECTION ───────────────────────── */}
      {/* ───────────────────────── HERO SECTION ───────────────────────── */}
      <section
        id="home"
        className="relative bg-white"
      >
        {/* Full Viewport Background Area */}
        <div className="relative h-screen min-h-[700px] w-full overflow-hidden">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0 bg-[#f8fafc]">
            <Image
              src={data.hero?.image || "/hero_replica_bg.png"}
              alt="Hero Background"
              fill
              className="object-cover object-top scale-110 lg:scale-100 transition-transform duration-1000"
              priority
            />

            {/* Blue Geometric Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-10 -right-10 w-96 h-96 opacity-40">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#2563eb]" strokeWidth="0.5">
                  <path d="M 100,0 L 0,100 M 100,20 L 20,100 M 100,40 L 40,100" />
                </svg>
              </div>
              <div className="absolute bottom-10 -right-20 w-80 h-80 opacity-60">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#2563eb]" strokeWidth="1" fill="none">
                  <path d="M 100,100 L 0,0 M 100,70 L 30,0" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Layer (Fold 1) */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex justify-end items-start pt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-sm bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 mr-0 md:mr-4"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#2563eb] leading-[1.3] mb-6 tracking-tight">
                {data.hero?.title || "Build Your Dream Home with Trusted Construction Experts."}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mb-10 leading-relaxed font-medium">
                {data.hero?.subtitle || "We provide high-quality residential and commercial construction services with experienced engineers and modern technology."}
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="#projects"
                  className="w-full py-3.5 bg-[#4285f4] text-white hover:bg-[#3b71db] font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 transform text-center"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="w-full py-3.5 bg-white text-[#4285f4] font-extrabold text-xs rounded-xl transition-all border-2 border-[#4285f4]/30 hover:bg-[#f0f7ff] active:scale-95 transform text-center"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ───────────────────── HIGH-QUALITY CONSTRUCTION SERVICES (Part of Hero) ───────────────────── */}
        <div className="relative z-10 bg-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-5">
                High-Quality Construction Services
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-xs md:text-sm font-medium leading-relaxed">
                With over 15 years of experience, we specialize in residential and
                commercial projects, delivering superior quality and craftsmanship
                that stand the test of time.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {services.map((service: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col transition-all duration-500"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-black mb-3 group-hover:text-[#2563eb] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-8 flex-1">
                      {service.description}
                    </p>
                    <a
                      href="#projects"
                      className="w-full py-4 bg-[#4285f4] text-white font-bold text-xs rounded-xl hover:bg-[#3b71db] transition-all text-center shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      View All Projects
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ABOUT & TEAM SECTION ───────────────────────── */}
      <div id="about">
        <section className="pt-16 pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <p className="text-[#2563eb] font-black text-[10px] uppercase tracking-[0.4em] mb-4">
              Our Core
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {data.about?.title || "About Sairaj Spaces"}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg font-medium leading-relaxed">
              {data.about?.description || "Excellence and durability built into every structure, designed to transform your vision into a living reality."}
            </p>
          </motion.div>

          <div className="space-y-20">
            {/* 01. WHO WE ARE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 flex justify-center lg:justify-start"
              >
                <div className="relative group animate-float">
                  <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] -z-10 rotate-3 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="relative z-10 w-[300px] sm:w-[450px] lg:w-[520px] h-72 sm:h-80 lg:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image
                      src={data.about?.whoWeAre?.image || "/who_we_are.png"}
                      alt="Who we are"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <p className="text-[#2563eb] font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                  01. Who We Are
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight uppercase">
                  {data.about?.whoWeAre?.title || "Excellence in Construction"}
                </h3>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-medium max-w-xl border-l-4 border-blue-100 pl-8">
                  <p>
                    {data.about?.whoWeAre?.description || "Sairaj Spaces is a professional construction company with extensive experience in building residential homes, commercial buildings, and infrastructure projects."}
                  </p>
                  <p>
                    We are committed to delivering high-quality construction services while maintaining safety, transparency, and customer satisfaction.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 02. OUR MISSION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-1"
              >
                <p className="text-[#2563eb] font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                  02. Our Mission
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight uppercase">
                  {data.about?.mission?.title || "Building with Purpose"}
                </h3>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-medium max-w-xl border-l-4 border-blue-100 pl-8">
                  <p>
                    {data.about?.mission?.description || "Our mission is to build strong, safe, and modern structures that improve the quality of life for our clients and communities."}
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-2 flex justify-center lg:justify-end"
              >
                <div className="relative group animate-float">
                  <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] -z-10 -rotate-3 group-hover:-rotate-6 transition-transform duration-500" />
                  <div className="relative z-10 w-[300px] sm:w-[450px] lg:w-[520px] h-72 sm:h-80 lg:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image
                      src={data.about?.mission?.image || "/mission_house.png"}
                      alt="Our Mission"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 03. OUR VISION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 flex justify-center lg:justify-start"
              >
                <div className="relative group animate-float">
                  <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] -z-10 rotate-2 group-hover:rotate-4 transition-transform duration-500" />
                  <div className="relative z-10 w-[300px] sm:w-[450px] lg:w-[520px] h-72 sm:h-80 lg:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image
                      src={data.about?.vision?.image || "/vision_blueprint.png"}
                      alt="Our Vision"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <p className="text-[#2563eb] font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                  03. Our Vision
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight uppercase">
                  {data.about?.vision?.title || "Leading the Future"}
                </h3>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-medium max-w-xl border-l-4 border-blue-100 pl-8">
                  <p>
                    {data.about?.vision?.description || "Our vision is to become a globally trusted construction leader known for quality, innovation, and reliability."}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── EXPERT TEAM SECTION ───────────────────────── */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Our Expert Team
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-medium">
              Meet the dedicated professionals who bring your construction
              dreams to life with skill, passion, and expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <div className="relative h-72 overflow-hidden bg-gray-50">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-gray-900 mb-1">
                    {member.name}
                  </h4>
                  <p className="text-[#2563eb] font-bold text-sm mb-4">
                    {member.role}
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-400 font-bold">
                    <span className="flex items-center gap-2">
                      <Briefcase size={14} className="text-[#2563eb]" />
                      {member.experience}
                    </span>
                    <span className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      {member.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>

      {/* ───────────────────────── PROJECTS SECTION ───────────────────────── */}
      <section id="projects" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2563eb] mb-3">
              Our Projects
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
              We have successfully completed a wide range of construction
              projects, delivering quality and excellence in every build.
            </p>
          </motion.div>

          {/* Search Bar + Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-4 border-2 border-[#2563eb]/40 rounded-xl bg-white shadow-sm p-2">
              <Input
                label="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                leftIcon={<Search size={18} />}
                className="bg-transparent border-none ring-0 shadow-none !min-h-0"
              />

              {/* Dropdown Filter */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#eff6ff] text-[#2563eb] transition-all hover:bg-blue-100 shrink-0"
                  aria-label="Filter projects"
                  title={`Filter: ${selectedCategory}`}
                >
                  <SlidersHorizontal size={20} className={isFilterOpen ? "rotate-90" : ""} />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-full md:w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-20"
                    >
                      {projectCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm transition-colors border-l-4 ${selectedCategory === cat
                            ? "bg-[#eff6ff] text-[#2563eb] border-[#2563eb] font-bold"
                            : "text-gray-600 hover:bg-gray-50 border-transparent font-medium"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Project Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProjects.map((project: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={13} className="text-[#2563eb]" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Building2 size={13} className="text-[#2563eb]" />
                      <span>{project.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={13} className="text-[#2563eb]" />
                      <span>{project.status}</span>
                    </div>
                  </div>
                  <a
                    href="#projects"
                    className="w-full block text-center py-3 bg-[#2563eb] text-white font-semibold text-sm rounded-lg hover:bg-[#1d4ed8] transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    View All Projects
                  </a>
                </div>
              </motion.div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                No projects found for &quot;{selectedCategory !== "All" ? selectedCategory : projectSearch}&quot;
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CONTACT SECTION ───────────────────────── */}
      <section id="contact" className="py-16 bg-gray-100 relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <p className="text-[#2563eb] font-semibold uppercase tracking-widest text-xs mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Contact Us
            </h2>
            <div className="w-20 h-1.5 bg-[#2563eb] mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              <div className="bg-white p-8 md:p-10 rounded-[32px] border-l-4 border-[#2563eb] shadow-xl h-full flex flex-col justify-center">
                <div className="space-y-8">
                  <div className="flex items-center space-x-5 group">
                    <div className="w-12 h-12 bg-[#2563eb] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      <Phone size={22} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                        Direct Line
                      </p>
                      <p className="text-gray-900 text-lg font-bold">
                        {data.contact?.number || "+91 98765 43210"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#2563eb] border border-gray-100 group-hover:bg-blue-50 transition-all shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-900 text-sm font-bold truncate max-w-[180px]">
                        {data.contact?.email || "info@sairajspaces.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#2563eb] border border-gray-100 group-hover:bg-blue-50 transition-all shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                        Location
                      </p>
                      <p className="text-gray-900 font-bold leading-snug text-sm">
                        {data.location?.address ||
                          "123 Construction Street, Pune"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                    Ready to build your dream space? Let&apos;s connect.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <div className="bg-white p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-xl">
                <form
                  onSubmit={handleContactSubmit}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                  <Input
                    label="Full Name"
                    required
                    maxLength={100}
                    value={formData.name}
                    error={errors.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      validateField("name", e.target.value);
                    }}
                  />
                  </div>
                  <div className="space-y-2">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      validateField("email", e.target.value);
                    }}
                  />
                  </div>
                  <div className="space-y-2">
                  <Input
                    label="Contact Number"
                    type="tel"
                    required
                    maxLength={15}
                    value={formData.phone}
                    error={errors.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      validateField("phone", e.target.value);
                    }}
                  />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Subject"
                      required
                      maxLength={200}
                      value={formData.subject}
                      error={errors.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        validateField("subject", e.target.value);
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Your Message"
                      multiline
                      rows={4}
                      required
                      value={formData.message}
                      error={errors.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        validateField("message", e.target.value);
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-base transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-3 group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <CheckCircle2
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
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

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="relative pt-12 pb-10 bg-[#040c14] overflow-hidden">
        {/* City Skyline Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={data.footer?.bgImage || "/footer_city_bg_v2.jpg"}
            alt="City Skyline"
            fill
            className="object-center object-cover brightness-[0.15] scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040c14] via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Column 1: Brand Info */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white tracking-tight">
                Sairaj Spaces
              </h3>
              <p className="text-white/70 leading-relaxed text-sm max-w-[320px]">
                Where ideas turn into immersive digital spaces. <br />
                At Sairaj Spaces, we design, build, and elevate your online
                presence.
              </p>
              <div className="flex space-x-6">
                <a
                  href={data.footer?.instagram || "#"}
                  className="text-white/60 hover:text-sky-400 transition-colors"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href={data.footer?.twitter || "#"}
                  className="text-white/60 hover:text-sky-400 transition-colors"
                >
                  <Twitter size={22} />
                </a>
                <a
                  href={data.footer?.facebook || "#"}
                  className="text-white/60 hover:text-sky-400 transition-colors"
                >
                  <Facebook size={22} />
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-sky-400 transition-colors"
                >
                  <MessageCircle size={22} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#home"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white">Contact Us</h4>
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400 hover:border-sky-400 transition-colors shrink-0">
                    <MapPin size={18} />
                  </div>
                  <p className="text-white/70 text-sm leading-snug">
                    123 Construction Street Pune, <br />
                    Maharashtra, India
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400 hover:border-sky-400 transition-colors shrink-0">
                    <Mail size={18} />
                  </div>
                  <p className="text-white/70 text-sm">
                    {data.contact?.email || "info@sairajspaces.com"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400 hover:border-sky-400 transition-colors shrink-0">
                    <Phone size={18} />
                  </div>
                  <p className="text-white/70 text-sm">
                    {data.contact?.number || "+91 98765 43210"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Sairaj Spaces. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
