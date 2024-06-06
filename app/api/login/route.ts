import crypto from 'crypto';
import { signToken } from '../../../lib/jwt';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import { prisma } from '../../../utils/db';

import { NextResponse } from 'next/server'
 
export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, {status: 401,})
    }

    // Verificar la contraseña cifrada
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    console.log(hash);


    if (user.password !== hash) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, {status: 401,})
    }

    // Generar un token JWT
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    cookies().set('auth', token)

    return NextResponse.json({ success: true, message: 'Login successful' }, {status: 200,})
  } catch (error) {
    console.error(error);
    
    return NextResponse.json({ success: false, message: 'Internal server error' }, {status: 500,})
  }
}
