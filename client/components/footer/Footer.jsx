import { Mail, Phone, MapPin } from "lucide-react"
import Vaanilogo from "../../src/assets/vaanilogo1.png" 

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-10">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo + About */}
        <div className="" >
          <div className="w-28 h-14 mb-5 ml-5 flex justify-center text-center">
            <img
              src={Vaanilogo}
              alt="Civic Issues"
              className="w-full h-full object-contain"
            />
             <h1 className="text-4xl m-3">Vaani</h1>
          </div>
         
          <p className="text-sm">
            Empowering citizens to report civic issues and ensuring accountability
            through transparent complaint management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@civicissues.org
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">🐦</a>
            <a href="#" className="hover:text-white">📘</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Civic Issue Portal. All rights reserved.
      </div>
    </footer>
  )
}