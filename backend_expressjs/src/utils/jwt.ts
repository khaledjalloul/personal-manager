import jwt from 'jsonwebtoken';

export function generateToken(payload: { id: number; email: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '14d' });
}
