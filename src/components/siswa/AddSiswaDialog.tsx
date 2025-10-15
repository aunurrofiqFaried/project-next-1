"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/layout/FormFields";
import { Kelas } from "@/types";

export default function AddSiswaDialog({
  open,
  setOpen,
  data,
  handleChange,
  handleAdd,
  dataKelas
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: any;
  handleChange: (key: string, value: string | number) => void;
  handleAdd: () => void;
  dataKelas: Kelas[];
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">Tambah Siswa</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Siswa</DialogTitle>
          <DialogDescription>Isi form untuk menambahkan siswa.</DialogDescription>
        </DialogHeader>
        <FormFields data={data} onChange={handleChange} kelas={dataKelas} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleAdd}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
