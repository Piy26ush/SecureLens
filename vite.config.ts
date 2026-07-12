import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    cssMinify: false,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: {
        preset: "vercel",
      },
    }),
  ],
});
