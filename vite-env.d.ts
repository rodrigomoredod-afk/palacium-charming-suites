/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_RESERVATION_API?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_RESERVATION_INGEST_SECRET?: string;
  readonly GEMINI_API_KEY?: string;
  readonly API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
