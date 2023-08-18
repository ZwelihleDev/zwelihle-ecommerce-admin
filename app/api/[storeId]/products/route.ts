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
    // add brand and description later
    const {
      name,

      brand,
      slug,


      // description,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;
    // if  user is unauthorized
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // conferming if prisma fields are provided
    if (!name) {
      return new NextResponse("Name field is Required", { status: 400 });
    }

        // testing phase
        if (!brand) {
          return new NextResponse("Brand field is Required", { status: 400 });
        }


        if (!slug) {
          return new NextResponse("Brand field is Required", { status: 400 });
        }




        // testing phase

    if (!images || !images.length) {
      return new NextResponse("Images field is Required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price field is Required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("categoryId field is Required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color field is Required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("SizeId field is Required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        brand,


         slug,


        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[products_Post]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Getting the store to be used in our frontend store
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
// try desciption/brand

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }


    // try description and brand
    const products = await prismadb.product.findMany({
        where: {
          storeId: params.storeId,
          categoryId,
          colorId,
          sizeId,
          isFeatured: isFeatured ? true : undefined,
          isArchived: false,
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[Products_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
