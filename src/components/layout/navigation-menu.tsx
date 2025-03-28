"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import PageLoading from "@/components/layout/page-loading";
import { ThemeToggle } from "@/components/theme-toggle";
import LinksShareDialog from "@/components/layout/links-share-dialog";
import ErrorBoundary from "@/components/error";
import Error from "@/components/layout/error";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks, PortfolioSections } from "@/constants/portfolio-sections";
import { useScrollToSection } from "@/hooks/useScrollToSection";
// import user from '/assets/jelius.jpg';
import { usePathname } from "next/navigation";
import { MenuIcon, RefreshCcw } from "lucide-react";
import { About } from "@/constants/about-me";
import Image from "next/image";
import ENV from "@/root/env.mjs";
import Link from "next/link";
import { atom, useAtom } from "jotai";
import * as motion from "motion/react-client"

export const refreshTrackerAtom = atom<number | null>(null);

export default function NavigationMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = "/assets/jelius.jpg";

  const scrollToSection = useScrollToSection();
  const pathname = usePathname();

  const [isProfileOutOfView, setIsProfileOutOfView] = useState<boolean | null>(
    null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [profileSection, setProfileSection] = useState<HTMLImageElement | null>(
    null
  );
  const [tryAgain, setTryAgain] = useState<number>(0);
  const [refreshTracker, setRefreshTracker] = useAtom(refreshTrackerAtom);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (refreshTracker === null) return
    // Trigger animation whenever refreshTracker changes
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 500); // Reset after animation
    return () => clearTimeout(timeout);
  }, [refreshTracker]);

  useEffect(() => {
    if (pathname !== ENV.routes.links) return;
    setProfileSection(
      document.getElementById("links_profile_pic") as HTMLImageElement
    );

    if (profileSection) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If the profile is about to be covered by the header (64px before it goes out of view)
            if (!entry.isIntersecting) {
              setIsProfileOutOfView(true); // Profile is about to go out of view
            } else {
              setIsProfileOutOfView(false); // Profile is still in view
            }
          });
        },
        {
          rootMargin: "-64px 0px 0px 0px", // Trigger the event when the profile is 64px from the top
          threshold: 0, // Trigger when any part of the profile section becomes invisible
        }
      );

      // Observe the profile section
      observerRef.current.observe(profileSection);
    }

    // Cleanup observer on unmount
    return () => {
      if (profileSection && observerRef.current) {
        observerRef.current.unobserve(profileSection);
      }
    };
  }, [pathname, profileSection]);

  useEffect(() => {
    if (pathname !== ENV.routes.links) return;
    if (profileSection !== null) return;

    const profile = document.getElementById(
      "links_profile_pic"
    ) as HTMLImageElement | null;
    if (profile) {
      setProfileSection(profile);
    } else {
      setTryAgain(tryAgain + 1);
    }
  }, [profileSection, tryAgain, pathname]);

  return (
    <section className="small-container mx-auto">
      <section
        id="nav"
        className={`fixed small-container z-50 backdrop-blur-lg top-0 left-0 right-0 flex flex-row justify-normal gap-x-4 md:gap-x-0 md:justify-between ${pathname === ENV.routes.links ? "!justify-end" : ""
          } h-[64px] items-center`}
      >
        <div
          className={`md:hidden z-30 ${pathname === ENV.routes.links ? "!hidden" : ""
            }`}
        >
          <Suspense>
            <NavigationSheet />
          </Suspense>
        </div>
        <div
          id="header-title-container"
          className="z-30 cursor-pointer select-none"
          onClick={() => scrollToSection("hero")}
        >
          <p
            id="header-title"
            className={`tracking-tight inline font-semibold to-[#4B4B4B] from-[#FFFFFF] bg-clip-text text-transparent bg-gradient-to-b sm:!text-3xl lg:!text-3xl !text-3xl xl:!text-3xl md:!text-3xl`}
          >
            {About.name}
          </p>
        </div>
        <div className="absolute left-[16px] right-[16px] h-full flex justify-center items-center -z-10">
          {pathname === ENV.routes.links && (
            <Image
              height={40}
              width={40}
              src={user}
              alt="Profile Image"
              className={`w-10 h-10 rounded-full transition-opacity duration-300 ${isProfileOutOfView ? "opacity-100" : "opacity-0"
                }`}
            />
          )}
        </div>

        <div
          id="nav-container"
          className={`hidden md:flex gap-x-2 md:flex-row z-30 ${pathname === ENV.routes.links ? "!flex" : ""
            }`}
        >
          {pathname === ENV.routes.portfolio &&
            Object.entries(PortfolioSections).map(([key, section]) => (
              <Button
                aria-label={`Sctoll to ${section.title} section`}
                variant={"outline"}
                key={key}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </Button>
            ))}
          {Object.entries(NavLinks).map(([key, link]) =>
            (link.href === ENV.routes.portfolio &&
              pathname === ENV.routes.portfolio) ||
              (link.href === ENV.routes.links &&
                pathname === ENV.routes.links) ? null : (
              <Button
                aria-label={`Navigate to ${link.title}`}
                id={key}
                key={key}
                variant={"outline"}
                asChild
              >
                <Link href={link.href}>
                  {link.title}
                </Link>
              </Button>
            )
          )}

          {pathname === ENV.routes.portfolio ? (
            <ThemeToggle />
          ) : pathname === ENV.routes.links ? (
            <LinksShareDialog />
          ) : null}

          {pathname === "/analytics" && (
            <div className="flex flex-row gap-x-2 items-center">
              <Button variant={'outline'} size={'icon'} onClick={() => {
                setRefreshTracker(Date.now())
              }}>
                <motion.div
                  animate={animate ? { rotate: [0, 180] } : {}}
                  transition={{
                    duration: 0.6, // Slightly longer for a smoother effect
                    ease: [0.25, 1, 0.5, 1], // Custom cubic Bézier easing for Apple-like feel
                  }}
                >
                  <RefreshCcw size={18} />
                </motion.div>
              </Button>
            </div>
          )}
        </div>
      </section>

      <ErrorBoundary fallback={<Error />}>
        <React.Suspense fallback={<PageLoading />}>{children}</React.Suspense>
      </ErrorBoundary>

      <Toaster />
    </section>
  );
}

function NavigationSheet() {
  const scrollToSection = useScrollToSection();
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="outline"
          className="w-9 h-9 p-[0.40rem] rounded-full"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-60">
        <div className="flex flex-1 h-[calc(100%_-_(16px_*_2))] flex-col flex-nowrap mt-4">
          {pathname === ENV.routes.portfolio &&
            Object.entries(PortfolioSections).map(([key, section]) => (
              <SheetClose key={key} asChild>
                <Button
                  aria-label={`Sctoll to ${section.title} section`}
                  variant={"outline"}
                  className="my-2"
                  onClick={() => scrollToSection(section.id)}
                >
                  <p className="w-full text-start">{section.title}</p>
                </Button>
              </SheetClose>
            ))}

          {Object.entries(NavLinks).map(([key, link]) =>
            link.href === ENV.routes.portfolio &&
              pathname === ENV.routes.portfolio ? null : (
              <SheetClose key={key} asChild>
                <Button
                  aria-label={`Navigate to ${link.title}`}
                  variant={"outline"}
                  className="my-2"
                  asChild
                >
                  <Link href={link.href}>
                    <p className="w-full text-start">{link.title}</p>
                  </Link>
                </Button>
              </SheetClose>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
