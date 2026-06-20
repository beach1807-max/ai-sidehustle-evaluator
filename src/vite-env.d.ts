/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER?: string;
  readonly VITE_SHOW_DEV_TOOLS?: string;
  readonly VITE_ENABLE_DEEP_REPORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
