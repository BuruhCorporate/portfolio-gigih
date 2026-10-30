/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" or "false". Unset: on in production builds, off in dev. See src/lib/protect.ts. */
  readonly VITE_PROTECT?: string
}
