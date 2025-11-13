interface ContactInfo {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  imageUrl?: string;
}

interface ContactCardProps {
  contactInfo: ContactInfo;
  onEdit?: () => void;
}

export default function ContactCard({ contactInfo, onEdit }: ContactCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300 border border-gray-100 relative">
      {/* Botón de editar */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Editar contacto"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      {/* Avatar centrado */}
      <div className="flex justify-center mb-6">
        {contactInfo.imageUrl ? (
          <img 
            src={contactInfo.imageUrl} 
            alt={`${contactInfo.nombre} ${contactInfo.apellido}`}
            className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {contactInfo.nombre.charAt(0)}{contactInfo.apellido.charAt(0)}
          </div>
        )}
      </div>

      {/* Información centrada */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {contactInfo.nombre} {contactInfo.apellido}
        </h2>
        <p className="text-gray-500 text-base mb-1">Contacto Personal</p>
        <p className="text-sm text-gray-400">{contactInfo.telefono}</p>
        <p className="text-sm text-gray-400">{contactInfo.email}</p>
      </div>

      {/* Botón de mensaje */}
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Message
        </button>
      </div>
    </div>
  );
}

export type { ContactInfo };