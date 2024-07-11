import { React, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

const Modal = ({ show, setShow, handleModal }) => {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            <ShieldAlert color="#ef4444" size={100} />
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-2">
            <span className="text-xl font-semibold">Warning Too Hot!!</span>
            <Button variant="destructive" onClick={handleModal}>
              Tutup
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
