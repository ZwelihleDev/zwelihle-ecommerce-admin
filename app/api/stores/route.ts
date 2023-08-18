import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // create a new store
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;
    // if  user is unauthorized
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // conferming if prisma fields are provided
    if (!name) {
      return new NextResponse("Store Name is Required", { status: 400 });
    }

    // create a new store here after required fields are completed

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[Stores_Post]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
