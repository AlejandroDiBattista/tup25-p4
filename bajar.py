import os
import base64
import re
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# -------------------------------------------------------
# 1) FUNCIÓN PARA CALCULAR LA CARPETA SEGÚN EL ASUNTO
# -------------------------------------------------------
import os
import re

def carpeta_destino(asunto: str) -> str:
    """
    Extrae un legajo de 5 dígitos del asunto y crea la carpeta donde se guardarán los adjuntos.
    Si no encuentra el legajo, usa 'sin_legajo'.
    """

    # Buscar 5 dígitos consecutivos
    match = re.search(r"\b(\d{5,6})\b", asunto)
    
    if match:
        legajo = match.group(1)
        print(f"  -> Legajo encontrado: {legajo}")
        ruta = os.path.join("emails", legajo)
        os.makedirs(ruta, exist_ok=True)
        return ruta
    else:
        return None 


# 2) AUTENTICACIÓN
# -------------------------------------------------------
def get_service():
    creds = None

    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

# -------------------------------------------------------
# 3) DESCARGAR ADJUNTOS (SOLO IMÁGENES)
# -------------------------------------------------------
def bajar_adjuntos(msg_id, service, carpeta_out):
    msg = service.users().messages().get(userId='me', id=msg_id).execute()
    print(f"  -> Bajando adjuntos del email ID: {msg_id} a la carpeta: {carpeta_out}")
    parts = msg.get("payload", {}).get("parts", [])
    if not parts:
        return

    for part in parts:
        filename = part.get("filename")
        filepath = os.path.join(carpeta_out, filename)
        
        # Si el archivo existe, salir
        if os.path.exists(filepath):
            print(f"Archivo ya existe, saltando: {filepath}")
            continue
        
        mime = part.get("mimeType", "")

        # Solo imágenes
        if not filename or not mime.startswith("image/"):
            continue

        body = part.get("body", {})
        att_id = body.get("attachmentId")

        if not att_id:
            continue

        # Obtener datos del adjunto
        attachment = service.users().messages().attachments().get(
            userId='me',
            messageId=msg_id,
            id=att_id
        ).execute()

        data = attachment.get('data')
        file_data = base64.urlsafe_b64decode(data.encode())

        # Guardar archivo
        filepath = os.path.join(carpeta_out, filename)
        with open(filepath, "wb") as f:
            f.write(file_data)

        print(f"Imagen guardada: {filepath}")

# -------------------------------------------------------
# 4) PROCESAR TODOS LOS EMAILS
# -------------------------------------------------------
def bajar_todo():
    print("|-- Iniciando proceso de descarga de adjuntos --|")
    service = get_service()

    # Obtenemos solo los mensajes de la bandeja de entrada
    results = service.users().messages().list(
        userId='me',
        labelIds=['INBOX'],  # Solo bandeja de entrada
        maxResults=500  # podés subirlo
    ).execute()

    mensajes = results.get('messages', [])
    print(f"Emails encontrados en INBOX: {len(mensajes)}")

    for m in mensajes:
        msg = service.users().messages().get( userId='me', id=m['id'], format="metadata", metadataHeaders=["Subject"] ).execute()

        headers = msg.get("payload", {}).get("headers", [])
        asunto = "sin asunto"

        for h in headers:
            if h["name"] == "Subject":
                asunto = h["value"]
                break

        # calcular carpeta por asunto
        print(f"Procesando email ID: {m['id']} Asunto: {asunto}")
        if carpeta := carpeta_destino(asunto):    

            bajar_adjuntos(m["id"], service, carpeta)
            print(carpeta)
            pass

    print("|-- Proceso finalizado --|")

# -------------------------------------------------------
# Ejecutar el proceso:
if __name__ == '__main__':
    bajar_todo()