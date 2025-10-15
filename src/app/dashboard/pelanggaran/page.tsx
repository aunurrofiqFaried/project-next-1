"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import PelanggaranTable from "@/components/pelanggaran/PelanggaranTabel";
import AddPelanggaranDialog from "@/components/pelanggaran/AddPelanggaranDialog";
import EditPelanggaranDialog from "@/components/pelanggaran/EditPelanggaranDialog";
import PelanggaranFilters from "@/components/pelanggaran/FilterPelanggaran";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportTabel from "@/components/pelanggaran/ExportTable";
import type { Pelanggaran, Siswa } from "@/types";
import { supabase } from "@/lib/supabase";

export default function PelanggaranPage() {
  const [violations, setViolations] = useState<Pelanggaran[]>([]);
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Pelanggaran | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    severity: "",           // pakai `tingkat`
    violationType: "",      // pakai `jenis_pelanggaran`
  });
  const [pageSize, setPageSize] = useState(10);


  // Fetch data dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch siswa data
      const { data: siswaData, error: siswaError } = await supabase
        .from("siswas")
        .select("*, kelas(*)")
        .order("id", { ascending: true });

      if (siswaError) {
        console.error("Error fetching siswa:", siswaError);
      } else {
        setDataSiswa(siswaData || []);
      }

      // Fetch pelanggarans data
      const { data: pelanggaranData, error: pelanggaranError } = await supabase
        .from("pelanggarans")
        .select("*, siswa:siswas(*, kelas(*))")
        .order("id", { ascending: true });

      if (pelanggaranError) {
        console.error("Error fetching pelanggarans:", pelanggaranError);
      } else {
        setViolations(pelanggaranData || []);
      }
    };

    fetchData();
  }, []);

  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      if (filters.startDate && new Date(v.tanggal) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(v.tanggal) > new Date(filters.endDate)) return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.severity && v.tingkat !== filters.severity) return false;
      if (filters.violationType && v.jenis_pelanggaran !== filters.violationType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (v.siswa?.nama?.toLowerCase().includes(q)) ||
          (v.siswa?.nis?.toLowerCase().includes(q)) ||
          (v.siswa?.kelas?.kelas?.toLowerCase().includes(q)) ||
          v.jenis_pelanggaran.toLowerCase().includes(q) ||
          v.deskripsi.toLowerCase().includes(q) ||
          v.status.toLowerCase().includes(q) ||
          v.tingkat.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [violations, filters, search]);

  const handleAdd = async (newV: Omit<Pelanggaran, "id" | "created_at" | "updated_at" | "siswa" | "dilaporkan_oleh_user">) => {
    const { data: inserted, error } = await supabase
      .from("pelanggarans")
      .insert([newV])
      .select("*, siswa:siswas(*, kelas(*))")
      .single();

    if (error) {
      console.error("Error adding pelanggaran:", error);
      return;
    }

    setViolations((prev) => [...prev, inserted]);
    setAddDialogOpen(false);
  };

  const handleEdit = (v: Pelanggaran) => {
    setEditingViolation(v);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (updated: Pelanggaran) => {
    // Bersihkan empty string menjadi null untuk field optional
    const cleanedUpdate = {
      siswa_id: updated.siswa_id,
      dilaporkan_oleh: updated.dilaporkan_oleh,
      jenis_pelanggaran: updated.jenis_pelanggaran,
      tingkat: updated.tingkat,
      poin: updated.poin,
      tanggal: updated.tanggal,
      waktu: updated.waktu,
      lokasi: updated.lokasi,
      deskripsi: updated.deskripsi,
      status: updated.status,
      tindakan: updated.tindakan?.trim() || null,
      tanggal_tindak_lanjut: updated.tanggal_tindak_lanjut?.trim() || null,
      catatan: updated.catatan?.trim() || null,
      url: updated.url?.trim() || null,
    };

    const { data: updatedData, error } = await supabase
      .from("pelanggarans")
      .update(cleanedUpdate)
      .eq("id", updated.id)
      .select("*, siswa:siswas(*, kelas(*))")
      .single();

    if (error) {
      console.error("Error updating pelanggaran:", error);
      return;
    }

    setViolations((prev) => prev.map((v) => (v.id === updated.id ? updatedData : v)));
    setEditDialogOpen(false);
    setEditingViolation(null);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("pelanggarans").delete().eq("id", id);
    
    if (error) {
      console.error("Error deleting pelanggaran:", error);
      return;
    }
    
    setViolations((prev) => prev.filter((v) => v.id !== id));
  };
  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "", status: "", severity: "", violationType: "" });
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
      <ExportTabel data={filteredViolations} />

      <Card className="p-4 shadow">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 text-sm w-full sm:w-[300px]"
              />
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" /> Filter
              </Button>
              {showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-20 h-9 text-sm">
                <SelectValue placeholder="Jumlah" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddPelanggaranDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAdd} dataSiswa={dataSiswa} />
          </div>

          {showFilters && (
            <PelanggaranFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              search={search}
              setSearch={setSearch}
              filters={filters}
              onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
              onClearFilters={clearFilters}
              filterOptions={{
                types: [...new Set(violations.map(v => v.jenis_pelanggaran))],
                severities: ["Ringan", "Sedang", "Berat"],
                statuses: ["Aktif", "Selesai"],
              }}
              filteredCount={filteredViolations.length}
              totalCount={violations.length}
            />
          )}

          <PelanggaranTable
            violations={filteredViolations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={pageSize}
          />
        </div>
      </Card>

      <EditPelanggaranDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        violation={editingViolation}
        onUpdate={handleUpdate}
      />
    </div>
  );
}