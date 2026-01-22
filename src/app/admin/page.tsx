"use client";

import { useState, useEffect } from "react";
import { businesses } from "@/lib/businesses";
import { Language, getLanguage, setLanguage, t } from "@/lib/translations";
import LanguageToggle from "@/components/LanguageToggle";

export default function AdminPage() {
  const [language, setLang] = useState<Language>("de");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLang(lang);
    setLanguage(lang);
  };

  const tr = t(language);

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tr.adminTitle}
          </h1>
          <p className="text-gray-600">
            Übersicht aller Unternehmen
          </p>
        </div>

        {/* Language Toggle */}
        <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Google Review Links hinzufügen
          </h3>
          <p className="text-blue-700 text-sm">
            Um Links hinzuzufügen, schicke mir die Links und ich füge sie ein.
            Oder bearbeite direkt die Datei: <code className="bg-blue-100 px-1 rounded">src/lib/businesses.ts</code>
          </p>
        </div>

        {/* Business List */}
        <div className="space-y-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-500">{business.category}</p>
                  {business.googleReviewLink ? (
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {tr.linkConfigured}
                    </p>
                  ) : (
                    <p className="text-sm text-orange-500 flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {tr.noLinkYet}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-mono">
                    {business.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            So findest du den Google Review Link
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Suche das Unternehmen auf Google</li>
            <li>Klicke auf "Rezension schreiben"</li>
            <li>Kopiere die URL aus der Adresszeile</li>
            <li>Schicke mir den Link oder trage ihn in <code className="bg-gray-100 px-1 rounded">businesses.ts</code> ein</li>
            <li>Nach dem Update: <code className="bg-gray-100 px-1 rounded">vercel --prod</code></li>
          </ol>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {tr.backToGenerator}
          </a>
        </div>
      </div>
    </main>
  );
}
