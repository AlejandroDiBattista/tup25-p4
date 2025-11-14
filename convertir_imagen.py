import mimetypes
import os
from pathlib import Path
from typing import Iterable

from PIL import Image
from google import genai
from google.genai import types

SUPPORTED_IMAGE_EXTENSIONS = {
    ".png",
    ".jpeg",
    ".jpg",
    ".bmp",
    ".gif",
    ".tiff",
    ".webp",
    ".heic",
    ".heif",
}

TARGET_JPEG_EXTENSION = ".jpeg"
MAX_PROFILE_DIMENSION = 1024

try:
    RESAMPLE_FILTER = Image.Resampling.LANCZOS
except AttributeError:  # Pillow < 9.1 fallback
    RESAMPLE_FILTER = Image.LANCZOS

EXTENSION_PRIORITY = {
    ".jpeg": 2,
    ".jpg": 1,
}

def iter_image_paths(root_path: Path) -> Iterable[Path]:
    """Yield image files inside root_path recursively."""
    for entry in root_path.rglob("*"):
        if entry.is_file() and entry.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS:
            yield entry

def convert_images_to_jpg(
    root_dir: str | Path,
    quality: int = 90,
    overwrite: bool = False,
    delete_original: bool = False,
) -> dict:
    """Convert every image under root_dir to JPEG, optionally overwriting/deleting originals."""
    root_path = Path(root_dir).expanduser().resolve()
    if not root_path.exists():
        raise FileNotFoundError(f"La carpeta {root_path} no existe")

    converted = 0
    skipped = 0
    errors = 0

    for image_path in iter_image_paths(root_path):
        suffix = image_path.suffix.lower()

        is_target_extension = suffix == TARGET_JPEG_EXTENSION
        if is_target_extension and not overwrite:
            skipped += 1
            continue

        target_path = image_path.with_suffix(TARGET_JPEG_EXTENSION)
        if target_path.exists() and not overwrite:
            skipped += 1
            continue

        try:
            with Image.open(image_path) as img:
                rgb_img = img.convert("RGB")
                rgb_img.save(target_path, "JPEG", quality=quality, optimize=True)

            converted += 1
            print(f"Convertido: {image_path} -> {target_path}")

            if delete_original and target_path != image_path:
                image_path.unlink()

        except Exception as exc:
            errors += 1
            print(f"[ERROR] No se pudo convertir {image_path}: {exc}")

    resumen = {"convertidos": converted, "saltados": skipped, "errores": errors}
    print(f"Resumen: {resumen}")
    return resumen


def _extension_priority(path: Path) -> int:
    """Return a numeric priority for the extension of a file."""
    return EXTENSION_PRIORITY.get(path.suffix.lower(), 0)


def limpiar_conversion(root_dir: str | Path) -> dict:
    """Remove duplicate images within each folder based on filename and extension priority."""
    root_path = Path(root_dir).expanduser().resolve()
    if not root_path.exists():
        raise FileNotFoundError(f"La carpeta {root_path} no existe")

    inspected_dirs = 0
    duplicate_groups = 0
    removed_files = 0
    errors = 0

    directories = [root_path]
    directories.extend(p for p in root_path.rglob("*") if p.is_dir())

    for directory in directories:
        inspected_dirs += 1
        files_by_stem: dict[str, list[Path]] = {}

        for file_path in directory.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS:
                files_by_stem.setdefault(file_path.stem.lower(), []).append(file_path)

        for files in files_by_stem.values():
            if len(files) < 2:
                continue

            duplicate_groups += 1

            files.sort(
                key=lambda path: (
                    _extension_priority(path),
                    path.stat().st_mtime,
                ),
                reverse=True,
            )

            keep = files[0]
            for duplicate in files[1:]:
                try:
                    duplicate.unlink()
                    removed_files += 1
                    print(f"Eliminado duplicado: {duplicate} (se mantiene {keep})")
                except Exception as exc:
                    errors += 1
                    print(f"[ERROR] No se pudo eliminar {duplicate}: {exc}")

    resumen = {
        "carpetas_revisadas": inspected_dirs,
        "grupos_duplicados": duplicate_groups,
        "archivos_eliminados": removed_files,
        "errores": errors,
    }
    print(f"Resumen limpieza: {resumen}")
    return resumen


def normalizar_perfil(root_dir: str | Path, max_dimension: int = MAX_PROFILE_DIMENSION) -> dict:
    """Resize '0.jpeg' images so their largest dimension equals max_dimension (up/down)."""
    root_path = Path(root_dir).expanduser().resolve()
    if not root_path.exists():
        raise FileNotFoundError(f"La carpeta {root_path} no existe")

    procesados = 0
    saltados = 0
    errores = 0

    for profile_path in root_path.rglob("0.jpeg"):
        try:
            with Image.open(profile_path) as img:
                width, height = img.size
                max_actual = max(width, height)

                if max_actual == 0:
                    saltados += 1
                    continue

                if abs(max_actual - max_dimension) <= 1:
                    saltados += 1
                    continue

                escala = max_dimension / max_actual
                nuevo_tam = (
                    max(1, int(round(width * escala))),
                    max(1, int(round(height * escala))),
                )

                perfil_redimensionado = img.resize(nuevo_tam, RESAMPLE_FILTER)
                perfil_redimensionado.save(profile_path, "JPEG", quality=90, optimize=True)
                procesados += 1
                accion = "Agrandado" if escala > 1 else "Reducido"
                print( f"{accion} {profile_path}: {width}x{height} -> {nuevo_tam[0]}x{nuevo_tam[1]}" )
                procesar_imagen_nano_banana(profile_path)

        except Exception as exc:
            errores += 1
            print(f"[ERROR] No se pudo normalizar {profile_path}: {exc}")

    resumen = {
        "procesados": procesados,
        "saltados": saltados,
        "errores": errores,
    }
    print(f"Resumen perfiles: {resumen}")
    return resumen


def procesar_imagen_nano_banana( origen: str | Path, prompt: str = "", image_size: str = "1K", ) -> list[Path]:
    """Procesa una imagen con la API de Google GenAI y guarda el resultado en destino."""

    destino = origen.replace("/0.jpeg", "/00.jpeg")
    
    if not prompt:
        prompt = "Convertir al imagen en una foto carnet profesional. Preservar perfectamente los detalles faciales y elimina todo detalle innecesario. Asegurate de centrar perfectamente el rostro y mantener un fondo neutro."
    
    origen_path = Path(origen).expanduser().resolve()
    if not origen_path.exists():
        return []

    destino_path = Path(destino).expanduser().resolve()
    if destino_path.exists():
        return []
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("Debe definir la variable de entorno GEMINI_API_KEY para usar Google GenAI.")

    destino_path = Path(destino).expanduser()
    destino_es_directorio = (destino_path.exists() and destino_path.is_dir()) or destino_path.suffix == ""
    output_dir = destino_path if destino_es_directorio else destino_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    image_bytes = origen_path.read_bytes()
    mime_type = mimetypes.guess_type(origen_path.name)[0] or "image/jpeg"

    client = genai.Client(api_key=api_key)

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            ],
        )
    ]

    config = types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        image_config=types.ImageConfig(image_size=image_size),
    )

    saved_files: list[Path] = []
    file_index = 0

    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash-image",
        contents=contents,
        config=config,
    ):
        candidate = chunk.candidates[0] if chunk.candidates else None
        if not candidate or not candidate.content or not candidate.content.parts:
            continue

        for part in candidate.content.parts:
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                extension = mimetypes.guess_extension(inline.mime_type) or destino_path.suffix or ".jpeg"

                if destino_es_directorio:
                    filename = f"{origen_path.stem}_nano_{file_index}{extension}"
                    target_path = output_dir / filename
                else:
                    if file_index == 0:
                        target_path = destino_path if destino_path.suffix else destino_path.with_suffix(extension)
                    else:
                        suffix = destino_path.suffix or extension
                        base_name = destino_path.stem or origen_path.stem
                        target_path = output_dir / f"{base_name}_{file_index}{suffix}"

                target_path.write_bytes(inline.data)
                saved_files.append(target_path)
                file_index += 1

            elif getattr(part, "text", None):
                print(part.text)

    if not saved_files:
        raise RuntimeError("La API no devolvió ninguna imagen procesada.")

    return saved_files

CARPETA_IMAGENES = Path("emails")
if __name__ == "__main__":
    if CARPETA_IMAGENES.exists():
        convert_images_to_jpg(CARPETA_IMAGENES, quality=90, overwrite=False, delete_original=False)
        limpiar_conversion(CARPETA_IMAGENES)
        normalizar_perfil(CARPETA_IMAGENES)
    else:
        print("La carpeta emails aún no existe. Crear la carpeta o modificar CARPETA_IMAGENES.")
    
