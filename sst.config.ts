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
    const table = new sst.aws.Dynamo("PortfolioAnalytics", {
      fields: {
        visitor_id: "string",
        page_url: "string",
      },
      primaryIndex: { hashKey: "visitor_id", rangeKey: "page_url" },
    });

    if (!process.env.ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD must be set");
      process.exit(1);
    }

    if (!process.env.IP_LOCATION_PROVIDER_API_KEY) {
      console.error("IP_LOCATION_PROVIDER_API_KEY must be set");
      process.exit(1);
    }

    new sst.aws.Nextjs("Portfolio", {
      environment: {
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        IP_LOCATION_PROVIDER_API_KEY: process.env.IP_LOCATION_PROVIDER_API_KEY,
      },
      link: [table],
      domain: {
        name: "jelius.dev",
        aliases: ["www.jelius.dev", "portfolio.jelius.dev"]
      }
    });
  },
});
