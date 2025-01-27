import { About } from "@/constants/about-me";

export default function Footer() {
    return (
        <div className="flex w-full justify-center items-center">
            <p id="footer-text" className="text-sm sm:text-base">Copyright © {new Date().getFullYear()} {About.name}. All Rights Reserved.</p>
        </div>
    );
}
