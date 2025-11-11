// Componente TarjetaPersona
interface PersonaProps {
  nombre: string;
  apellido: string;
  puesto: string;
  foto?: string;
  telefono: string;
  email: string;
}

function TarjetaPersona({ nombre, apellido, puesto, foto, telefono, email }: PersonaProps) {
  // URL de placeholder para foto si no se proporciona una
  const fotoDefault = foto || `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=6366f1&color=fff&size=200`;

  return (
    <div className="bg-white rounded-2xl shadow-3xl p-6 w-full border border-gray-100  transition-all duration-300">
  {/* Layout horizontal con flexbox */}
  <div className="flex items-start gap-6">
        {/* Foto de perfil - lado izquierdo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100">
            <img 
              src={fotoDefault}
              alt={`${nombre} ${apellido}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback si la imagen no carga
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=6366f1&color=fff&size=200`;
              }}
            />
          </div>
        </div>
        
  {/* Información personal - lado derecho */}
  <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Puesto arriba */}
          <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">
            {puesto}
          </p>
          
          {/* Nombre abajo del puesto */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {nombre} {apellido}
          </h2>
          
          {/* Teléfono y Email: columna izquierda, sin quiebres de línea */}
          <div className="flex flex-col items-start gap-1 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-lg">📞</span>
              <span className="whitespace-nowrap">{telefono}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-500 text-lg">✉️</span>
              <span className="truncate block max-w-[16rem]">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaPersona;
export type { PersonaProps };