import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'dashboard-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}
