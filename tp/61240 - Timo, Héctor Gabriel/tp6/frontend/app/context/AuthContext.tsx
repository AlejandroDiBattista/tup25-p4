"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { iniciarSesion, registrarUsuario, getMiPerfil } from '@/services/api';
import { Usuario, UsuarioCreate } from '@/types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: Usuario | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: UsuarioCreate) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const profile = await getMiPerfil(token);
                setUser(profile);
            } catch (error) {
                console.error("Token inválido, cerrando sesión.", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string) => {
        const { access_token } = await iniciarSesion(email, password);
        localStorage.setItem('token', access_token);
        await fetchUser(); // Vuelve a cargar el perfil del usuario con el nuevo token
    };

    const register = async (data: UsuarioCreate) => {
        await registrarUsuario(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    const isAuthenticated = !loading && !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
