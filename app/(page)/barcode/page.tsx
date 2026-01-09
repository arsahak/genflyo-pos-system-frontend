import { getAllBarcodes } from "@/app/actions/barcode";
import { getAllProducts } from "@/app/actions/product";
import BarcodePageContent from "@/component/brcodeManagement/BarcodePageContent";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BarcodePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  // Fetch barcodes and products in parallel
  const [barcodesResult, productsResult] = await Promise.all([
    getAllBarcodes({ page, limit: 20 }),
    getAllProducts({ limit: 1000 }),
  ]);

  const barcodes = barcodesResult.success ? barcodesResult.data?.barcodes || [] : [];
  const totalPages = barcodesResult.success ? barcodesResult.data?.totalPages || 1 : 1;
  const total = barcodesResult.success ? barcodesResult.data?.total || 0 : 0;
  const products = productsResult.success ? productsResult.data?.products || [] : [];

  return (
    <BarcodePageContent
      barcodes={barcodes}
      totalPages={totalPages}
      currentPage={page}
      total={total}
      products={products}
    />
  );
}
