import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://andremmanuelvitor.github.io',
  base: '/',
  integrations: [
    starlight({
      title: 'Grad Notes',
      description: "Master's degree study notes — embedded systems, computer architecture, and more.",
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/andremmanuelvitor',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'About this site', link: 'getting-started/about' },
            { label: 'How I take notes', link: 'getting-started/how-i-take-notes' },
          ],
        },
        {
          label: 'Embedded Systems',
          collapsed: false,
          autogenerate: { directory: 'embedded-systems' },
        },
      ],
    }),
  ],
});
