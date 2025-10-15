"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditKelasDialog({
  open,
  setOpen,
  form,
  handleChange,
  handleUpdate,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: { kelas: string };
  handleChange: (key: string, value: string) => void;
  handleUpdate: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-full max-w-[min(90vw,300px)] max-h-[calc(100vh-10rem)] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Kelas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="edit-nama">Nama</Label>
          <Input
            id="edit-nama"
            value={form.kelas}
            onChange={e => handleChange('kelas', e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleUpdate}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}