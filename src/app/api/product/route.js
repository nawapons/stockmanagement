import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req, res) {
    const body = await req.json();
    const { sortColumn, sortDirection, search } = body;
    const page = parseInt(body.page);
    const per_page = parseInt(body.per_page);
    const startIdx = (page - 1) * per_page;

    try {
        const products = await prisma.products.findMany({
            skip: startIdx,
            take: per_page,
            where: {
                
                OR: [
                    { productname: { contains: search } },
                    { Types: { name: { contains: search } } } // Assuming a relationship
                ],
            },
            include: {
                lots: true,
                Types: true,
            },
            orderBy: sortColumn || sortDirection,
        });
        const productsWithSum = products.map((product) => {
            const initialQuantitySum = product.lots.reduce(
                (sum, lot) => sum + (lot.initial_quantity || 0),
                0
            );

            const currentQuantitySum = product.lots.reduce(
                (sum, lot) => sum + (lot.current_quantity || 0),
                0
            );

            return {
                ...product,
                initial_quantity_sum: initialQuantitySum,
                current_quantity_sum: currentQuantitySum,
            };
        });
        const total = await prisma.products.count();
        const totalPages = Math.ceil(total / per_page);
        const types = await prisma.types.findMany();
        return NextResponse.json({
            page,
            per_page,
            total,
            totalPages,
            data: productsWithSum,
            type: types
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: "error", message: err.message });
    }
}