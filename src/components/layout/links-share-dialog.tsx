"use client";

import { Link2Icon, MailIcon, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { About } from "@/constants/about-me";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { copyString } from "@/utils";
import Image from "next/image";
import ENV from "@/root/env.mjs";
import X from "@/icons/x";
import { DownloadIcon } from "@radix-ui/react-icons";

type ShareProps = {
  [key: string]: {
    icon_node: React.ReactNode;
    action: ({ text, url }: { text: string; url: string }) => void;
  };
}[];

const ShareURL = ENV.site + ENV.routes.links;
const ShareText = "Check out Jelius's social media profiles";

const SHARE: ShareProps = [
  {
    "Copy link": {
      icon_node: <Link2Icon height={30} width={30} />,
      action: function ({ url }) {
        copyString(url);
      },
    },
    Email: {
      icon_node: <MailIcon height={30} width={30} />,
      action: function ({ text, url }) {
        if (typeof window !== "undefined") {
          window.open(
            `mailto:?subject=${encodeURIComponent(
              text
            )}&body=${encodeURIComponent(url)}`,
            "_blank"
          );
        }
      },
    },
    X: {
      icon_node: (
        <X width={"30px"} height={"30px"} />
      ),
      action: function ({ text, url }) {
        if (typeof window !== "undefined") {
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text + " - "
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
        }
      },
    },
    iMessage: {
      icon_node: (
        <Image
          width={30}
          height={30}
          src="/assets/iMessage.png"
          className="w-[30px] h-[30px]"
          alt="iMessage icon"
        />
      ),
      action: function ({ text, url }) {
        if (typeof window !== "undefined") {
          window.open(
            `sms:&body=${encodeURIComponent(text + " - ")} ${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
        }
      },
    },
    WhatsApp: {
      icon_node: (
        <Image
          width={30}
          height={30}
          src="/assets/whatsapp-logo.png"
          className="w-[30px] h-[30px]"
          alt=" WhatsApp icon"
        />
      ),
      action: function ({ text, url }) {
        if (typeof window !== "undefined") {
          window.open(`https://wa.me/?text=${text} - ${url}`, "_blank");
        }
      },
    },
  },
];
export default function LinksShareDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            aria-label="Share this page"
            id="share-button"
            variant={"secondary"}
            size={"icon"}
            className="!text-white !transition-all !duration-300 !rounded-full !h-9 !px-[0.60rem] !bg-[#1a1a1a] !bg-opacity-35 hover:!bg-opacity-25"
          >
            <ShareIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full font-kite">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <ShareForm />
          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button aria-label="Cancel sharing">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Share this page"
          id="share-button"
          variant={"secondary"}
          size={"icon"}
          className="!text-white !transition-all !duration-300 !rounded-full !h-9 !px-[0.60rem] !bg-[#1a1a1a] !bg-opacity-35 hover:!bg-opacity-25"
        >
          <ShareIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="font-kite h-[96%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Share</DrawerTitle>
        </DrawerHeader>
        <ShareForm className="px-4" />
        <DrawerFooter className="pt-8">
          <DrawerClose asChild>
            <Button aria-label="Cancel sharing">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ShareForm({ className }: React.ComponentProps<"section">) {
  // const user = "/assets/jelius.jpg";

  return (
    <section className={cn("", className)}>
      <div className="flex flex-col gap-y-8">
        {/* <div className="bg-[#342a2b] flex flex-col items-center justify-center rounded-md py-8 gap-y-4">
          <Image
            alt={`${About.firstName}`}
            height={80}
            width={80}
            src={user}
            className="w-20 h-20 rounded-full"
          />
          <p className="text-center font-semibold text-2xl md:text-3xl !text-white">
            {About.name}
          </p> */}
        <div className="aspect-[12/7] flex flex-col items-center justify-center rounded-md overflow-hidden relative group">
          <Image
            alt={`${About.firstName}`}
            height={560}
            width={960}
            objectFit="contain"
            src={'/assets/links.png'}
            className={`w-full h-full group-hover:opacity-50 transition-opacity duration-300 ease-in-out'
              }`}
          />
          <Button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/assets/links.png';
              link.download = 'jelius-links-qr.png';
              link.click();
            }}
            size={"icon"}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out hover:bg-secondary"
            variant="secondary"
          >
            <DownloadIcon />
          </Button>
        </div>
        {/* </div> */}

        <div className="flex items-center justify-center">
          <Carousel className="w-[calc(100%_-_100px)]">
            <CarouselContent>
              {Object.entries(SHARE[0]).map(([key, value], index) => (
                <CarouselItem key={index} className="basis-1/3">
                  <div
                    onClick={() =>
                      value.action({ text: ShareText, url: ShareURL })
                    }
                    className="p-1 flex gap-y-1 flex-col flex-nowrap items-center justify-center cursor-pointer select-none"
                  >
                    {value.icon_node}
                    <span className="text-sm">{key}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
