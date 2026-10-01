import { NextResponse } from "next/server";
import { User } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required",
        },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}