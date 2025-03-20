"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

const IN_DEV = true

export default function DevAlert() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const isHeightSmall = useMediaQuery("(max-height: 700px)")

    if (isDesktop) {
        return (
            <Dialog defaultOpen={IN_DEV}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Notice</DialogTitle>
                        <DialogDescription>
                            Currently in Development!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center space-x-2">
                        This website is currently in development, and its content is for testing purposes only; it does not reflect any real facts or accurate information.
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer defaultOpen={IN_DEV}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Notice</DrawerTitle>
                    <DrawerDescription>
                        Currently in Development!
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex items-start space-x-2 p-4" style={{ height: `${isHeightSmall ? `60vh` : `75vh`}` }}>
                    This website is currently in development, and its content is for testing purposes only; it does not reflect any real facts or accurate information.
                </div>

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
