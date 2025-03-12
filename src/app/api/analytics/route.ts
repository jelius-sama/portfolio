import { createAdminClient } from "@/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import crypto from 'crypto'

export const dynamic = "force-dynamic";

export type PortfolioAnalytics = {
  visitor_id: string;
  ip_address: string;
  user_agent: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device_type: string;
  device_model: string;
  referrer_url: string;
  page_url: string;
  visit_count: number;
  first_visited_at: string;
  last_visited_at: string;
  country: string;
  region: string;
  city: string;
};

// Normalize IP address to IPv4 format
function normalizeIP(ip: string): string {
  return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
}

export async function GET(req: NextRequest) {
  const authCookie = cookies().get("admin-pass");

  const isAuthenticated = () => {
    if (!authCookie) return false;

    try {
      if (typeof process.env.ADMIN_PASSWORD !== "string") {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
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

  if (!authenticated) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from("portfolio_analytics")
    .select("*")
    .range(offset, offset + limit - 1) as { data: PortfolioAnalytics[] | null, error: PostgrestError | null };

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const allowedOrigins = [
    "https://jelius.dev",
    "https://www.jelius.dev",
    "https://dashboard.jelius.dev",
    "https://portfolio.jelius.dev",
  ];

  const origin = req.headers.get("origin");

  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const rawIpAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipAddress = normalizeIP(rawIpAddress); // Normalize IP address format
  const userAgentString = req.headers.get("user-agent") || "unknown";
  const referrerUrl = req.headers.get("referer") || "direct";
  const pageUrl = req.nextUrl.searchParams.get("page") || "unknown";

  const parser = new UAParser(userAgentString);
  const { browser, os, device } = parser.getResult();

  const browserName = browser.name || "unknown";
  const browserVersion = browser.version || "unknown";
  const osName = os.name || "unknown";
  const osVersion = os.version || "unknown";
  const deviceType = device.type || "desktop";
  const deviceModel = device.model || "unknown";

  const visitorId = `${ipAddress}-${browserName}-${osName}`;

  // Fetch geolocation data
  let country = "unknown";
  let region = "unknown";
  let city = "unknown";

  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ipAddress}`);
    if (!geoRes.ok) {
      throw new Error(`Failed to fetch geolocation data. Status: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();
    if (geoData.status === "success") {
      country = geoData.country || "unknown";
      region = geoData.regionName || "unknown";
      city = geoData.city || "unknown";
    }
  } catch (err) {
    console.error(`Geolocation error for IP: ${ipAddress}`, err);
    return NextResponse.json(
      { error: "Failed to retrieve geolocation data." },
      { status: 502 }
    );
  }

  try {
    const { data: existingVisit, error: fetchError } = await supabase
      .from("portfolio_analytics")
      .select("visitor_id, visit_count")
      .eq("visitor_id", visitorId)
      .eq("page_url", pageUrl)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingVisit) {
      const { error: updateError } = await supabase
        .from("portfolio_analytics")
        .update({
          visit_count: Number(existingVisit.visit_count) + 1,
          last_visited_at: new Date().toISOString(),
        })
        .eq("visitor_id", visitorId)
        .eq("page_url", pageUrl);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase.from("portfolio_analytics").insert({
        visitor_id: visitorId,
        ip_address: ipAddress,
        user_agent: userAgentString,
        browser: browserName,
        browser_version: browserVersion,
        os: osName,
        os_version: osVersion,
        device_type: deviceType,
        device_model: deviceModel,
        referrer_url: referrerUrl,
        page_url: pageUrl,
        visit_count: 1,
        first_visited_at: new Date().toISOString(),
        last_visited_at: new Date().toISOString(),
        country,
        region,
        city,
      });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
