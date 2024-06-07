import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {

        // const file = await prisma.file.findUnique({
        //     where: { id: Number(id) }
        // });

        // if (!file) {
        //     return NextResponse.json({ error: 'File not found' }, { status: 404 });
        // }

        // const fileUrl = file?.url

        // console.log(fileUrl)

        // const res = await fetch(fileUrl, {
        //     method: 'DELETE',
        // });

        // const resJson = await res.json();

        // console.log(resJson)

        // if (!res.ok) {
        //     return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
        // }

        await prisma.file.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}