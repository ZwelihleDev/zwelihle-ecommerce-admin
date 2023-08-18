// patch route updates the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("sizeId is required Please try again.", {
        status: 400,
      });
    }

    // finding unique the store
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[Size_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

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

    if (!value) {
      return new NextResponse("Value is required Please try again.", {
        status: 400,
      });
    }

    if (!params.sizeId) {
      return new NextResponse("size Id is required Please try again.", {
        status: 400,
      });
    }

    // fetching the current store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // updating the store
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[Size_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// delete the billboard

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    if (!params.sizeId) {
      return new NextResponse("sizeId is required Please try again.", {
        status: 400,
      });
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

    // updating the store
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[Size_Delete]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
