import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/jwt';
import { AuthResponse, User } from '../../../lib/types';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookie = cookies().get('auth');
  const token = cookie?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const user: User = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
  };

  return NextResponse.json({ success: true, user }, { status: 200 });
}
