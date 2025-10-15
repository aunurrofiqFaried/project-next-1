"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import InfoSiswa from "@/components/pelanggaran/detail/InfoSiswa";
import BuktiPelanggaran from "@/components/pelanggaran/detail/BuktiPelanggaran";
import TindakanDiambil from "@/components/pelanggaran/detail/TindakanDiambil";
import { Button } from "@/components/ui/button";
import { Check, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Pelanggaran, EvidenceItem } from "@/types";
import { supabase } from "@/lib/supabase";

export default function DetailPelanggaranPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [violation, setViolation] = useState<Pelanggaran | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data pelanggaran dari Supabase
  useEffect(() => {
    const fetchViolation = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("pelanggarans")
          .select("*, siswa:siswas(*, kelas(*))")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("Data pelanggaran tidak ditemukan");
          return;
        }

        setViolation(data);
      } catch (err: any) {
        console.error("Error fetching violation:", err);
        setError(err.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchViolation();
    }
  }, [id]);

  // Generate evidence dari URL foto jika ada
  const evidence: EvidenceItem[] = violation?.url ? [{
    id: 1,
    pelanggaran_id: violation.id,
    tipe: "image",
    url: violation.url,
    deskripsi: "Foto Bukti Pelanggaran",
    nama: "",
    diunggah_oleh: "System",
    waktu_unggah: violation.created_at,
    pelanggaran: violation
  }] : [];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ action: "", note: "", followUp: "" });
  const [selectedImage, setSelectedImage] = useState<null | string>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "ringan": return "bg-green-100 text-green-800";
      case "sedang": return "bg-yellow-100 text-yellow-800";
      case "berat": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif": return "bg-orange-100 text-orange-800";
      case "Selesai": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleActionSubmit = async () => {
    if (!violation) return;

    try {
      const { error } = await supabase
        .from("pelanggarans")
        .update({
          tindakan: formData.action || null,
          tanggal_tindak_lanjut: formData.followUp || null,
          catatan: formData.note || null,
        })
        .eq("id", violation.id);

      if (error) throw error;

      // Update local state
      setViolation({
        ...violation,
        tindakan: formData.action || null,
        tanggal_tindak_lanjut: formData.followUp || null,
        catatan: formData.note || null,
      });

      setIsEditModalOpen(false);
      setFormData({ action: "", note: "", followUp: "" });
      alert("Tindakan berhasil disimpan");
    } catch (error) {
      console.error("Error updating tindakan:", error);
      alert("Gagal menyimpan tindakan");
    }
  };

  const handleMarkAsComplete = async () => {
    if (!violation) return;

    if (!confirm("Tandai pelanggaran ini sebagai selesai?")) return;

    try {
      const { error } = await supabase
        .from("pelanggarans")
        .update({ status: "Selesai" })
        .eq("id", violation.id);

      if (error) throw error;

      // Update local state
      setViolation({ ...violation, status: "Selesai" });
      alert("Pelanggaran berhasil ditandai sebagai selesai");
    } catch (error) {
      console.error("Error marking as complete:", error);
      alert("Gagal mengubah status");
    }
  };

  const handleDownloadReport = () => {
    if (!violation) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Pelanggaran Siswa", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Kolom", "Detail"]],
      body: [
        ["Nama Siswa", violation.siswa?.nama ?? 'N/A'],
        ["NIS", violation.siswa?.nis ?? 'N/A'],
        ["Kelas", violation.siswa?.kelas?.kelas ?? 'N/A'],
        ["Jenis Pelanggaran", violation.jenis_pelanggaran],
        ["Tingkat", violation.tingkat],
        ["Poin", violation.poin.toString()],
        ["Tanggal & Waktu", `${violation.tanggal} | ${violation.waktu}`],
        ["Lokasi", violation.lokasi],
        ["Status", violation.status],
        ["Dilaporkan oleh", violation.dilaporkan_oleh_user?.name ?? 'N/A'],
        ["Deskripsi Kejadian", violation.deskripsi]
      ],
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold" } }
    });

    let nextY = (doc as any).lastAutoTable?.finalY + 10 || 100;
    doc.setFontSize(12);
    doc.text("Bukti Pelanggaran:", 14, nextY);
    nextY += 6;

    evidence.forEach(b => {
      doc.setFontSize(10);
      doc.text(
        `• [${b.tipe}] ${b.deskripsi || b.nama || "-"} | Oleh: ${b.diunggah_oleh} | ${b.waktu_unggah}`,
        14,
        nextY,
        { maxWidth: 180 }
      );
      nextY += 6;
    });

    nextY += 4;
    doc.setFontSize(12);
    doc.text("Tindakan yang Diambil:", 14, nextY);
    nextY += 6;

    doc.setFontSize(10);
    doc.text(`Sanksi / Tindakan: ${violation.tindakan}`, 14, nextY);
    nextY += 6;
    doc.text(`Tanggal Tindak Lanjut: ${violation.tanggal_tindak_lanjut}`, 14, nextY);
    nextY += 6;
    doc.text(`Catatan: ${violation.catatan}`, 14, nextY, { maxWidth: 180 });

    doc.save(`laporan_pelanggaran_${violation.siswa?.nis ?? 'unknown'}.pdf`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !violation) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Data tidak ditemukan"}</p>
          <Button onClick={() => router.back()} variant="outline">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <InfoSiswa data={violation} getSeverityColor={getSeverityColor} getStatusColor={getStatusColor} />
        <BuktiPelanggaran bukti={evidence} onLihat={setSelectedImage} />
        <TindakanDiambil
          actionTaken={violation.tindakan}
          followUpDate={violation.tanggal_tindak_lanjut}
          notes={violation.catatan}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleActionSubmit={handleActionSubmit}
        />
        <Button onClick={handleDownloadReport} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-full">
          <Download className="w-4 mr-2" /> Download Laporan (PDF)
        </Button>
        {violation.status !== "Selesai" && (
          <Button onClick={handleMarkAsComplete} className="bg-green-600 hover:bg-green-700 text-white min-w-full">
            <Check className="w-4 mr-2" /> Tandai Pelanggaran Selesai
          </Button>
        )}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}