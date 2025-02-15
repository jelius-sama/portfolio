"use client";

import { About } from "@/constants/about-me";
import { Button } from "@/components/ui/button";
import useExternalNavigate from "@/hooks/useExternalNavigation";
import { ChevronDownIcon } from "lucide-react";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import Title from "@/components/ui/title";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Image from "next/image";

export default function HeroSection() {
  const externalNavigate = useExternalNavigate();
  const scrollToSection = useScrollToSection();
  const { theme, systemTheme } = useTheme();

  const user = "/assets/jelius.jpg";
  const githubDark = "/assets/github-mark-white.png";
  const githubWhite = "/assets/github-mark.png";

  return (
    <section
      id="hero"
      className="min-h-screen w-full items-center flex flex-col md:flex-row justify-center gap-x-20 relative"
    >
      <div>
        <Image
          alt={`${About.firstName}`}
          width={400}
          height={400}
          src={user}
          className="h-52 w-52 md:h-60 md:w-60 lg:h-96 lg:w-96 aspect-square rounded-full"
        />
      </div>

      <div className="flex flex-nowrap flex-col items-center justify-center pt-4 md:pt-0">
        <Title varient="info" className="text-center">
          Hello , I&apos;m
        </Title>
        <Title
          varient="title"
          fullWidth
          color="pink"
          className={`text-center !leading-[70px]`}
        >
          {About.name}
        </Title>
        <Title varient="subtitle" className={`text-center`}>
          {About.profession}
        </Title>
        <span className="mt-4 mb-2 flex flex-row gap-x-2">
          <Button
            onClick={() => {
              toast("CV not available.");
            }}
            className="rounded-full px-6 py-6 border-[2px]"
            variant="outline"
            aria-label="Download CV"
          >
            <p className="font-semibold">Download CV</p>
          </Button>
          <Button
            onClick={() => scrollToSection("contacts")}
            className="rounded-full px-6 py-6 border-[2px] border-transparent"
            variant="default"
            aria-label="Contact info"
          >
            <p className="font-semibold">Contact Info</p>
          </Button>
        </span>
        <Button
          onClick={() =>
            externalNavigate(`${About.github}`, {
              external: true,
              newTab: true,
            })
          }
          variant="ghost"
          className="rounded-full w-12 h-12 p-0 py-0 px-0"
          aria-label="Visit my github"
        >
          <Image
            width={40}
            height={40}
            alt="Github"
            src={
              theme === "dark"
                ? githubDark
                : theme === "light"
                ? githubWhite
                : systemTheme !== undefined
                ? systemTheme === "dark"
                  ? githubDark
                  : githubWhite
                : githubDark
            }
            className="p-2 w-10 h-10"
          />
        </Button>
      </div>

      <Button
        className="absolute right-[16px] bottom-[16px] rounded-full h-10 w-10 p-2"
        variant={"outline"}
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to about section"
      >
        <ChevronDownIcon />
      </Button>
    </section>
  );
}
