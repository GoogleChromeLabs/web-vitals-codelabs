// vite.config.js
import { join } from 'path';
import { readdirSync } from 'fs';
import { defineConfig } from 'vite';

const input = readdirSync(join(__dirname, 'answers'))
  .filter(f => f.endsWith('.html'))
  .map(f => join(__dirname, 'answers', f));

export default defineConfig({
  base: '/understanding-inp/',
  root: './',
  build: {
    emptyOutDir: true,
    rollupOptions: {
		input,
    },
  },
})
