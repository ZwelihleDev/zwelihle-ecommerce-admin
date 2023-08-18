import ZwelihleLogo from "@/public/logo/Zwelihle-Logo.png";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { MainNavigationbar } from "@/components/main-navigationbar";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Navigationbar = async () => {
  // fetching all stores
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border-b border-primaryBrown">
      <div className="flex h-20 items-center px-4">
        <div>
          <Image
            src={ZwelihleLogo}
            alt="zwelihle ecommerce logo"
            width={80}
            height={28}
            quality={100}
            className="px-4"
          />
        </div>

        {/* Store switcher */}
        <div>
          <StoreSwitcher items={stores} />
        </div>

        {/* main navigationbar */}
        <div>
          <MainNavigationbar className="mx-6" />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navigationbar;
