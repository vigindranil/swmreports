"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Trash2,
  Route,
  Leaf,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function JalpaiguriWasteManagement() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image gallery data
  const galleryImages = [
    {
      id: 1,
      title: "Smart Bin Installation | স্মার্ট বিন ইনস্টলেশন",
      src: "/img/1.jpeg",
    },
    {
      id: 2,
      title: "Waste Collection Drive | বর্জ্য সংগ্রহ কার্যক্রম",
      src: "/img/2.jpeg",
    },
    {
      id: 3,
      title: "Recycling Center | পুনর্ব্যবহার কেন্দ্র",
      src: "/img/3.jpeg",
    },
    {
      id: 4,
      title: "Awareness Program | জনসচেতনতা কর্মসূচি",
      src: "/img/4.jpeg",
    },
    {
      id: 5,
      title: "Cleanliness Campaign | পরিচ্ছন্নতা অভিযান",
      src: "/img/5.jpeg",
    },
    {
      id: 6,
      title: "Community Collection | কমিউনিটি সংগ্রহ",
      src: "/img/6.jpeg",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Government Identity Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2"></div>

      {/* Header with Government Branding */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Top Government Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <div className="text-xs md:text-sm text-gray-600">
              <span className="font-semibold">Government of West Bengal</span> |
              District Administration Jalpaiguri
            </div>
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Skip to main content
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Screen Reader Access
              </a>
            </div>
          </div>

          {/* Logos Section - Four Logo Layout */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Left Side Logos */}
            <div className="absolute left-0 md:left-4 flex gap-3 md:gap-6">
              {/* Biswabangla Logo */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-40 md:h-40 overflow-hidden">
                  <img
                    src="/bb.png"
                    alt="Biswabangla Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Jalpaiguri Logo - Center (Larger) */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mx-auto">
                <img
                  src="/jalpaiguri.png"
                  alt="JD Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm md:text-base font-bold text-gray-800">
                  Jalpaiguri District
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  জলপাইগুড়ি জেলা
                </p>
              </div>
            </div>

            {/* Right Side Logos */}
            <div className="absolute right-0 md:right-4 flex gap-3 md:gap-6">
              {/* Swachh Bharat Logo */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-40 md:h-20 overflow-hidden">
                  <img
                    src="/sb.png" // Put swachh bharat logo inside public/sb.png
                    alt="Swachh Bharat Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Digital India Logo */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-40 md:h-20 overflow-hidden">
                  <img
                    src="/MissionLogov1.jpg" // Put digital india logo inside public/di.png
                    alt="Digital India Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-2">
              Smart Solid Waste Management System
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-blue-700 mb-2">
              স্মার্ট কঠিন বর্জ্য ব্যবস্থাপনা সিস্টেম
            </h2>
            <p className="text-base md:text-lg text-orange-600 font-medium">
              An Initiative of Jalpaiguri District | জলপাইগুড়ি জেলার একটি
              উদ্যোগ
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center justify-between bg-blue-900 -mx-4 px-4 py-3 md:rounded-lg">
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <a
                href="#home"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                Features
              </a>
              <a
                href="#map"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                Coverage Map
              </a>
              <a
                href="#about"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                Contact
              </a>
            </div>
            <button className="bg-orange-600 text-white px-5 py-2 rounded-md hover:bg-orange-700 transition shadow-md font-medium">
              <Link href="/login">Login</Link>
            </button>
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700 px-4 py-4">
            <a
              href="#home"
              className="block py-2 text-white hover:text-orange-400"
            >
              Home
            </a>
            <a
              href="#features"
              className="block py-2 text-white hover:text-orange-400"
            >
              Features
            </a>
            <a
              href="#map"
              className="block py-2 text-white hover:text-orange-400"
            >
              Coverage Map
            </a>
            <a
              href="#about"
              className="block py-2 text-white hover:text-orange-400"
            >
              About
            </a>
            <a
              href="#contact"
              className="block py-2 text-white hover:text-orange-400"
            >
              Contact
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Clean Jalpaiguri, Smart Jalpaiguri
            </h2>
            <p className="text-2xl md:text-3xl mb-6 text-orange-300 font-semibold">
              পরিচ্ছন্ন জলপাইগুড়ি, স্মার্ট জলপাইগুড়ি
            </p>
            <p className="text-lg md:text-xl mb-4 leading-relaxed">
              Revolutionizing waste management with intelligent solutions for a
              cleaner, greener future.
            </p>
            <p className="text-base md:text-lg mb-10 text-gray-200">
              আরও পরিচ্ছন্ন ও সবুজ ভবিষ্যতের জন্য বুদ্ধিমান সমাধান দিয়ে বর্জ্য
              ব্যবস্থাপনায় বিপ্লব ঘটাচ্ছি।
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-orange-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg text-lg">
                Get Started | শুরু করুন <ChevronRight size={22} />
              </button>
              <button className="bg-white text-blue-900 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-lg">
                Learn More | আরও জানুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                15,000+
              </div>
              <div className="text-gray-700">Households Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">250+</div>
              <div className="text-gray-700">Smart Bins Installed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-gray-700">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-700">Recycling Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Management Flow Diagram */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
        Waste Management Process
      </h2>
      <p className="text-lg text-gray-600">বর্জ্য ব্যবস্থাপনা প্রক্রিয়া</p>
      <p className="text-base text-gray-500 mt-1">
        From Collection to Processing | সংগ্রহ থেকে প্রক্রিয়াকরণ পর্যন্ত
      </p>
    </div>

    {/* === REPLACED WITH IMAGE === */}
    <div className="max-w-5xl mx-auto">
      <img
        src="/process1.png"  
        alt="Waste Management Process"
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
    {/* ========================== */}

  </div>
</section>


      {/* Image Gallery Section */}
      <section className="bg-white py-16">
        <div className="w-full px-0 md:px-4">
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Image Gallery
            </h2>
            <p className="text-lg text-gray-600">ছবির গ্যালারি</p>
            <p className="text-base text-gray-500 mt-1">
              Glimpses of Our Initiatives | আমাদের উদ্যোগের ঝলক
            </p>
          </div>

          <div className="relative w-full">
            {/* Main Image Display */}
            <div className="relative h-96 md:h-[500px] w-full rounded-none md:rounded-lg overflow-hidden shadow-none md:shadow-2xl">
              {galleryImages.map((image, index) => (
        
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.src}
                    className="w-full h-full object-cover"
                  />

                  {/* Optional title overlay */}
                  <div className="absolute bottom-0 w-full bg-black/40 text-white text-center py-3">
                    <p className="text-lg md:text-xl">{image.title}</p>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6 px-4">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section id="map" className="bg-gray-50 py-16">
        <div className="w-full px-0 md:px-4">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              কভারেজ ম্যাপ | Coverage Map
            </h2>
            <p className="text-gray-600">
              জলপাইগুড়ি জেলার বর্জ্য সংগ্রহ এলাকা | Jalpaiguri District Waste
              Collection Areas
            </p>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-xl overflow-hidden">
              <div className="w-full h-96 md:h-[500px] rounded-none md:rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1Nuz2ciRGatPDOQIKL5NlnD79xFoSRZM&usp=sharing"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="mt-8 p-6 mx-4 md:mx-0 bg-gradient-to-r from-green-50 to-blue-50 rounded-none md:rounded-lg border border-green-200">
              <p className="text-gray-700 text-center leading-relaxed">
                এই ইন্টারেক্টিভ ম্যাপ জলপাইগুড়ি জেলায় আমাদের বর্জ্য
                ব্যবস্থাপনা প্রকল্পের সমস্ত এলাকা প্রদর্শন করে। মার্কারগুলিতে
                ক্লিক করে প্রতিটি অবস্থানের বিস্তারিত তথ্য দেখুন।
                <br />
                <span className="text-sm text-gray-600">
                  This interactive map shows all areas covered by our waste
                  management system in Jalpaiguri District. Click on the markers
                  to view detailed information about each location.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              A Smarter Way to Manage Waste
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive digital platform revolutionizes solid waste
              management processes and improves sustainability across Jalpaiguri
              District.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 p-6 bg-green-50 rounded-lg hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Smart Bins
                </h3>
                <p className="text-gray-700">
                  IoT-enabled bins with fill-level sensors for optimized
                  collection schedules and efficient waste management.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-6 bg-blue-50 rounded-lg hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Route className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Route Optimization
                </h3>
                <p className="text-gray-700">
                  AI-powered route planning for efficient waste collection,
                  reduced fuel consumption, and lower emissions.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-6 bg-orange-50 rounded-lg hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-700">
                  Comprehensive dashboards and reports for data-driven decision
                  making and performance monitoring.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 p-6 bg-teal-50 rounded-lg hover:shadow-lg transition">
              <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Environmental Impact
                </h3>
                <p className="text-gray-700">
                  Track and reduce carbon footprint with our eco-friendly waste
                  management solutions and recycling programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-6xl text-blue-600">"</div>
              <div>
                <p className="text-lg text-gray-700 mb-6 italic">
                  The Smart Waste Management System has transformed our
                  district's waste management operations. We've achieved a 30%
                  reduction in collection costs and a significant improvement in
                  our recycling rates. The real-time data has been invaluable
                  for our decision-making process.
                </p>
                <div className="border-l-4 border-orange-600 pl-4">
                  <p className="font-bold text-gray-900">
                  Shri Raunak Agarwal, IAS
                  </p>
                  <p className="text-orange-600">
                  Additional District Magistrate(ZP), Jalpaiguri
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Waste Management in Your Area?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us in making Jalpaiguri cleaner and greener. Contact us for
            collaboration opportunities and citizen participation programs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Register Complaint
            </button>
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Contact District Office
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-orange-400">
                    About District
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400">
                    Swachh Bharat Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400">
                    Waste Collection Schedule
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400">
                    Citizen Charter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Information</h3>
              <p className="mb-2">District Magistrate Office</p>
              <p className="mb-2">Jalpaiguri, West Bengal - 735101</p>
              <p className="mb-2">Email: dm-jalpaiguri@gov.in</p>
              <p>Phone: 03561-225301</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Helpline</h3>
              <p className="text-2xl font-bold text-orange-400 mb-2">
                1800-XXX-XXXX
              </p>
              <p className="text-sm">(Toll Free - 24x7)</p>
              <p className="mt-4">
                For waste management queries and complaints
              </p>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 text-center">
            <p className="text-sm">
              © 2024 District Administration, Jalpaiguri. All rights reserved. |
              Developed under Digital India Initiative
            </p>
            <p className="text-xs mt-2">
              Last Updated: December 2024 | Visitors: 1,25,487
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
