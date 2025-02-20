// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "portfolio",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("Portfolio", {
      environment: {
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      },
      domain: {
        name: "jelius.dev",
        aliases: ["www.jelius.dev", "portfolio.jelius.dev"]
      }
    });
  },
});
