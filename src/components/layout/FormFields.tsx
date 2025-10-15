"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Kelas } from "@/types";

interface FormFieldsProps {
  data: any;
  onChange: (key: string, value: string | number) => void;
  kelas: Kelas[];
}

export default function FormFields({
  data,
  onChange,
  kelas,
}: FormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama</Label>
        <Input
          value={data.nama}
          onChange={(e) => onChange("nama", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nis">NIS</Label>
        <Input
          value={data.nis}
          onChange={(e) => onChange("nis", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Kelas</Label>
        <Select onValueChange={(val) => onChange("kelas_id", Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {kelas.map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>
                {k.kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Jenis Kelamin</Label>
        <Select onValueChange={(val) => onChange("jenis_kelamin", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Jenis Kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
            <SelectItem value="Perempuan">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Tanggal Lahir</Label>
        <Input
          type="date"
          value={data.tanggal_lahir}
          onChange={(e) => onChange("tanggal_lahir", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Alamat</Label>
        <Input
          value={data.alamat}
          onChange={(e) => onChange("alamat", e.target.value)}
        />
      </div>
    </div>
  );
}
