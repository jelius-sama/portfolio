"use client";

import { ColumnDef, useReactTable, getCoreRowModel, SortingState, getSortedRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import AnalyticsGraphs from "@/components/layout/analytics-charts";
import { IpApi } from "@/app/analytics/page";
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { refreshTrackerAtom } from "@/components/layout/navigation-menu";

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
    city?: string;
    region_name?: string;
    country_name?: string;
};

export const ipProviderAtom = atom<undefined | IpApi>(undefined)

export default function Analytics({ pathname, ipApi }: { pathname: string, ipApi: { url: string, apiKey: string | null, provider: IpApi } }) {
    const [data, setData] = useState<VisitorAnalytics[]>([]);
    const [sorting, setSorting] = useState<SortingState>([
        { id: "last_visited_at", desc: true } // Default sort: most recent visits first
    ]);
    const setIpProvider = useSetAtom(ipProviderAtom);
    const refreshTracker = useAtomValue(refreshTrackerAtom)

    useEffect(() => {
        setIpProvider(ipApi.provider)
    }, [ipApi.provider])

    useEffect(() => {
        // Cache for IP data to avoid duplicate API calls
        const ipCache = new Map();
        
        const fetchGeoData = async (ip: string) => {
            const normalizedIP = normalizeIP(ip);
            
            // Return cached data if available
            if (ipCache.has(normalizedIP)) {
                return ipCache.get(normalizedIP);
            }
            
            // Construct URL based on whether API key exists
            const url = ipApi.apiKey === null 
                ? `${ipApi.url}/${normalizedIP}` 
                : `${ipApi.url}/${normalizedIP}?${ipApi.apiKey}`;
                
            try {
                const res = await fetch(url);
                const geoData = await res.json();
                
                // Format data based on provider
                const formattedData = ipApi.provider === "ipapi" 
                    ? { 
                        city: geoData.city, 
                        region_name: geoData.region_name, 
                        country_name: geoData.country_name 
                    } 
                    : { 
                        city: geoData.cityName, 
                        region_name: geoData.regionName, 
                        country_name: geoData.countryName 
                    };
                    
                // Cache the result
                ipCache.set(normalizedIP, formattedData);
                return formattedData;
            } catch (err) {
                console.error(`Error fetching geolocation for ${normalizedIP}:`, err);
                return null;
            }
        };
    
        const analyticsAPIUrl = `/api/analytics?page=${pathname}`;
            
        fetch(analyticsAPIUrl)
            .then((res) => res.json())
            .then(async (analyticsData) => {
                try {
                    // Process data in batches to avoid overwhelming the API service
                    const batchSize = 5;
                    const enrichedData = [];
                    
                    for (let i = 0; i < analyticsData.length; i += batchSize) {
                        const batch = analyticsData.slice(i, i + batchSize);
                        const batchResults = await Promise.all(
                            batch.map(async (entry: VisitorAnalytics) => {
                                const geoData = await fetchGeoData(entry.ip_address);
                                return geoData ? { ...entry, ...geoData } : entry;
                            })
                        );
                        enrichedData.push(...batchResults);
                    }
                    
                    setData(enrichedData);
                } catch (err) {
                    console.error("Error processing analytics data:", err);
                    setData(analyticsData); // Set original data on error
                }
            })
            .catch((err) => {
                console.error("Error fetching analytics:", err);
                setData([]); // Set empty array on fetch error
            });
    }, [pathname, ipApi.url, ipApi.apiKey, ipApi.provider, refreshTracker]);

    const columns: ColumnDef<VisitorAnalytics>[] = [
        { id: "sl_no", header: "S.No" },
        { accessorKey: "visitor_id", header: "Visitor ID" },
        { accessorKey: "ip_address", header: "IP Address" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "region_name", header: "Region" },
        { accessorKey: "country_name", header: "Country" },
        { accessorKey: "browser", header: "Browser" },
        { accessorKey: "browser_version", header: "Version" },
        { accessorKey: "os", header: "OS" },
        { accessorKey: "device_type", header: "Device Type" },
        { accessorKey: "page_url", header: "Visited Page" },
        { accessorKey: "visit_count", header: "Visits" },
        {
            accessorKey: "last_visited_at",
            header: "Last Visit",
            sortingFn: "datetime" // Use datetime sorting for date columns
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    function normalizeIP(ip: string): string {
        return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
    }
    
    function formatToLocalTime(isoTimestamp: string): string {
        // Strict regex to match ISO 8601 format with 'Z' (UTC)
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

        if (!isoRegex.test(isoTimestamp)) {
            return isoTimestamp;
        }

        const date = new Date(isoTimestamp);
        if (isNaN(date.getTime())) return isoTimestamp; // Double-check validity

        return date.toLocaleString(undefined, {
            weekday: "long",  // e.g., "Saturday"
            year: "numeric",
            month: "long",    // e.g., "March"
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short", // e.g., "GMT+5"
        });
    }

    function normalizeCellValue(value: unknown): string | number | unknown {
        if (typeof value !== "string") return value ?? "N/A";
        return value.startsWith("::ffff:") ? normalizeIP(value) : formatToLocalTime(value);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Website Analytics <span className="text-muted-foreground text-sm">({data.length})</span></h1>
            <Card className="p-4 mb-6">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.column.columnDef.header as string}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row, rowIndex) => (
                            <TableRow key={row.id}>
                                {/* Special handling for the first column (S.No) */}
                                <TableCell>{rowIndex + 1}</TableCell>

                                {/* All other cells except the first one */}
                                {row.getVisibleCells().map((cell, cellIndex) => {
                                    // Skip the first column since we manually added it
                                    if (cellIndex === 0 && cell.column.id === "sl_no") return null;
                                    return (
                                        <TableCell key={cell.id}>
                                            {normalizeCellValue(cell.getValue() as string) as string}
                                        </TableCell>
                                    );
                                }).filter(Boolean)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <AnalyticsGraphs data={data} />
        </div>
    );
}