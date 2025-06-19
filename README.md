# 🧠 Image Tools

Aplicación web creada como parte de una prueba técnica. Permite generar imágenes con IA utilizando distintos enfoques:

- **Task 1**: Generación de imágenes a partir de texto (Text-to-Image).
- **Task 2**: Herramienta de enmascaramiento con pincel.
- **Task 3**: Relleno inteligente con IA (Inpainting) usando máscara, imagen base y prompt.

---

## 🚀 Tecnologías utilizadas

- **Next.js 14 (App Router)**
- **TypeScript**
- **CSS Modules**
- **Replicate API (modelos Flux-schnell & Flux-fill-dev)**

---

## 🧪 Funcionalidades

### 🖼️ 1. Generador de imágenes por texto

> Página `/`

- Introduce un prompt en texto.
- Envía la petición al modelo `flux-schnell`.
- Muestra la imagen generada.

### 🎨 2. Herramienta de máscara

> Página `/masking`

- Sube una imagen.
- Usa el pincel para dibujar una máscara sobre ella (canvas).
- Descarga la máscara generada.

### 🧩 3. Inpainting con IA

> Página `/paint-masking`

- Sube una imagen base.
- Sube una máscara generada (desde `/masking`).
- Introduce un prompt.
- Envía todo al modelo `flux-fill-dev` para rellenar la zona seleccionada.
- Muestra la imagen resultante.

---

## 📦 Instalación y ejecución local

```bash
git clone https://github.com/alemaan15/dreamshot-challenge.git
cd dreamshot-challenge
npm install

crea un .env con el token de replicate
REPLICATE_API_TOKEN=tu_token_de_replicate

y para ejecutar el proyecto: npm run dev
```
