import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'

export async function GET() {
    try {
        const files = await prisma.file.findMany();
        return NextResponse.json({ files }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }
}