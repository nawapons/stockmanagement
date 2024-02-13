import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();
export async function POST(req, res) {
    try {
        const body = await req.json();
        const { sortColumn, sortDirection, search } = body;
        const page = parseInt(body.page);
        const per_page = parseInt(body.per_page);
        const startIdx = (page - 1) * per_page;

        const logs = await prisma.history.findMany({
            skip: startIdx,
            take: per_page,
            where: {
                OR: [
                    { action: { contains: search } },
                    { quantity: { contains: search } },
                    { lot: { lotname: { contains: search } } },
                    { lot: { product: { productname: { contains: search } } } }// Assuming a relationship
                ],
            },
            orderBy: {
                [sortColumn || 'created_at']: sortDirection || 'desc',
            },
            include: {
                lot: {
                    include: {
                        product: {
                            include: {
                                Types: true,
                            }
                        }
                    }
                },
            },
        });

        console.log(logs);
        const total = await prisma.history.count();
        const totalPages = Math.ceil(total / per_page);
        return NextResponse.json({
            page,
            per_page,
            total,
            totalPages,
            data: logs,
        });
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: err.message
        })
    }
}