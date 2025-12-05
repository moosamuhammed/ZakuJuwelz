import React from "react";
import { Twitter, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-16 border-t rounded-2xl border-gray-700 relative overflow-hidden">
      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600 opacity-20 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-600 opacity-20 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">Zaku</h2>
          <p className="mt-4 text-sm leading-6">
            Crafting modern, beautiful interfaces with passion and precision.
          </p>
          <div className="flex gap-4 mt-6 text-xl">
            <a href="#" className="hover:text-white transition flex items-center gap-1">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition flex items-center gap-1">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Projects</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition">Docs</a></li>
            <li><a href="#" className="hover:text-white transition">Community</a></li>
            <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
            <li><a href="#" className="hover:text-white transition">Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm leading-6 mb-4">
            Subscribe to our newsletter for new designs and components.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-12 relative z-10">
        © {new Date().getFullYear()} Zaku — All rights reserved.
      </div>
    </footer>
  );
}
