// /pages/api/students/index.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';

export async function GET() {
  try {
    const students = await prisma.student.findMany();
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const { name, email, description } = await req.json();

    try {
      const newStudent = await prisma.student.create({
        data: {
          name,
          email,
          description
        },
      });
      return NextResponse.json({ student: newStudent }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}