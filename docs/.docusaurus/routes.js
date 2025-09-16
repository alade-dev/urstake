import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', 'b07'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'ab8'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '3cf'),
            routes: [
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
