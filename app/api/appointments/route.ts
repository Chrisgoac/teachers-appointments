import { NextResponse } from 'next/server';
import {prisma} from '../../../utils/db';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        student: true,
      },
    });
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { studentId, startDate, endDate, description, type } = await req.json();

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        studentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        type
      },
    });
    return NextResponse.json({ appointment: newAppointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

