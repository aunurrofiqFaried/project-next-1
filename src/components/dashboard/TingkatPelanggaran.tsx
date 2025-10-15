"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function SeverityDistributionList({ data }: { data: any[] }) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          Tingkat Pelanggaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map(item => (
            <div key={item.severity} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.severity}</span>
              </div>
              <Badge variant="outline">{item.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
