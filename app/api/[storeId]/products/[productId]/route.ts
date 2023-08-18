// patch route updates the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId is required Please try again.", {
        status: 400,
      });
    }

    // finding unique the store/try description
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[Product_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    // checking if we're authenticated add description later
    const { userId } = auth();
    const body = await req.json();
    const { name,brand,slug, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    //   preventing user from bypassing the name fied
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }

      if (!brand) {
        return new NextResponse("Brand is required", { status: 400 });
      }

      if (!slug) {
        return new NextResponse("Brand is required", { status: 400 });
      }

      // test
  
      if (!images || !images.length) {
        return new NextResponse("Images are required", { status: 400 });
      }
  
      if (!price) {
        return new NextResponse("Price is required", { status: 400 });
      }
  
      if (!categoryId) {
        return new NextResponse("Category id is required", { status: 400 });
      }
  
      if (!colorId) {
        return new NextResponse("Color id is required", { status: 400 });
      }
  
      if (!sizeId) {
        return new NextResponse("Size id is required", { status: 400 });
      }

    if (!params.productId) {
      return new NextResponse("productId is required Please try again.", {
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

    // updating the store test
     await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,

        brand,

         slug,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
        where: {
          id: params.productId
        },
        data: {
          images: {
            createMany: {
              data: [
                ...images.map((image: { url: string }) => image),
              ],
            },
          },
        },
      })

    return NextResponse.json(product);
  } catch (error) {
    console.log("[Product_Patch]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// delete the billboard

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    // checking if we're authenticated
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.Please try again.", {
        status: 401,
      });
    }

    if (!params.productId) {
      return new NextResponse("productId is required Please try again.", {
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[Product_Delete]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
