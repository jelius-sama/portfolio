import NavigationMenu from "@/components/layout/navigation-menu";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/theme";
import { About } from "@/constants/about-me";
import { AppleImage } from "next/dist/lib/metadata/types/extra-types";
import { headers } from "next/headers";
import ENV from "@/root/env.mjs";
import { WithContext, Person } from "schema-dts";
import Analytics from "@/components/analytics";
import ServerMessage from "@/components/server-message";
import { Suspense } from "react";
import DevAlert from "@/components/layout/dev-alert";

export const startupImage: AppleImage[] = [
  {
    url: "/icons/apple-splash-2048-2732.jpg",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2732-2048.jpg",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1668-2388.jpg",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2388-1668.jpg",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1536-2048.jpg",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2048-1536.jpg",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1488-2266.jpg",
    media:
      "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2266-1488.jpg",
    media:
      "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1640-2360.jpg",
    media:
      "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2360-1640.jpg",
    media:
      "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1668-2224.jpg",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2224-1668.jpg",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1620-2160.jpg",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2160-1620.jpg",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1290-2796.jpg",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2796-1290.jpg",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1179-2556.jpg",
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2556-1179.jpg",
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1284-2778.jpg",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2778-1284.jpg",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1170-2532.jpg",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2532-1170.jpg",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1125-2436.jpg",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2436-1125.jpg",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1242-2688.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2688-1242.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-828-1792.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-1792-828.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-1242-2208.jpg",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-2208-1242.jpg",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-750-1334.jpg",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-1334-750.jpg",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/icons/apple-splash-640-1136.jpg",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/icons/apple-splash-1136-640.jpg",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
];

export async function metadata(): Promise<Metadata> {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const url = headerList.get("x-current-url");

  const probableURL = ENV.site;
  const isLinksPage = pathname === ENV.routes.links;
  const isPortfolioPage = pathname === ENV.routes.portfolio;

  const title = isLinksPage
    ? `Links | ${About.firstName}`
    : isPortfolioPage
      ? `Portfolio | ${About.firstName}`
      : {
        default: `${About.firstName}`,
        template: `%s | ${About.firstName}`,
      };
  const description = isLinksPage ? About.linksDescription : About.description;
  const applicationName = About.name;
  const icon = `${probableURL}/assets/jelius.jpg`;
  const appleIcon = `${probableURL}/icons/apple-icon-180.png`;
  const twitterHandle = `${About.xHandle}`;

  return {
    applicationName: applicationName,
    title: title,
    description: description,

    robots: "index, follow",

    icons: {
      icon: icon,
      apple: appleIcon,
    },

    manifest: "/manifest.json",

    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: applicationName,
      startupImage: startupImage,
    },

    formatDetection: {
      telephone: false,
    },

    openGraph: {
      type: "website",
      url: url || probableURL,
      siteName: applicationName,
      title: title,
      description: description,
      images: icon,
    },

    twitter: {
      card: "summary",
      title: title,
      description: description,
      images: icon,
      site: twitterHandle,
      creator: twitterHandle,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

const jsonLd: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jelius",
  url: ENV.site,
  sameAs: [
    "https://www.linkedin.com/in/jelius-basumatary-485044339/",
    "https://github.com/jelius-sama",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <Suspense>
          <ServerMessage />
        </Suspense>
        <DevAlert />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="root" className={`w-screen md:mx-[16px] relative font-kite`}>
            <Suspense>
              <NavigationMenu>{children}</NavigationMenu>
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
