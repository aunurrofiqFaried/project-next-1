"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddKelasDialog({
  open,
  setOpen,
  form,
  handleChange,
  handleAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: { kelas: string };
  handleChange: (key: string, value: string) => void;
  handleAdd: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">Tambah Kelas</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[min(90vw,300px)]">
        <DialogHeader>
          <DialogTitle>Tambah Kelas</DialogTitle>
          <DialogDescription>Masukkan nama kelas baru</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="nama">Nama</Label>
          <Input
            id="nama"
            value={form.kelas}
            onChange={(e) => handleChange('kelas', e.target.value)}
            placeholder="Contoh: XII RPL 2"
          />
        </div>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleAdd}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}