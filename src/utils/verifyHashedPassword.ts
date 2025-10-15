"use server";
import bcrypt from 'bcryptjs';

export async function verifyHashedPassword(
  inputPassword: string,
  storedHashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
  return isMatch;
}