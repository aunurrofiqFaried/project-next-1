"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Target } from "lucide-react";

const VIOLATION_COLORS = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"];

export default function ViolationTypesList({
  data, total
}: { data: any[], total: number }) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Jenis Pelanggaran
          </CardTitle>
          <Badge variant="secondary">Top 5</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((violation, index) => (
            <div key={violation.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VIOLATION_COLORS[index] }} />
                <span className="font-medium">{violation.type}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20">
                  <Progress value={violation.percentage} className="h-2" />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {violation.count}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Total pelanggaran</span>
          <span className="font-medium">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
