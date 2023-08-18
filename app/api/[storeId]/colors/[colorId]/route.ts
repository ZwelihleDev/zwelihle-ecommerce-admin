// patch route updates the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("colorId is required Please try again.", {
        status: 400,
      });
    }

    // finding unique the store
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return new NextResponse("colorId is required Please try again.", {
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
    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// delete the billboard

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    if (!params.colorId) {
      return new NextResponse("colorId is required Please try again.", {
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
    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_Delete]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
