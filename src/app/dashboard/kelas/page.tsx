"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import KelasTable from "@/components/kelas/Kelastable";
import AddKelasDialog from "@/components/kelas/AddKelasDialog";
import EditKelasDialog from "@/components/kelas/EditKelasDialog";
import { Kelas } from "@/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ kelas: string }>({ kelas: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching kelas...");

      const { data, error } = await supabase
        .from("kelas")
        .select("*")
        .order("id", { ascending: true });

      console.log("📊 Kelas data:", { data, error });

      if (error) {
        console.error("❌ Error fetching kelas:", error);
        alert("Gagal mengambil data kelas: " + error.message);
        return;
      }

      setKelas(data || []);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Tambah kelas
  const handleAdd = async () => {
    try {
      if (!form.kelas.trim()) {
        alert("Nama kelas tidak boleh kosong");
        return;
      }

      console.log("➕ Adding kelas:", form.kelas);

      const { data, error } = await supabase
        .from("kelas")
        .insert([{ kelas: form.kelas }])
        .select()
        .single();

      if (error) {
        console.error("❌ Error adding kelas:", error);
        alert("Gagal menambahkan kelas: " + error.message);
        return;
      }

      console.log("✅ Kelas added:", data);

      // Update local state
      setKelas((prev) => [...prev, data]);
      setAddDialogOpen(false);
      setForm({ kelas: "" });
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Terjadi kesalahan yang tidak terduga");
    }
  };

  // 🔹 Edit kelas
  const handleEditClick = (item: Kelas) => {
    setEditingId(item.id);
    setForm({ kelas: item.kelas });
    setEditDialogOpen(true);
  };

  // 🔹 Update kelas
  const handleUpdate = async () => {
    try {
      if (editingId === null) return;

      if (!form.kelas.trim()) {
        alert("Nama kelas tidak boleh kosong");
        return;
      }

      console.log("✏️ Updating kelas:", editingId, form.kelas);

      const { data, error } = await supabase
        .from("kelas")
        .update({
          kelas: form.kelas,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error("❌ Error updating kelas:", error);
        alert("Gagal mengupdate kelas: " + error.message);
        return;
      }

      console.log("✅ Kelas updated:", data);

      // Update local state
      setKelas((prev) => prev.map((k) => (k.id === editingId ? data : k)));
      setEditDialogOpen(false);
      setEditingId(null);
      setForm({ kelas: "" });
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Terjadi kesalahan yang tidak terduga");
    }
  };

  // 🔹 Hapus kelas
  const handleDelete = async (id: number) => {
    try {
      // Konfirmasi dulu
      if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

      console.log("🗑️ Deleting kelas:", id);

      const { error } = await supabase.from("kelas").delete().eq("id", id);

      if (error) {
        console.error("❌ Error deleting kelas:", error);

        // Cek jika error karena foreign key constraint
        if (error.code === "23503") {
          alert(
            "Tidak dapat menghapus kelas ini karena masih ada siswa yang terdaftar di kelas ini!"
          );
        } else {
          alert("Gagal menghapus kelas: " + error.message);
        }
        return;
      }

      console.log("✅ Kelas deleted");

      // Update local state
      setKelas((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Terjadi kesalahan yang tidak terduga");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Data Kelas</h1>
      <Card className="p-4 shadow text-center">
        <KelasTable
          data={kelas}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          addDialog={
            <AddKelasDialog
              open={addDialogOpen}
              setOpen={setAddDialogOpen}
              form={form}
              handleChange={handleChange}
              handleAdd={handleAdd}
            />
          }
        />
      </Card>
      <EditKelasDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        form={form}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
