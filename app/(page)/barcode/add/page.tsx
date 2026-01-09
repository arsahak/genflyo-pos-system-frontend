import { redirect } from "next/navigation";

export default function AddBarcodePage() {
  // Redirect to main barcode page since we're using inline generator
  redirect("/barcode");
}