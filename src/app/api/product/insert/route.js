import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { type, productname } = body;
        let typeid;

        if (!type || !productname) {
            return NextResponse.json({
                status: "error",
                message: "Please enter required data"
            });
        }

        // Check if type exists
        const checktype = await prisma.types.findUnique({
            where: {
                name: type,
            }
        });

        if (checktype) {
            typeid = checktype.id;
        } else {
            const createtype = await prisma.types.create({
                data: {
                    name: type
                }
            });
            typeid = createtype.id;
        }

        // Check if product exists
        const checkproduct = await prisma.products.findUnique({
            where: {
                productname: productname,
            }
        });

        if (checkproduct) {
            return NextResponse.json({
                status: "error",
                message: "Product already exists",
            });
        }

        await prisma.products.create({
            data: {
                productname: productname,
                typesId: typeid
            }
        });

        return NextResponse.json({
            status: "success",
            message: "Product created successfully"
        });
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: err.message
        });
    }
}
