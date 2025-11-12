"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {  CheckCircle2Icon } from "lucide-react";

function Saludar({titulo, descripcion} : {titulo: string, descripcion: string}) {
  return (
    <Alert>
      <CheckCircle2Icon />
      <AlertTitle>{titulo}</AlertTitle>
      <AlertDescription>
        {descripcion}
      </AlertDescription>
    </Alert>
  )
}


export default Saludar;
