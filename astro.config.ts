import db from '@astrojs/db'
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import clerk from '@clerk/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: true,
  site: 'http://localhost:4321',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    clerk(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    db(),
  ],
})
