import { AuthenticateAdminUser } from "@/components/layout/admin-access";
import Analytics from "@/components/layout/analytics";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import crypto from 'crypto'
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const pathname = headers().get("x-current-path") || "/analytics";
    const authCookie = cookies().get("admin-pass");

    const isAuthenticated = () => {
        if (!authCookie) return false;

        try {
            if (typeof process.env.ADMIN_PASSWORD !== "string") {
                notFound();
            }
            
            const hashedInput = crypto
                .createHash('sha256')
                .update(process.env.ADMIN_PASSWORD)
                .digest('hex');

            return hashedInput === authCookie.value;
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    const authenticated = isAuthenticated();

    return (
        <section className="w-full mt-[64px]">
            {authenticated ? (
                <Analytics pathname={pathname} />
            ) : (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-lg">
                    <AuthenticateAdminUser />
                </div>
            )}
        </section>
    );
}
