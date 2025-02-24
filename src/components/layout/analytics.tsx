"use client";

import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

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

export default function Analytics({ pathname }: { pathname: string }) {
    const [data, setData] = useState<VisitorAnalytics[]>([]);

    useEffect(() => {
        fetch(process.env.NODE_ENV === "development" ? `/api/test` : `/api/analytics?page=${pathname}`)
            .then((res) => res.json())
            .then(async (analyticsData) => {
                const enrichedData = await Promise.all(
                    analyticsData.map(async (entry: VisitorAnalytics) => {
                        const ip = normalizeIP(entry.ip_address);
                        try {
                            const res = await fetch(`https://api.ipapi.com/${ip}?access_key=${process.env.NEXT_PUBLIC_IP_LOCATION_PROVIDER_API_KEY}`);
                            const geoData = await res.json();
                            return { ...entry, city: geoData.city, region_name: geoData.region_name, country_name: geoData.country_name };
                        } catch (err) {
                            console.error(`Error fetching geolocation for ${ip}:`, err);
                            return entry;
                        }
                    })
                );
                setData(enrichedData);
            })
            .catch((err) => console.error("Error fetching analytics:", err));
    }, [pathname]);

    const columns: ColumnDef<VisitorAnalytics>[] = [
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
        { accessorKey: "last_visited_at", header: "Last Visit" },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    function normalizeIP(ip: string): string {
        return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
    }

    function normalizeCellValue(value: unknown): string | number | unknown {
        if (typeof value !== "string") return value ?? "N/A";
        return value.startsWith("::ffff:") ? normalizeIP(value) : value;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Website Analytics</h1>
            <Card className="p-4">
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
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{normalizeCellValue(cell.getValue() as string) as string}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
