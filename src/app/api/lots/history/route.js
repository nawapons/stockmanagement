import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const lotid = parseInt(body.lotid)
        const loadHistory = await prisma.history.findMany({
            where: {
                AND: {
                    lotId: lotid,
                    action: "นำออก"
                }
            },
            include: {
                lot: true,
            }
        })
        const productincludesum = loadHistory.map((history) => {
            const pricesum = history.quantity * history.lot.price
            return {
                ...loadHistory,
                sumall: pricesum
            }
        })
        return NextResponse.json({
            data: productincludesum
        })
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: "Something went wrong, Please try again..."
        })
    }
}