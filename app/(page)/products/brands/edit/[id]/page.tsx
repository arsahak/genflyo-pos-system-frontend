import UpdateBrand from "@/component/brandsManagement/UpdateBrand";

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  return (
    <div>
      <UpdateBrand brandId={params.id} />
    </div>
  );
};

export default page;
