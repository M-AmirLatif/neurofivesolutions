import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const cookieName = 'momentum_session';
const tokenLifetime = '7d';
const secret = process.env.JWT_SECRET || 'momentum-development-secret-change-in-production';

export function publicUser(user) { return { id: user.id, name: user.name, email: user.email }; }
export function createToken(user) { return jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: tokenLifetime }); }
export function sessionCookie(response, token) { response.cookie(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' }); }
export function clearSession(response) { response.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }); }
export function requireAuth(request, response, next) {
  const token = request.cookies?.[cookieName];
  if (!token) return response.status(401).json({ message: 'Please sign in to continue.' });
  try { request.auth = jwt.verify(token, secret); return next(); }
  catch { clearSession(response); return response.status(401).json({ message: 'Your session has expired. Please sign in again.' }); }
}
export function validateSignup(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const errors = {};
  if (name.length < 2) errors.name = 'Enter at least 2 characters.';
  if (name.length > 60) errors.name = 'Keep your name under 60 characters.';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) errors.password = 'Include uppercase, lowercase, and a number.';
  return { errors, value: { id: crypto.randomUUID(), name, email, password } };
}
export async function hashPassword(password) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password, hash) { return bcrypt.compare(password, hash); }