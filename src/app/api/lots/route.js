import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    const body = await req.json();
    const { sortColumn, sortDirection, search } = body;
    const productid = parseInt(body.productid)
    const page = parseInt(body.page);
    const per_page = parseInt(body.per_page);
    const startIdx = (page - 1) * per_page;

    try {
        const lots = await prisma.lots.findMany({
            skip: startIdx,
            take: per_page,
            where: {
                productId: productid,
                OR: [
                    { lotname: { contains: search } },
                    { product: { productname: { contains: search } } },
                    {
                        product: {
                            Types: { name: { contains: search } }
                        }
                    } // Assuming a relationship
                ],
            },
            include: {
                product: {
                    include: {
                        Types: true
                    }
                },
            },
            orderBy: sortColumn || sortDirection,
        });

        const total = await prisma.lots.count();
        const totalPages = Math.ceil(total / per_page);
        return NextResponse.json({
            page,
            per_page,
            total,
            totalPages,
            data: lots,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: "error", message: err.message });
    }
}