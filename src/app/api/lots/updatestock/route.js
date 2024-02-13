import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const productid = parseInt(body.productId);
        const lotid = parseInt(body.lotid)
        const value = parseInt(body.value);
        const action = body.action

        let actionString;
        if (action === "import") {
            actionString = "นำเข้า"
        } else {
            actionString = "นำออก"
        }
        if (!productid || !lotid || !value || !action) {
            return NextResponse.json({
                status: "error",
                message: "Please enter all data"
            })
        }
        const lot = await prisma.lots.findMany({
            where: {
                AND: {
                    id: lotid,
                    productId: productid
                }
            },
        })
        const current_quantity = lot[0].current_quantity;
        const initial_quantity = lot[0].initial_quantity

        if (action === "export" && current_quantity - value < 0) {
            return NextResponse.json({
                status: "error",
                message: "ไม่สามารถนำสินค้าออกได้ เนื่องจาก มีจำนวนสินค้าไม่เพียงพอ",
            });
        }
        const updateLot = await prisma.lots.update({
            where: {
                id: lotid
            },
            data: {
                updated_at: new Date(),
                initial_quantity: action === "import" || action === "Import" ? initial_quantity + value : initial_quantity,
                current_quantity: action === "import" || action === "Import" ? current_quantity + value : current_quantity - value,
            },
        });
        await prisma.history.create({
            data: {
                lotId: updateLot.id,
                action: actionString,
                quantity: value
            }
        });
        return NextResponse.json({
            status: "success",
            message: "Save changes"
        })
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: err.message
        })
    }
}