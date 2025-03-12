"use client";

import { ColumnDef, useReactTable, getCoreRowModel, SortingState, getSortedRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import AnalyticsGraphs from "@/components/layout/analytics-charts";
import { PortfolioAnalytics } from "@/app/api/analytics/route";
import { useAtomValue } from "jotai";
import { refreshTrackerAtom } from "./navigation-menu";

export default function Analytics() {
    const [data, setData] = useState<PortfolioAnalytics[]>([]);
    const [sorting, setSorting] = useState<SortingState>([
        { id: "last_visited_at", desc: true } // Default sort: most recent visits first
    ]);
    const refreshTracker = useAtomValue(refreshTrackerAtom);

    const fetchAnalyticsData = async () => {
        try {
            const res = await fetch(`/api/analytics?page=1&limit=20`, {
                method: "GET",
                credentials: "include"
            });

            const analyticsData = await res.json();
            setData(analyticsData);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setData([]);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [refreshTracker]);

    const columns: ColumnDef<PortfolioAnalytics>[] = [
        { id: "sl_no", header: "S.No" },
        { accessorKey: "visitor_id", header: "Visitor ID" },
        { accessorKey: "ip_address", header: "IP Address" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "region", header: "Region" },
        { accessorKey: "country", header: "Country" },
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

    function formatToLocalTime(isoTimestamp: string): string {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (!isoRegex.test(isoTimestamp)) return isoTimestamp;

        const date = new Date(isoTimestamp);
        if (isNaN(date.getTime())) return isoTimestamp;

        return date.toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
        });
    }

    function normalizeCellValue(value: unknown): string | number | unknown {
        if (typeof value === "string" && value.startsWith(":ffff:")) return value.substring(7);
        if (typeof value !== "string") return value ?? "N/A";
        return formatToLocalTime(value);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
                Website Analytics <span className="text-muted-foreground text-sm">({data.length})</span>
            </h1>

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
                                <TableCell>{rowIndex + 1}</TableCell>
                                {row.getVisibleCells().map((cell, cellIndex) => {
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
