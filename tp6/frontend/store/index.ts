import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set: any) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      setAuth: (usuario: Usuario, token: string) => {
        set({
          usuario,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface CarritoItem {
  producto_id: number;
  cantidad: number;
  producto?: {
    id: number;
    nombre: string;
    precio: number;
    imagen_url?: string;
  };
}

interface CarritoStore {
  items: CarritoItem[];
  total: number;
  subtotal: number;
  iva: number;
  envio: number;
  addItem: (item: CarritoItem) => void;
  removeItem: (producto_id: number) => void;
  updateQuantity: (producto_id: number, cantidad: number) => void;
  clearCart: () => void;
  setCarrito: (items: CarritoItem[], totales: any) => void;
}

export const useCarritoStore = create<CarritoStore>((set: any) => ({
  items: [],
  total: 0,
  subtotal: 0,
  iva: 0,
  envio: 0,
  addItem: (item: CarritoItem) => {
    set((state: any) => {
      const existing = state.items.find((i: any) => i.producto_id === item.producto_id);
      if (existing) {
        return {
          items: state.items.map((i: any) =>
            i.producto_id === item.producto_id
              ? { ...i, cantidad: i.cantidad + item.cantidad }
              : i
          ),
        };
      }
      return {
        items: [...state.items, item],
      };
    });
  },
  removeItem: (producto_id: number) => {
    set((state: any) => ({
      items: state.items.filter((i: any) => i.producto_id !== producto_id),
    }));
  },
  updateQuantity: (producto_id: number, cantidad: number) => {
    set((state: any) => ({
      items: state.items.map((i: any) =>
        i.producto_id === producto_id ? { ...i, cantidad } : i
      ),
    }));
  },
  clearCart: () => {
    set({
      items: [],
      total: 0,
      subtotal: 0,
      iva: 0,
      envio: 0,
    });
  },
  setCarrito: (items: CarritoItem[], totales: any) => {
    set({
      items,
      total: totales.total,
      subtotal: totales.subtotal,
      iva: totales.iva,
      envio: totales.envio,
    });
  },
}));
