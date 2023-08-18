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
    const { name, value} = body;
    // if  user is unauthorized
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // conferming if prisma fields are provided
    if (!name) {
      return new NextResponse("Name field is Required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value field is Required", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[Colors_Post]", error);
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

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[Colors_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
