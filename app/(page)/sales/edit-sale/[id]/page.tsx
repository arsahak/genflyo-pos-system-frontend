import EditSale from "@/component/SalesManagement/EditSale";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EditSale saleId={id} />;
};

export default page;

