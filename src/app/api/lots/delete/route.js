import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const lotid = parseInt(body.lotid)
        console.log(lotid)
        await prisma.lots.delete({
            where: {
                id: lotid
            }
        })
        return NextResponse.json({
            status: "success",
            message: "Deleted lot successfully"
        })
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: err.message
        })
    }
}