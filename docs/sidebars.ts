import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      items: [
        "getting-started/overview",
        "getting-started/wallet-setup",
        "getting-started/first-stake",
      ],
    },
    {
      type: "category",
      label: "User Guide",
      items: [
        "user-guide/staking-apt",
        "user-guide/staking-usdc",
        "user-guide/unstaking",
        "user-guide/liquid-tokens",
        "user-guide/governance",
      ],
    },
    {
      type: "category",
      label: "Developer Guide",
      items: [
        "developer/smart-contracts",
        // "developer/api-reference",
        // "developer/integration",
        // "developer/sdk",
      ],
    },
    // {
    //   type: "category",
    //   label: "Security",
    //   items: ["security/best-practices", "security/bug-bounty"],
    // },
    {
      type: "category",
      label: "FAQ & Support",
      items: ["support/faq", "support/troubleshooting", "support/contact"],
    },
  ],
};

export default sidebars;
