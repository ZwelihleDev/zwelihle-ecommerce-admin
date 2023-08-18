import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // create a new store
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    // if  user is unauthorized
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // conferming if prisma fields are provided
    if (!label) {
      return new NextResponse("Label field is Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL field is Required", { status: 400 });
    }

    //   checking if theres no storeId and the storeid exists for a certain user

    if (!params.storeId) {
      return new NextResponse("Store Id field is Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // create a new billboard here after required fields are provided

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[Billboards_Post]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Getting the store to be used in our frontend store
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[Billboards_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
