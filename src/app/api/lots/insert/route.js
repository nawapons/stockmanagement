import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const lotname = body.lotname
        const productid = parseInt(body.productid)
        const quantity = parseInt(body.quantity)
        const price = parseInt(body.price)

        if (!productid || !lotname || !quantity || !price) {
            return NextResponse.json({
                status: "error",
                message: "Please enter all data"
            })
        }
        //check lot exists
        const checkLot = await prisma.lots.findUnique({
            where: {
                lotname: lotname,
            }
        })
        if (checkLot) {
            return NextResponse.json({
                status: "error",
                message: "Lot is already exists"
            })
        }
        const createlot = await prisma.lots.create({
            data: {
                productId: productid,
                lotname: lotname,
                price: price,
                initial_quantity: quantity,
                current_quantity: quantity,
                updated_at: new Date()
            }
        })
        await prisma.history.create({
            data: {
                lotId: createlot.id,
                action: "เพิ่ม Lot",
                quantity: quantity
            }
        })
        return NextResponse.json({
            status: "success",
            message: "add Lot successfully"
        })
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: "Something went wrong, Please try again..."
        })
    }
}