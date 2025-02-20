import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

export const dynamic = "force-dynamic";

const client = new DynamoDBClient();

export async function GET(req: NextRequest) {
  const TableName = Resource.PortfolioAnalytics.name; 

  // Extract request details
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgentString = req.headers.get("user-agent") || "unknown";
  const referrerUrl = req.headers.get("referer") || "direct";
  const pageUrl = req.nextUrl.searchParams.get("page") || "unknown";

  // Parse user-agent
  const parser = new UAParser(userAgentString);
  const { browser, os, device } = parser.getResult();

  const browserName = browser.name || "unknown";
  const browserVersion = browser.version || "unknown";
  const osName = os.name || "unknown";
  const osVersion = os.version || "unknown";
  const deviceType = device.type || "desktop";
  const deviceModel = device.model || "unknown";

  const visitorId = `${ipAddress}-${browserName}-${osName}`;

  // Check if visitor exists
  const existingVisit = await client.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: "visitor_id = :visitor_id AND page_url = :page_url",
      ExpressionAttributeValues: {
        ":visitor_id": { S: visitorId },
        ":page_url": { S: pageUrl },
      },
    })
  );

  if (existingVisit.Items && existingVisit.Items.length > 0) {
    await client.send(
      new UpdateItemCommand({
        TableName,
        Key: {
          visitor_id: { S: visitorId },
          page_url: { S: pageUrl },
        },
        UpdateExpression: "SET visit_count = visit_count + :inc, last_visited_at = :now",
        ExpressionAttributeValues: {
          ":inc": { N: "1" },
          ":now": { S: new Date().toISOString() },
        },
      })
    );
  } else {
    await client.send(
      new PutItemCommand({
        TableName,
        Item: {
          visitor_id: { S: visitorId },
          ip_address: { S: ipAddress },
          user_agent: { S: userAgentString },
          browser: { S: browserName },
          browser_version: { S: browserVersion },
          os: { S: osName },
          os_version: { S: osVersion },
          device_type: { S: deviceType },
          device_model: { S: deviceModel },
          referrer_url: { S: referrerUrl },
          page_url: { S: pageUrl },
          visit_count: { N: "1" },
          first_visited_at: { S: new Date().toISOString() },
          last_visited_at: { S: new Date().toISOString() },
        },
      })
    );
  }

  // Retrieve all analytics data
  const data = await client.send(new ScanCommand({ TableName }));

  // Normalize response
  function normalizeItem(item: Record<string, { S?: string; N?: string }>) {
    return {
      visitor_id: item.visitor_id?.S || "unknown",
      ip_address: item.ip_address?.S || "unknown",
      user_agent: item.user_agent?.S || "unknown",
      browser: item.browser?.S || "unknown",
      browser_version: item.browser_version?.S || "unknown",
      os: item.os?.S || "unknown",
      os_version: item.os_version?.S || "unknown",
      device_type: item.device_type?.S || "unknown",
      device_model: item.device_model?.S || "unknown",
      referrer_url: item.referrer_url?.S || "direct",
      page_url: item.page_url?.S || "unknown",
      visit_count: item.visit_count?.N ? Number(item.visit_count.N) : 0,
      first_visited_at: item.first_visited_at?.S || "unknown",
      last_visited_at: item.last_visited_at?.S || "unknown",
    };
  }

  return NextResponse.json((data.Items || []).map(normalizeItem));
}
