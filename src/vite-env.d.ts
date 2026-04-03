/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEQUENTIAL_CHECK_EASY?: string
  readonly VITE_SEQUENTIAL_CHECK_MEDIUM?: string
  readonly VITE_SEQUENTIAL_CHECK_HARD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
