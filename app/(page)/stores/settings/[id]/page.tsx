import StoreSettings from "@/component/storesManagement/StoreSettings";

const StoreSettingsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <StoreSettings storeId={id} />;
};

export default StoreSettingsPage;

