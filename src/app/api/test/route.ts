import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        Items: [
            {
                os_version: { S: "unknown" },
                page_url: { S: "/" },
                visitor_id: { S: "171.60.237.108-Firefox-Linux" },
                os: { S: "Linux" },
                referrer_url: { S: "https://jelius.dev/" },
                device_model: { S: "unknown" },
                ip_address: { S: "171.60.237.108" },
                last_visited_at: { S: "2025-02-20T14:20:06.489Z" },
                user_agent: {
                    S: "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
                },
                browser: { S: "Firefox" },
                browser_version: { S: "135.0" },
                first_visited_at: { S: "2025-02-20T14:19:05.543Z" },
                visit_count: { N: "2" },
                device_type: { S: "desktop" },
            },
        ],
    });
}
