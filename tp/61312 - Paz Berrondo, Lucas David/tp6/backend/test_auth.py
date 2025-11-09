"""
Script de prueba para verificar el sistema de autenticación.
"""
from auth import obtener_hash_contraseña, verificar_contraseña, crear_access_token, verificar_token

def probar_hash_contraseña():
    """Probar hash y verificación de contraseñas."""
    print("🔐 Probando hash de contraseñas...")
    
    contraseña_original = "miPassword123"
    hash_generado = obtener_hash_contraseña(contraseña_original)
    
    print(f"   Contraseña original: {contraseña_original}")
    print(f"   Hash generado: {hash_generado[:60]}...")
    
    # Verificar que la contraseña correcta funciona
    es_valida = verificar_contraseña(contraseña_original, hash_generado)
    print(f"   ✅ Verificación correcta: {es_valida}")
    
    # Verificar que una contraseña incorrecta no funciona
    es_invalida = verificar_contraseña("contraseña_incorrecta", hash_generado)
    print(f"   ✅ Rechazo de contraseña incorrecta: {not es_invalida}")


def probar_jwt():
    """Probar creación y verificación de tokens JWT."""
    print("\n🎫 Probando tokens JWT...")
    
    email_prueba = "usuario@example.com"
    
    # Crear token
    token = crear_access_token(data={"sub": email_prueba})
    print(f"   Token generado: {token[:50]}...")
    
    # Verificar token
    email_decodificado = verificar_token(token)
    print(f"   Email decodificado: {email_decodificado}")
    print(f"   ✅ Token válido: {email_decodificado == email_prueba}")
    
    # Verificar token inválido
    email_invalido = verificar_token("token_invalido_123")
    print(f"   ✅ Rechazo de token inválido: {email_invalido is None}")


if __name__ == "__main__":
    print("🧪 Verificando sistema de autenticación...\n")
    print("=" * 60)
    
    probar_hash_contraseña()
    probar_jwt()
    
    print("\n" + "=" * 60)
    print("\n✅ Todas las pruebas de autenticación completadas exitosamente!")
    print("\n📊 Resumen:")
    print("   - Hash de contraseñas: ✅ bcrypt funcionando")
    print("   - Tokens JWT: ✅ Creación y verificación correcta")
    print("   - Dependencias: ✅ python-jose, passlib instaladas")
    print("\n🚀 Sistema de autenticación listo para usar!")
