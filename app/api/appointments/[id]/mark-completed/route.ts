// /pages/api/appointments/[id].ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../utils/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { completed } = await req.json();

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        completed
      },
    });
    return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
