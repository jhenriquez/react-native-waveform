import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  skipNodeModulesBundle: false,
  external: ['react', 'react-native'], // rxjs will be bundled
});
