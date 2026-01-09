import { getAllBarcodes } from "@/app/actions/barcode";
import { getAllProducts } from "@/app/actions/product";
import BarcodeGenerator from "@/component/brcodeManagement/BarcodeGenerator";
import BarcodeList from "@/component/brcodeManagement/BarcodeList";
import { MdQrCode2 } from "react-icons/md";

interface PageProps {
  searchParams: { page?: string };
}

export default async function BarcodePage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;

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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MdQrCode2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Barcode Management</h1>
            <p className="text-sm text-gray-500">
              Generate and manage product barcodes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator - Left side */}
        <div className="lg:col-span-1">
          <BarcodeGenerator
            products={products.map((p: any) => ({
              _id: p._id,
              name: p.name,
              sku: p.sku,
            }))}
          />
        </div>

        {/* List - Right side */}
        <div className="lg:col-span-2">
          <BarcodeList
            initialBarcodes={barcodes}
            totalPages={totalPages}
            currentPage={page}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
