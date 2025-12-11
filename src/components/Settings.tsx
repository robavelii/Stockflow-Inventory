import React, { useState, useEffect } from 'react';
import { Bell, Shield, Smartphone, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { preferencesService } from '@/services/preferences';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage to match App.tsx behavior
    const cached = localStorage.getItem('stockflow-theme');
    if (cached) return cached === 'dark';
    // Default fallback
    return document.documentElement.classList.contains('dark');
  });
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const prefs = await preferencesService.get(user.id);
      setDarkMode(prefs.darkMode);
      setEmailNotifs(prefs.emailNotifications);
      setPushNotifs(prefs.pushNotifications);
      setCurrency(prefs.currency);
      
      // Ensure DOM matches preferences
      if (prefs.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      if (error?.code === 'PGRST116' || error?.message?.includes('No active session')) {
        try {
          const defaultPrefs = await preferencesService.create(user.id);
          setDarkMode(defaultPrefs.darkMode);
          setEmailNotifs(defaultPrefs.emailNotifications);
          setPushNotifs(defaultPrefs.pushNotifications);
          setCurrency(defaultPrefs.currency);
        } catch (createError) {
          console.error('Error creating default preferences:', createError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (
    updates: Partial<{
      darkMode: boolean;
      emailNotifications: boolean;
      pushNotifications: boolean;
      currency: string;
    }>
  ) => {
    if (!user) return;
    try {
      await preferencesService.update(user.id, updates);
      toast.success('Preferences saved');
    } catch (error: any) {
      toast.error('Failed to save preferences');
      console.error(error);
    }
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    
    // Update localStorage for immediate persistence
    localStorage.setItem('stockflow-theme', newValue ? 'dark' : 'light');
    
    // Update DOM
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist to database
    updatePreference({ darkMode: newValue });
  };

  const handleEmailNotifsToggle = () => {
    const newValue = !emailNotifs;
    setEmailNotifs(newValue);
    updatePreference({ emailNotifications: newValue });
  };

  const handlePushNotifsToggle = () => {
    const newValue = !pushNotifs;
    setPushNotifs(newValue);
    updatePreference({ pushNotifications: newValue });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    updatePreference({ currency: newCurrency });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl pb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your workspace preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary-600" />
            Appearance
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Theme Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            Notifications
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Email Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily stock summaries</p>
            </div>
            <button
              onClick={handleEmailNotifsToggle}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                emailNotifs ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  emailNotifs ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-time alerts for low stock</p>
            </div>
            <button
              onClick={handlePushNotifsToggle}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                pushNotifs ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  pushNotifs ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            Security & Region
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Currency</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Default currency for reporting</p>
            </div>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-red-100 dark:border-red-800">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            Danger Zone
          </h3>
        </div>
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-400">Test Error Handling</p>
                  <p className="text-sm text-red-600 dark:text-red-500">Triggers a manual crash to test the error boundary</p>
                </div>
                <button
                  onClick={() => { throw new Error('This is a test error from Settings page'); }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Trigger Crash
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};