'use client';

import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';

interface SettingItem {
  key: string;
  value: string;
  label: string;
}

const SETTING_LABELS: Record<string, string> = {
  site_name: 'Site Name',
  admin_email: 'Admin Email',
  items_per_page: 'Items Per Page',
  theme: 'Theme',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        const items = (data.settings || []).map((s: { key: string; value: string }) => ({
          key: s.key,
          value: s.value,
          label: SETTING_LABELS[s.key] || s.key,
        }));
        setSettings(items);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settings.map(({ key, value }) => ({ key, value })) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage application configuration</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">General Settings</h2>
        <div className="space-y-5">
          {settings.map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{s.label}</label>
              {s.key === 'theme' ? (
                <select
                  value={s.value}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              ) : (
                <input
                  type={s.key === 'admin_email' ? 'email' : s.key === 'items_per_page' ? 'number' : 'text'}
                  value={s.value}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">✓ Settings saved successfully!</span>
          )}
        </div>
      </div>
    </div>
  );
}
