"use client";

import { type ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmDeleteDialog from "@/components/layout/DeleteDialog";
import { DataTable } from "@/components/layout/Table";
import { Kelas } from "@/types";

export default function KelasTable({
  data,
  handleEditClick,
  handleDelete,
  addDialog
}: {
  data: Kelas[];
  handleEditClick: (k: Kelas) => void;
  handleDelete: (id: number) => void;
  addDialog: React.ReactNode;
}) {
  const columns: ColumnDef<Kelas>[] = [
    { header: 'No', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'kelas', header: 'Nama' },
    {
      header: 'Aksi',
      cell: ({ row }) => {
        const k = row.original;
        return (
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              className="bg-yellow-300 text-white hover:bg-yellow-400"
              onClick={() => handleEditClick(k)}
            >
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Hapus
                </Button>
              </DialogTrigger>
              <ConfirmDeleteDialog onConfirm={() => handleDelete(k.id)} />
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={addDialog}
    />
  );
}
