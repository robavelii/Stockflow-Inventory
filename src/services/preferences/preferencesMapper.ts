import { UserPreferences } from '@/types';

export function mapPreferencesFromDB(row: any): UserPreferences {
  return {
    darkMode: row.dark_mode,
    currency: row.currency,
    emailNotifications: row.email_notifications,
    pushNotifications: row.push_notifications,
  };
}

export function mapPreferencesToDB(prefs: Partial<UserPreferences>): any {
  const updateData: any = {};
  if (prefs.darkMode !== undefined) updateData.dark_mode = prefs.darkMode;
  if (prefs.currency) updateData.currency = prefs.currency;
  if (prefs.emailNotifications !== undefined)
    updateData.email_notifications = prefs.emailNotifications;
  if (prefs.pushNotifications !== undefined)
    updateData.push_notifications = prefs.pushNotifications;
  return updateData;
}
