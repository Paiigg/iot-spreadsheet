"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWarningContext } from "@/components/context/warning-context";
import { Button } from "@/components/ui/button";

const WarningPage = () => {
  const { warningMessage, setWarningMessage } = useWarningContext();
  const handleResetWarnings = () => {
    setWarningMessage([]);
  };
  console.log({ warningMessage });
  return (
    <div className="w-full p-10 ">
      <div>
        <h1 className="text-4xl font-bold text-primary">Warning Log</h1>
        <p className="text-sm">PT Indospring Tbk Plant 5</p>
      </div>
      <Table className="lg:min-w-[970px] min-w-[300px] p-4">
        <TableCaption>A list of your warning logs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Pesan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warningMessage.toReversed().map((warning) => (
            <TableRow key={warning.id}>
              <TableCell>{warning.timestamp}</TableCell>
              <TableCell>{warning.pesan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleResetWarnings} className="mt-4">
        Reset Pesan
      </Button>
    </div>
  );
};

export default WarningPage;
