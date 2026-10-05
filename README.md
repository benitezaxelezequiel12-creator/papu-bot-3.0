# Papu Bot 3.0

Chatbot histórico con Gemini, interfaz responsive y configuración para Vercel.

## Configurar localmente

1. Instalar Node.js.
2. Ejecutar `npm install`.
3. Crear `.env` a partir de `.env.example`.
4. Poner la API key en `GEMINI_API_KEY`.
5. Ejecutar `npm run dev`.

## Vercel

En Vercel:
- Importar este proyecto.
- En Settings > Environment Variables crear:
  - Name: `GEMINI_API_KEY`
  - Value: tu API key de Google AI Studio
- Hacer Redeploy.

Nunca publiques la API key dentro del código del frontend.
