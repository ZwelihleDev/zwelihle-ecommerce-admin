import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPagePage {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPagePage> = async ({ params }) => {
  // validating the user

  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // finding the first/selected store available
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store}/>
      </div>
    </div>
  );
};

export default SettingsPage;
