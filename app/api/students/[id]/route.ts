import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await prisma.student.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
    }
  }

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const student = await prisma.student.findUnique({
          where: { id: Number(id) }
        });
        if (!student) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ student }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name, email } = await req.json();
  
    try {
      const updatedStudent = await prisma.student.update({
        where: { id: Number(id) },
        data: {
          name,
          email
        },
      });
      return NextResponse.json({ appointment: updatedStudent }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }
  }
