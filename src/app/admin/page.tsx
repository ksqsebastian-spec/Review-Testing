"use client";

import { useEffect, useState } from "react";
import {
  Business,
  getBusinesses,
  addBusiness,
  updateBusiness,
  removeBusiness,
  saveBusinesses,
} from "@/lib/businesses";

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formLink, setFormLink] = useState("");

  // Load businesses on mount
  useEffect(() => {
    setBusinesses(getBusinesses());
  }, []);

  const refreshBusinesses = () => {
    setBusinesses(getBusinesses());
  };

  const handleAdd = () => {
    if (!formName.trim()) return;

    addBusiness({
      name: formName.trim(),
      googleReviewLink: formLink.trim(),
      category: "Construction",
    });

    setFormName("");
    setFormLink("");
    setShowAddForm(false);
    refreshBusinesses();
  };

  const handleEdit = (business: Business) => {
    setEditingId(business.id);
    setFormName(business.name);
    setFormLink(business.googleReviewLink);
  };

  const handleSaveEdit = () => {
    if (!editingId || !formName.trim()) return;

    updateBusiness(editingId, {
      name: formName.trim(),
      googleReviewLink: formLink.trim(),
    });

    setEditingId(null);
    setFormName("");
    setFormLink("");
    refreshBusinesses();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setFormLink("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this business?")) {
      removeBusiness(id);
      refreshBusinesses();
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove ALL businesses? This cannot be undone.")) {
      saveBusinesses([]);
      refreshBusinesses();
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your businesses for quick reviews
          </p>
        </div>

        {/* Add Business Button */}
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Business
          </button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., ABC Construction"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Review Link
                </label>
                <input
                  type="text"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="Paste Google review URL here"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Find this by searching your business on Google → Click "Write a review" → Copy the URL
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!formName.trim()}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Business
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="py-3 px-6 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Business List */}
        <div className="space-y-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {editingId === business.id ? (
                // Edit Mode
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Review Link
                    </label>
                    <input
                      type="text"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="Paste Google review URL here"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      disabled={!formName.trim()}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="py-3 px-6 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {business.name}
                    </h3>
                    {business.googleReviewLink ? (
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Google link configured
                      </p>
                    ) : (
                      <p className="text-sm text-orange-500 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No Google link yet
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(business)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(business.id)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {businesses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p>No businesses added yet</p>
            <p className="text-sm mt-1">Click "Add New Business" to get started</p>
          </div>
        )}

        {/* Actions */}
        {businesses.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear all businesses
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Back to Review Generator
          </a>
        </div>
      </div>
    </main>
  );
}
