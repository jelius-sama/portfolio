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

const IN_DEV = true

export default function DevAlert() {
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
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
