'use server';

import { getMongoDb } from '../mongodb';
import { cookies } from 'next/headers';
import { verifyAdminJwt, COOKIE_NAME } from '../auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyAdminJwt(token);
  if (!payload || payload.role !== 'admin') return null;

  return payload;
}

export async function getUsers() {
  const admin = await checkAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const db = await getMongoDb();
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return { 
      success: true, 
      users: JSON.parse(JSON.stringify(users)) 
    };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function deleteUser(userId: string) {
  const admin = await checkAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const db = await getMongoDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      revalidatePath('/admin/users');
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const admin = await checkAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const db = await getMongoDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 1) {
      revalidatePath('/admin/users');
      return { success: true };
    }
    return { success: false, error: 'User not found or role unchanged' };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}
