import { create } from 'zustand';
import {supabase} from "../utils/supabase.ts";
import {User} from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                throw new Error(error.message);
            }
            set({ user: data.user, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await supabase.auth.signOut();
            set({ user: null, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    getSession: async () => {
        set({ loading: true, error: null });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({ user: session?.user, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },
}));