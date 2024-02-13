import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const productid = parseInt(body.productid);

        await prisma.products.delete({
            where: {
                id: productid,
            }
        })
        return NextResponse.json({
            status: "success",
            message: "Product deleted successfully"
        })
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: "Something went wrong, Please try again..."
        })
    }
}