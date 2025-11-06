import {create} from "zustand"

interface AuthState {
    token: string | null
    usuario: string | null
    iniciarSesion: (token: string, usuario: string) => void
    cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    usuario: null,
    iniciarSesion: (token, usuario) => {
        localStorage.setItem("token", token)
        localStorage.setItem("usuario", usuario)
        set({token, usuario})
    },
    cerrarSesion: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        set({token: null, usuario: null})
    } 
}))