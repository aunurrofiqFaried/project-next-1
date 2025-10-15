"use client";

import React, { useEffect, useState } from "react";
import { Users, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SiswaChart from "@/components/dashboard/SiswaChart";
import GenderRatioChart from "@/components/dashboard/GenderRatioChart";
import BirthYearDistribution from "@/components/dashboard/BirthYearDistribution";
import ViolationTrendChart from "@/components/dashboard/TrenPelanggaran";
import ViolationTypesList from "@/components/dashboard/TipePelanggaran";
import TingkatPelanggaranList from "@/components/dashboard/TingkatPelanggaran";
import TopViolatorsList from "@/components/dashboard/TopPelanggaran";

// Tipe data
interface DataPie {
  name: string;
  value: number;
}

interface DataBar {
  nama_kelas: string;
  "Laki-Laki": number;
  "Perempuan": number;
}

interface DataTahunLahir {
  year: string;
  count: number;
}

interface PelanggaranTren {
  bulan: string;
  Aktif: number;
  Selesai: number;
}

interface JenisPelanggaran {
  jenis_pelanggaran: string;
  total: number;
}

interface TingkatPelanggaran {
  tingkat: string;
  total: number;
}

interface KelasPelanggaran {
  kelas: string;
  total: number;
}

interface DashboardData {
  totalSiswa: number;
  totalKelas: number;
  pie_data: DataPie[];
  bar_data: DataBar[];
  bar_data_birthyear: DataTahunLahir[];
  totalPelanggaran: number;
  pelanggaranTren: PelanggaranTren[];
  pelanggaranPerJenis: JenisPelanggaran[];
  pelanggaranPerTingkat: TingkatPelanggaran[];
  pelanggaranPerKelas: KelasPelanggaran[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Siswa
        </h1>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Siswa"
            value={data.totalSiswa}
            icon={Users}
            color="bg-blue-500"
            subtitle="Siswa aktif"
            badge="Aktif"
          />
          <StatCard
            title="Kelas"
            value={data.totalKelas}
            icon={GraduationCap}
            color="bg-green-500"
            subtitle="Kelas aktif"
          />
          <StatCard
            title="Rata-rata/Kelas"
            value={
              data.totalKelas
                ? Math.round(data.totalSiswa / data.totalKelas)
                : 0
            }
            icon={TrendingUp}
            color="bg-amber-500"
            subtitle="Siswa per kelas"
          />
          <StatCard
            title="Pelanggaran"
            value={data.totalPelanggaran}
            icon={AlertTriangle}
            color="bg-red-500"
            subtitle="Total pelanggaran"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SiswaChart data={data.bar_data} />
          <GenderRatioChart data={data.pie_data} />
        </div>

        {/* Pelanggaran Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ViolationTrendChart data={data.pelanggaranTren} />
          <ViolationTypesList
            data={data.pelanggaranPerJenis}
            total={data.totalPelanggaran}
          />
        </div>

        {/* Distribusi dan Statistik Tambahan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TingkatPelanggaranList data={data.pelanggaranPerTingkat} />
          <TopViolatorsList data={data.pelanggaranPerKelas} />
        </div>

        {/* Birth Year Distribution */}
        <BirthYearDistribution data={data.bar_data_birthyear} />
      </div>
    </div>
  );
}

// Komponen Kartu Statistik
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle: string;
  badge?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  badge,
}: StatCardProps) {
  return (
    
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}