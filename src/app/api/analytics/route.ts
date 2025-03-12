import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

type VisitorAnalytics = {
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
};

async function initializeDB(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS visitor_analytics (
      visitor_id TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      user_agent TEXT,
      browser TEXT,
      browser_version TEXT,
      os TEXT,
      os_version TEXT,
      device_type TEXT,
      device_model TEXT,
      referrer_url TEXT,
      page_url TEXT NOT NULL,
      visit_count INTEGER DEFAULT 1,
      first_visited_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_visited_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET(req: NextRequest) {
  const dbPath = path.resolve(process.cwd(), "analytics.sqlite");
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  });

  await initializeDB(db);

  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
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

  const existingVisit = await db.get<Partial<VisitorAnalytics>>(
    `SELECT visitor_id, visit_count FROM visitor_analytics WHERE visitor_id = ? AND page_url = ?`,
    [visitorId, pageUrl]
  );

  if (existingVisit) {
    await db.run(
      `UPDATE visitor_analytics 
       SET visit_count = visit_count + 1, last_visited_at = CURRENT_TIMESTAMP 
       WHERE visitor_id = ? AND page_url = ?`,
      [visitorId, pageUrl]
    );
  } else {
    await db.run(
      `INSERT INTO visitor_analytics 
       (visitor_id, ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, referrer_url, page_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        visitorId,
        ipAddress,
        userAgentString,
        browserName,
        browserVersion,
        osName,
        osVersion,
        deviceType,
        deviceModel,
        referrerUrl,
        pageUrl,
      ]
    );
  }

  const data = await db.all<VisitorAnalytics[]>(`SELECT * FROM visitor_analytics;`);

  function normalizeItem(item: Partial<VisitorAnalytics>): VisitorAnalytics {
    return {
      visitor_id: item.visitor_id || "unknown",
      ip_address: item.ip_address || "unknown",
      user_agent: item.user_agent || "unknown",
      browser: item.browser || "unknown",
      browser_version: item.browser_version || "unknown",
      os: item.os || "unknown",
      os_version: item.os_version || "unknown",
      device_type: item.device_type || "desktop",
      device_model: item.device_model || "unknown",
      referrer_url: item.referrer_url || "direct",
      page_url: item.page_url || "unknown",
      visit_count: item.visit_count ? Number(item.visit_count) : 0,
      first_visited_at: item.first_visited_at || "unknown",
      last_visited_at: item.last_visited_at || "unknown",
    };
  }

  return NextResponse.json(data.map(normalizeItem));
}