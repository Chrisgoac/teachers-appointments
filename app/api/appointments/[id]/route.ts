// /pages/api/appointments/[id].ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.appointment.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        student: true,
      },
    });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { studentId, startDate, endDate, description, type } = await req.json();

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        studentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        description,
      },
    });
    return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
