import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/types';
import { mapPreferencesFromDB, mapPreferencesToDB } from './preferencesMapper';

export const preferencesService = {
  async get(userId: string): Promise<UserPreferences> {
    // Ensure we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching preferences:', error);
      throw error;
    }

    if (!data) {
      return await this.create(userId);
    }

    return mapPreferencesFromDB(data);
  },

  async create(userId: string): Promise<UserPreferences> {
    // Ensure we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const defaultPrefs = {
      dark_mode: false,
      currency: 'USD',
      email_notifications: true,
      push_notifications: false,
    };

    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        ...defaultPrefs,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating preferences:', error);
      throw error;
    }
    return mapPreferencesFromDB(data);
  },

  async update(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    // Ensure we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const updateData = mapPreferencesToDB(updates);

    const { data, error } = await supabase
      .from('user_preferences')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
    return mapPreferencesFromDB(data);
  },
};
