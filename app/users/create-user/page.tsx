import NewUserCreate from "@/component/userManagement/NewUserCreate";

// Force dynamic rendering to prevent SSR issues with browser APIs
export const dynamic = 'force-dynamic';

const page = () => {
  return (
    <div>
      <NewUserCreate />
    </div>
  );
};

export default page;
