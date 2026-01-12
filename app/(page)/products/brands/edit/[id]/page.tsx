import UpdateBrand from "@/component/brandsManagement/UpdateBrand";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  
  return (
    <div>
      <UpdateBrand brandId={id} />
    </div>
  );
};

export default page;
