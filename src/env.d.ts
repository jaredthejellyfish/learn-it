/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string
  readonly PUBLIC_ASTRO_APP_CLERK_SIGN_IN_URL: string
  readonly PUBLIC_CLERK_SIGN_IN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
