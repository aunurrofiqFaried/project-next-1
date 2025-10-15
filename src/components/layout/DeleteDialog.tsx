import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

  interface ConfirmDeleteDialogProps {
    onConfirm: () => void;
  }

  export default function ConfirmDeleteDialog({ onConfirm }: ConfirmDeleteDialogProps) {
    return (
      <DialogContent className="w-full max-w-[min(90vw,300px)]">
        <DialogHeader>
          <DialogTitle>Yakin Hapus Data?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Ya, Hapus
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }
