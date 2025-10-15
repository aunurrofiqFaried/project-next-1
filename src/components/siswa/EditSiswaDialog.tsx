"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/layout/FormFields";

export default function EditSiswaDialog({ open, setOpen, data, handleChange, handleUpdate, dataKelas }: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Siswa</DialogTitle></DialogHeader>
        <FormFields data={data} onChange={handleChange} kelas={dataKelas} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button className="bg-yellow-400 text-white" onClick={handleUpdate}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
