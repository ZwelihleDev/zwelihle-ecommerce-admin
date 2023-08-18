import Navigationbar from "@/components/navigationbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // first checking if a user is logged in
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // fecthing the created store
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // store doesnt exist
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <div>
        <Navigationbar />
        {children}
      </div>
    </>
  );
}
