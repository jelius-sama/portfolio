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
};

export default function Analytics({ pathname }: { pathname: string }) {
    const [data, setData] = useState<VisitorAnalytics[]>([]);

    useEffect(() => {
        fetch(`/api/analytics?page=${pathname}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            })
            .catch((err) => console.error("Error fetching analytics:", err));
    }, [pathname]);

    const columns: ColumnDef<VisitorAnalytics>[] = [
        { accessorKey: "visitor_id", header: "Visitor ID" },
        { accessorKey: "ip_address", header: "IP Address" },
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

    function normalizeCellValue(value: string): string | number {
        if (typeof value === "string") {
            return value.includes("::ffff:") ? normalizeIP(value) : value;
        }
        return value;
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
                                    <TableCell key={cell.id}>{normalizeCellValue(cell.getValue() as string)}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
