import LoginPage from "@/component/auth/UserAuth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  // Check if user is already logged in
  const session = await auth();

  // If already logged in, redirect to dashboard (root page)
  if (session && session.user) {
    redirect("/");
  }

  // If not logged in, show login page
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
