import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json([
        {
            os_version: "unknown",
            page_url: "/",
            visitor_id: "171.60.237.108-Firefox-Linux",
            os: "Linux",
            referrer_url: "https://jelius.dev/",
            device_model: "unknown",
            ip_address: "171.60.237.108",
            last_visited_at: "2025-02-20T14:20:06.489Z",
            user_agent: "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
            browser: "Firefox",
            browser_version: "135.0",
            first_visited_at: "2025-02-20T14:19:05.543Z",
            visit_count: "2",
            device_type: "desktop",
        },
        {
            os_version: "unknown",
            page_url: "/",
            visitor_id: "171.60.237.108-Firefox-Linux",
            os: "Linux",
            referrer_url: "https://jelius.dev/",
            device_model: "unknown",
            ip_address: "171.60.237.108",
            last_visited_at: "2025-02-20T14:20:06.489Z",
            user_agent: "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
            browser: "Firefox",
            browser_version: "135.0",
            first_visited_at: "2025-02-20T14:19:05.543Z",
            visit_count: "2",
            device_type: "desktop",
        },
    ],
    );
}
