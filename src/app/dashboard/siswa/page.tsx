"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SiswaTable from "@/components/siswa/Siswatable";
import EditSiswaDialog from "@/components/siswa/EditSiswaDialog";
import type { Siswa, Kelas } from "@/types"; // pakai tipe buatanmu
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function SiswaPage() {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [dataKelas, setDataKelas] = useState<Kelas[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);
  const [data, setData] = useState<Omit<Siswa, 'id' | 'created_at' | 'updated_at' | 'kelas'>>({
    nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    // ambil semua kelas
    const { data: kelasData, error: kelasError } = await supabase
      .from("kelas")
      .select("*");
    if (kelasError) console.error(kelasError);
    else setDataKelas(kelasData || []);

    // ambil semua siswa + relasi kelas
    const { data: siswaData, error: siswaError } = await supabase
      .from("siswas")
      .select("*, kelas:kelas_id(id, kelas)");
    if (siswaError) console.error(siswaError);
    else setDataSiswa(siswaData || []);
  };

  fetchData();
}, []);

  const handleChange = (key: string, value: string | number) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const resetForm = () =>
    setData({ nama: "", nis: "", kelas_id: 0, jenis_kelamin: "", tanggal_lahir: "", alamat: "" });

const handleAdd = async () => {
  const { error } = await supabase.from("siswas").insert([
    {
      nis: data.nis,
      nama: data.nama,
      kelas_id: data.kelas_id,
      jenis_kelamin: data.jenis_kelamin,
      tanggal_lahir: data.tanggal_lahir,
      alamat: data.alamat,
    },
  ]);

  if (error) {
    console.error(error);
    toast.error("Gagal menambah siswa");
  } else {
    toast.success("Siswa berhasil ditambahkan");
    setAddDialogOpen(false);
    resetForm();

    // refresh data
    const { data: siswaData } = await supabase
      .from("siswas")
      .select("*, kelas:kelas_id(id, kelas)");
    setDataSiswa(siswaData || []);
  }
};

  const handleEdit = (siswa: Siswa) => {
    setData({
      nama: siswa.nama,
      nis: siswa.nis,
      kelas_id: siswa.kelas_id,
      jenis_kelamin: siswa.jenis_kelamin,
      tanggal_lahir: siswa.tanggal_lahir,
      alamat: siswa.alamat
    });
    setEditingId(siswa.id);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
  if (editingId) {
    const { error } = await supabase
      .from("siswas")
      .update({
        nama: data.nama,
        nis: data.nis,
        kelas_id: data.kelas_id,
        jenis_kelamin: data.jenis_kelamin,
        tanggal_lahir: data.tanggal_lahir,
        alamat: data.alamat,
      })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      toast.error("Gagal mengupdate siswa");
    } else {
      toast.success("Siswa berhasil diupdate");
      setEditDialogOpen(false);
      setEditingId(null);
      resetForm();

      // refresh data
      const { data: siswaData } = await supabase
        .from("siswas")
        .select("*, kelas:kelas_id(id, kelas)");
      setDataSiswa(siswaData || []);
    }
  }
};

const handleDelete = async (id: number) => {
    const { error } = await supabase.from("siswas").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      toast.success("Siswa berhasil dihapus");
      
      setDataSiswa(prev => prev.filter(s => s.id !== id));
    }
};
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Siswa</h1>
      <Card className="p-4">
        <SiswaTable
          dataSiswa={dataSiswa}
          dataKelas={dataKelas}
          selectedKelasId={selectedKelasId}
          setSelectedKelasId={setSelectedKelasId}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          data={data}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
      </Card>
      <EditSiswaDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        data={data}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        dataKelas={dataKelas}
      />
    </div>
  );
}
