'use client';

import { useState } from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import type { Pelanggaran, Siswa } from '@/types';
import Image from 'next/image';

interface AddPelanggaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (violation: Omit<Pelanggaran, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'dilaporkan_oleh_user'>) => Promise<void>;
  dataSiswa: Siswa[];
}

// 🔹 Data pelanggaran dan poin otomatis
const pelanggaranOptions = [
  { jenis: 'Terlambat', tingkat: 'Ringan', poin: 5 },
  { jenis: 'Merokok', tingkat: 'Berat', poin: 50 },
  { jenis: 'Seragam tidak Lengkap', tingkat: 'Ringan', poin: 10 },
  { jenis: 'Keluar Jam Kelas', tingkat: 'Sedang', poin: 20 },
  { jenis: 'Kerapian Rambut', tingkat: 'Ringan', poin: 5 },
  { jenis: 'Hamil', tingkat: 'Berat', poin: 100 },
  { jenis: 'Narkotika', tingkat: 'Berat', poin: 200 },
  { jenis: 'Membunuh', tingkat: 'Sangat Berat', poin: 500 },
];

export default function AddPelanggaranDialog({
  open, onOpenChange, onAdd, dataSiswa
}: AddPelanggaranDialogProps) {

  const getInitialForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].slice(0, 5);
    return {
      siswa_id: 0,
      dilaporkan_oleh: 1,
      jenis_pelanggaran: '',
      tingkat: '',
      poin: 0,
      tanggal: today,
      waktu: now,
      lokasi: '',
      deskripsi: '',
      status: 'Aktif',
      tindakan: null,
      tanggal_tindak_lanjut: null,
      catatan: null,
      url: null,
    };
  };

  const [form, setForm] = useState<Omit<Pelanggaran, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'dilaporkan_oleh_user'>>(getInitialForm());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleJenisChange = (jenis: string) => {
    const selected = pelanggaranOptions.find(p => p.jenis === jenis);
    if (selected) {
      setForm(prev => ({
        ...prev,
        jenis_pelanggaran: selected.jenis,
        tingkat: selected.tingkat,
        poin: selected.poin,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        jenis_pelanggaran: jenis,
        tingkat: '',
        poin: 0,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setForm(prev => ({ ...prev, url: null }));
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let uploadedUrl = form.url;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const result = await response.json();
        if (result.success) uploadedUrl = result.url;
      }

      const cleanedData = {
        ...form,
        url: uploadedUrl || null,
        tindakan: form.tindakan?.trim() || null,
        tanggal_tindak_lanjut: form.tanggal_tindak_lanjut?.trim() || null,
        catatan: form.catatan?.trim() || null,
      };

      await onAdd(cleanedData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">+ Tambah Pelanggaran</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggaran</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          {/* Siswa */}
          <div className="space-y-2">
            <Label>Siswa</Label>
            <Select value={form.siswa_id.toString()} onValueChange={v => handleChange('siswa_id', parseInt(v))}>
              <SelectTrigger className="w-full min-w-[300px]"> {/* 🔹 Lebar diperlebar */}
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {dataSiswa.map((siswa) => (
                  <SelectItem key={siswa.id} value={siswa.id.toString()}>
                    {siswa.nama} - {siswa.nis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jenis Pelanggaran */}
          <div className="space-y-2">
            <Label>Jenis Pelanggaran</Label>
            <Select value={form.jenis_pelanggaran} onValueChange={handleJenisChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jenis pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                {pelanggaranOptions.map((p) => (
                  <SelectItem key={p.jenis} value={p.jenis}>
                    {p.jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tingkat */}
          <div className="space-y-2">
            <Label>Tingkat</Label>
            <Input value={form.tingkat} disabled className="bg-gray-100" />
          </div>

          {/* Poin */}
          <div className="space-y-2">
            <Label>Poin</Label>
            <Input type="number" value={form.poin} readOnly className="bg-gray-100" />
          </div>

          {/* Tanggal, waktu, lokasi, deskripsi */}
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" value={form.tanggal} onChange={e => handleChange('tanggal', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Waktu</Label>
            <Input type="time" value={form.waktu} onChange={e => handleChange('waktu', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input value={form.lokasi} onChange={e => handleChange('lokasi', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input value={form.deskripsi} onChange={e => handleChange('deskripsi', e.target.value)} />
          </div>

          {/* Upload Foto */}
          <div className="space-y-2">
            <Label>Upload Foto Bukti (Opsional)</Label>
            <div className="space-y-2">
              {previewUrl ? (
                <div className="relative w-full h-48 border rounded-md overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP (max 5MB)</p>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={resetForm} disabled={uploading}>Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
