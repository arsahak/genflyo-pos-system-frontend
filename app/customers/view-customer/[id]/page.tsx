import ViewCustomerPage from "@/component/customersManagement/ViewCustomerPage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ViewCustomerPage customerId={id} />;
};

export default page;
