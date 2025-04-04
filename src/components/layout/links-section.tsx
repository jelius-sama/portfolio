"use client";

import Footer from "@/components/layout/footer";
import { About } from "@/constants/about-me";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LinksSection() {
  const user = "/assets/jelius.jpg";

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [bodyElement, setBodyElement] = useState<HTMLBodyElement | null>(null);
  const [linkToHome, setLinkToHome] = useState<HTMLButtonElement | null>(null);
  const [footerText, setFooterText] = useState<HTMLParagraphElement | null>(
    null
  );
  const [headerTitle, setHeaderTitle] = useState<HTMLParagraphElement | null>(
    null
  );
  const [headerTitleContainer, setHeaderTitleContainer] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      if (typeof window !== "undefined") {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const userAgent =
          navigator.userAgent || navigator.vendor || (window as any).opera;
        const isTouchDevice = /android|iPad|iPhone|iPod/i.test(userAgent);
        const screenWidth = window.innerWidth;

        // Consider it mobile if it's a touch device or has a small screen
        setIsMobile(isTouchDevice || screenWidth < 768);
      }
    };

    checkIfMobile();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkIfMobile);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkIfMobile);
      }
    };
  }, []);

  useEffect(() => {
    setBodyElement(document.querySelector("body"));
    setLinkToHome(document.getElementById("home") as HTMLButtonElement);
    setFooterText(
      document.getElementById("footer-text") as HTMLParagraphElement
    );
    setHeaderTitle(
      document.getElementById("header-title") as HTMLParagraphElement
    );
    setHeaderTitleContainer(
      document.getElementById("header-title-container") as HTMLDivElement
    );

    if (bodyElement) {
      bodyElement.classList.add(
        "tracking-tight",
        "!bg-gradient-to-b",
        "!from-[#F54C7A]",
        "!to-[rgb(239,68,68)]",
        "bg-fixed",
        "bg-cover",
        "bg-no-repeat"
      );
    }

    if (footerText) {
      footerText.classList.add("!text-white");
    }

    if (headerTitle && headerTitleContainer) {
      headerTitle.remove();
    }

    if (linkToHome) {
      linkToHome.textContent = "Portfolio";
      linkToHome.classList.add(
        "!text-white",
        "!transition-all",
        "!duration-300",
        "!border-none",
        "!bg-[#1a1a1a]",
        "hover:!bg-[#1a1a1a]",
        "!bg-opacity-35",
        "hover:!bg-opacity-25"
      );
    }

    return () => {
      if (bodyElement) {
        bodyElement.classList.remove(
          "tracking-tight",
          "!bg-gradient-to-b",
          "!from-[#FF72E1]",
          "!to-[#F54C7A]",
          "bg-fixed",
          "bg-cover",
          "bg-no-repeat"
        );
      }

      if (footerText) {
        footerText.classList.remove("!text-white");
      }

      if (headerTitle && headerTitleContainer) {
        headerTitleContainer.appendChild(headerTitle);
      }

      if (linkToHome) {
        linkToHome.textContent = "Home";
        linkToHome.classList.remove(
          "!text-white",
          "!transition-all",
          "!duration-300",
          "!border-none",
          "!bg-[#1a1a1a]",
          "hover:!bg-[#1a1a1a]",
          "!bg-opacity-35",
          "hover:!bg-opacity-25"
        );
      }
    };
  }, [footerText, linkToHome, bodyElement, headerTitle, headerTitleContainer]);

  const defaultStyle = {
    sm: "w-[100%] border-transparent",
    md: "lg:w-[70%] border-transparent",
  };

  const hoveredStyle = {
    sm: "w-[101%] border-red-500 scale-[1.01]", // Hover feedback with scaling
    md: "lg:w-[71%] border-red-500 scale-[1.01]",
  };

  const pressedStyle = {
    sm: "w-[99%] border-red-500 scale-[.99]", // Press feedback with scaling
    md: "lg:w-[69%] border-red-500 scale-[.99]",
  };

  return (
    <section id="links-root" className="w-full mt-[64px]">
      <section className="min-h-screen w-full items-center flex flex-col justify-center gap-x-20 relative">
        <div className="w-full mb-[64px]">
          <div className="w-full flex items-center justify-center flex-col gap-y-4">
            <Image
              alt={`${About.firstName}`}
              width={100}
              height={100}
              id="links_profile_pic"
              src={user}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full"
            />
            <p className="text-center font-semibold text-2xl md:text-3xl !text-white">
              {About.name}
            </p>
          </div>

          <div className="small-container flex flex-col items-center justify-center mt-5">
            {About.social_links.map((link, index) => (
              <a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-row flex-nowrap gap-x-12 pl-20 items-center my-3 bg-white py-3 rounded-md transition-all duration-300 border-2 transform ${activeIndex === index
                    ? isMobile
                      ? pressedStyle.md
                      : hoveredStyle.md
                    : defaultStyle.md
                  } ${activeIndex === index
                    ? isMobile
                      ? pressedStyle.sm
                      : hoveredStyle.sm
                    : defaultStyle.sm
                  }`}
                onTouchStart={() => setActiveIndex(index)}
                onTouchEnd={() => setActiveIndex(null)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Image
                  width={36}
                  height={36}
                  src={link.icon.light}
                  alt={link.title + "Icon"}
                  className="w-[36px] h-[36px] aspect-square bg-transparent transform transition-all duration-300"
                />
                <span className="text-[#6f515c] font-semibold transform transition-all duration-300">
                  {link.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="absolute w-full bottom-[calc(16px_+_16px)] flex flex-col items-center justify-center gap-y-4">
          <Footer />
        </div>
      </section>
    </section>
  );
}
