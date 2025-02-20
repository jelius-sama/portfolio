import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

// Function to track visitor analytics
export async function GET(req: NextRequest) {
  // Ensure database file exists
  const dbPath = path.resolve(process.cwd(), "analytics.sqlite");
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
  }

  // Open database
  const dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  });

  // Initialize the database and create the table if it doesn't exist
  async function initializeDB() {
    const db = await dbPromise;
    await db.exec(`
    CREATE TABLE IF NOT EXISTS visitor_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  initializeDB();


  const db = await dbPromise;

  // Get IP address (Next.js does not expose req.ip directly)
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const userAgentString = req.headers.get("user-agent") || "unknown";
  const referrerUrl = req.headers.get("referer") || "direct";
  const pageUrl = req.nextUrl.searchParams.get("page") || "unknown";

  // Parse user-agent for more details
  const parser = new UAParser(userAgentString);
  const { browser, os, device } = parser.getResult();

  const browserName = browser.name || "unknown";
  const browserVersion = browser.version || "unknown";
  const osName = os.name || "unknown";
  const osVersion = os.version || "unknown";
  const deviceType = device.type || "desktop"; // Default to desktop if undefined
  const deviceModel = device.model || "unknown";

  // Generate a visitor_id (simplified; could use hashed IP + User-Agent)
  const visitorId = `${ipAddress}-${browserName}-${osName}`;

  // Check if visitor already accessed the page
  const existingVisit = await db.get(
    `SELECT id, visit_count FROM visitor_analytics WHERE visitor_id = ? AND page_url = ?`,
    [visitorId, pageUrl]
  );

  if (existingVisit) {
    // Update visit count and last_visited_at
    await db.run(
      `UPDATE visitor_analytics 
       SET visit_count = visit_count + 1, last_visited_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [existingVisit.id]
    );
  } else {
    // Insert new visitor record
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

  const data = await db.all(
    `SELECT * FROM visitor_analytics;`
  );

  return NextResponse.json(data);
}
