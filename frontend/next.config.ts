import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const isWindowsMount = process.platform === 'linux' && /^\/mnt\/[a-z]\//.test(process.cwd());

const nextConfig: NextConfig = {
  // WSL Windows mounts can miss filesystem events. Poll for source changes.
  ...(isWindowsMount && { watchOptions: { pollIntervalMs: 1000 } }),
  ...(process.env.PLAYWRIGHT_TEST === 'true' && {
    distDir: '.next-playwright',
    devIndicators: false,
  }),
  ...(isStaticExport && {
    output: 'export',
    basePath: '/apexfitnessnyc',
    assetPrefix: '/apexfitnessnyc/',
    trailingSlash: true,
  }),
};

export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    typescript: {
      tsconfigPath:
        process.env.PLAYWRIGHT_TEST === 'true'
          ? 'tsconfig.playwright.json'
          : phase === PHASE_PRODUCTION_BUILD
            ? 'tsconfig.build.json'
            : 'tsconfig.json',
    },
  };
}
