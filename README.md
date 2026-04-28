# odollet-landing

Vue 3 + TypeScript + Vite landing for odollet, deployed to Cloudflare via Wrangler.

## Requirements

- [Bun](https://bun.sh) 1.3+

## Scripts

```sh
bun install         # install dependencies
bun run dev         # start Vite dev server
bun run build       # type-check (vue-tsc) and build to dist/
bun run preview     # preview the production build
bunx wrangler pages deploy dist   # deploy dist/ to Cloudflare Pages
```
