import { create } from "zustand";
import { saveToken, getToken, removeToken } from "./auth.storage";

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    user: User | null;
    token: string | null;

    isAuthenticated: boolean;
    isLoading: boolean;

    setAuth: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,

    isAuthenticated: false,
    isLoading: true,

    setAuth: async (user, token) => {
        await saveToken(token);

        set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    logout: async () => {
        await removeToken();

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    restoreSession: async () => {
        try {
            const token = await getToken();

            if (!token) {
                set({ isLoading: false });
                return;
            }

            const res = await fetch("http://10.120.143.9:5000/api/v1/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                await removeToken();

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });

                return;
            }

            const user = await res.json();

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (err) {
            await removeToken();

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    }
}));