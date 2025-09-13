import React from "react"
import { Link } from "react-router-dom"
import { Users, FileText, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Government Administration Portal
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Efficient Civic
            <span className="text-indigo-600">Administration Hub</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive complaint management system designed for government officials. Track, manage, and resolve civic issues with advanced administrative tools and role-based access control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition">
                Official Login
              </button>
            </Link>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Administrative Excellence
            </h3>
            <p className="text-gray-600 text-lg">
              Role-based access with powerful management capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Citizens Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Citizens
              </h4>
              <p className="text-gray-600 mb-4">
                Easy complaint submission with photo uploads and location
                tracking
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Real-time photo uploads</li>
                <li>• Automatic location tagging</li>
                <li>• Status tracking</li>
              </ul>
            </div>

            {/* Department Officials Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Department Officials
              </h4>
              <p className="text-gray-600 mb-4">
                View and manage assigned complaints with status updates
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• View assigned complaints</li>
                <li>• Update complaint status</li>
                <li>• Track working problems</li>
              </ul>
            </div>

            {/* Head Officials Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Head Officials
              </h4>
              <p className="text-gray-600 mb-4">
                Full administrative control with advanced management features
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Flag complaints</li>
                <li>• Modify complaint status</li>
                <li>• Create employee accounts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
