import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: {
        id: number;
        nombre: string;
        email: string;
    } | null;
    setAuth: (token: string, user: { id: number; nombre: string; email: string }) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
    token: null,
    user: null,
    setAuth: (token, user) => {
        console.log('🔐 Guardando sesión:', user.nombre);
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
            localStorage.setItem('auth-user', JSON.stringify(user));
        }
        set({ token, user });
    },
    clearAuth: () => {
        console.log('🚪 Cerrando sesión');
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-user');
        }
        set({ token: null, user: null });
    }
}));

// Función para cargar datos desde localStorage al iniciar
export const loadAuthFromStorage = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        const userStr = localStorage.getItem('auth-user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                useAuthStore.setState({ token, user });
                console.log('🔄 Sesión restaurada:', user.nombre);
            } catch (error) {
                console.error('Error al restaurar sesión:', error);
                // Limpiar datos corruptos
                localStorage.removeItem('auth-token');
                localStorage.removeItem('auth-user');
            }
        }
    }
};

export default useAuthStore
