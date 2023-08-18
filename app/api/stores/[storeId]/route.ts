// patch route updates the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    //   preventing user from bypassing the name fied
    if (!name) {
      return new NextResponse("Name is required Please try again.", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required Please try again.", {
        status: 400,
      });
    }

    // updating the store
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[Store_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// delete the store

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required Please try again.", {
        status: 400,
      });
    }

    // updating the store
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[Delete_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
