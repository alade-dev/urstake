import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'ac5'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'b79'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'c16'),
            routes: [
              {
                path: '/developer/api-reference',
                component: ComponentCreator('/developer/api-reference', 'be1'),
                exact: true
              },
              {
                path: '/developer/integration',
                component: ComponentCreator('/developer/integration', 'a14'),
                exact: true
              },
              {
                path: '/developer/sdk',
                component: ComponentCreator('/developer/sdk', 'bd1'),
                exact: true
              },
              {
                path: '/developer/smart-contracts',
                component: ComponentCreator('/developer/smart-contracts', 'e9b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/getting-started/first-stake',
                component: ComponentCreator('/getting-started/first-stake', '8a4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/getting-started/overview',
                component: ComponentCreator('/getting-started/overview', '204'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/getting-started/wallet-setup',
                component: ComponentCreator('/getting-started/wallet-setup', '392'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/security/best-practices',
                component: ComponentCreator('/security/best-practices', '644'),
                exact: true
              },
              {
                path: '/security/bug-bounty',
                component: ComponentCreator('/security/bug-bounty', 'fa7'),
                exact: true
              },
              {
                path: '/support/contact',
                component: ComponentCreator('/support/contact', 'a44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/support/faq',
                component: ComponentCreator('/support/faq', '400'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/support/troubleshooting',
                component: ComponentCreator('/support/troubleshooting', '5f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/user-guide/governance',
                component: ComponentCreator('/user-guide/governance', 'a7a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/user-guide/liquid-tokens',
                component: ComponentCreator('/user-guide/liquid-tokens', 'a04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/user-guide/staking-apt',
                component: ComponentCreator('/user-guide/staking-apt', '109'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/user-guide/staking-usdc',
                component: ComponentCreator('/user-guide/staking-usdc', '345'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/user-guide/unstaking',
                component: ComponentCreator('/user-guide/unstaking', '7f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
