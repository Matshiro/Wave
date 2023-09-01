import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, gender } = body;

    if (!email || !name || !password || !gender) {
      return new NextResponse("Brakujące dane", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        gender,
      },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
