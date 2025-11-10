'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/app/hooks/useToast';
import { crearProducto, editarProducto, CrearProductoInput } from '@/app/services/admin';
import { Producto } from '@/app/types';

interface AdminProductFormProps {
  producto?: Producto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminProductForm({ producto, onSuccess, onCancel }: AdminProductFormProps) {
  const { agregarToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CrearProductoInput>({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || 0,
    categoria: producto?.categoria || '',
    existencia: producto?.existencia || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'existencia' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!formData.nombre.trim()) {
      agregarToast('El nombre es obligatorio', 'error');
      return;
    }
    if (!formData.descripcion.trim()) {
      agregarToast('La descripción es obligatoria', 'error');
      return;
    }
    if (formData.precio <= 0) {
      agregarToast('El precio debe ser mayor a 0', 'error');
      return;
    }
    if (!formData.categoria.trim()) {
      agregarToast('La categoría es obligatoria', 'error');
      return;
    }
    if (formData.existencia < 0) {
      agregarToast('La existencia no puede ser negativa', 'error');
      return;
    }

    try {
      setLoading(true);

      if (producto) {
        await editarProducto(producto.id, formData);
        agregarToast('Producto actualizado correctamente', 'success');
      } else {
        await crearProducto(formData);
        agregarToast('Producto creado correctamente', 'success');
        setFormData({
          nombre: '',
          descripcion: '',
          precio: 0,
          categoria: '',
          existencia: 0,
        });
      }

      onSuccess?.();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      agregarToast(mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="nombre">Nombre del Producto</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="ej. Mochila Fjallraven"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada del producto"
          rows={4}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Precio ($)</Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="existencia">Existencia (unidades)</Label>
          <Input
            id="existencia"
            name="existencia"
            type="number"
            value={formData.existencia}
            onChange={handleChange}
            placeholder="0"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Input
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          placeholder="ej. Ropa de hombre"
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? 'Guardando...' : producto ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
