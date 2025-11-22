import EditCustomerPage from "@/component/customersManagement/EditCustomerPage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EditCustomerPage customerId={id} />;
};

export default page;

