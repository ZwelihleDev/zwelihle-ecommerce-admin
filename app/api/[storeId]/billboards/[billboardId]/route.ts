// patch route updates the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("BillboardId is required Please try again.", {
        status: 400,
      });
    }

    // finding unique the store
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[Billboard_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    //   preventing user from bypassing the name fied
    if (!label) {
      return new NextResponse("Label is required Please try again.", {
        status: 400,
      });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required Please try again.", {
        status: 400,
      });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required Please try again.", {
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
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[Billboard_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// delete the billboard

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    if (!params.billboardId) {
      return new NextResponse("BillboardId is required Please try again.", {
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
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[Billboard_Delete]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
