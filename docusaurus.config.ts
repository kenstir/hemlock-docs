import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Hemlock Docs',
  tagline: 'Hemlock is the mobile app for Evergreen™ libraries',
  favicon: 'img/favicon.ico',

  url: 'https://kenstir.github.io',
  baseUrl: '/hemlock-docs/',
  projectName: 'hemlock-docs',
  organizationName: 'kenstir',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Home',
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/kenstir/hemlock-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              label: 'Android App',
              href: 'https://github.com/kenstir/hemlock',
            },
          ],
        },{
          items: [
            {
              label: 'iOS App',
              href: 'https://github.com/kenstir/hemlock-ios',
            },
          ],
        },{
          items: [
            {
              label: 'Push Notification Service',
              href: 'https://github.com/kenstir/hemlock-sendmsg',
            },
          ],
        },{
          items: [
            {
              label: 'Evergreen',
              href: 'https://evergreen-ils.org/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kenneth H. Cox. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
