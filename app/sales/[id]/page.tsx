import ViewSaleDetails from "@/component/SalesManagement/ViewSaleDetails";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ViewSaleDetails saleId={id} />;
};

export default page;

