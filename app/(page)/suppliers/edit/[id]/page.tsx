"use client";

import EditSupplier from "@/component/suppliersManagement/EditSupplier";
import { useParams } from "next/navigation";

export default function EditSupplierPage() {
  const params = useParams();
  const supplierId = params.id as string;

  return <EditSupplier supplierId={supplierId} />;
}
