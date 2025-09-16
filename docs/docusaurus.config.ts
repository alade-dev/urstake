import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "UrStake Documentation",
  tagline: "The Ultimate Liquid Staking Platform on Aptos",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.urstake.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "alade-dev", // Usually your GitHub org/user name.
  projectName: "urstake", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to set it to "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/", // Serve docs at the root
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/alade-dev/urstake/tree/main/docs/",
        },
        blog: false, // Disable blog
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/urstake-social-card.jpg",
    navbar: {
      title: "UrStake",
      logo: {
        alt: "UrStake Logo",
        src: "img/urstake.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://urstake.vercel.app",
          label: "Launch App",
          position: "right",
        },
        {
          href: "https://github.com/alade-dev/urstake",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/getting-started",
            },
            {
              label: "API Reference",
              to: "/api",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/urstake_defi",
            },
            {
              label: "Discord",
              href: "https://discord.gg/urstake",
            },
            {
              label: "Telegram",
              href: "https://t.me/urstake",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/alade-dev/urstake",
            },
            {
              label: "Launch App",
              href: "https://urstake.vercel.app",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} UrStake. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["json", "javascript", "typescript", "bash", "rust"],
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
