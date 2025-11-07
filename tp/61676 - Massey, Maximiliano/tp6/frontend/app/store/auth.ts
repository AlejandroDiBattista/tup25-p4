import { create } from 'zustand'

interface AuthState {
    token: string | null
    user: {
        id: number
        nombre: string
        email: string
    } | null
    setAuth: (token: string, user: { id: number; nombre: string; email: string }) => void
    clearAuth: () => void
}

const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth: (token, user) => set({ token, user }),
    clearAuth: () => set({ token: null, user: null })
}))

export default useAuthStore
