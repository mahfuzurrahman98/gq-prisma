import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import prisma from '../lib/db';

dotenv.config();

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export default class UserService {
  private static async findUserByEmail(email: string) {
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  public static async createUser(payload: createUserPayload) {
    try {
      // first check if user already exists
      let user = await this.findUserByEmail(payload.email);
      if (user) {
        throw new Error('User already exists');
      }
      // if user does not exist, create user
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(payload.password, salt);
      let newUser = await prisma.user.create({
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName || '',
          email: payload.email,
          password: hashedPass,
          profileImage: '',
        },
      });
      return newUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public static async getUserToken(email: string, password: string) {
    // first check if user exists
    let user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    // if user exists, check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }
    // if password is valid, generate token
    const jwtSecret = String(process.env.JWT_SECRET);
    const token = Jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: '5m',
    });
    return token;
  }
}
