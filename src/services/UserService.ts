import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { isValidEmail } from '../helpers';
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

  public static async findUserById(id: string) {
    let user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  public static async createUser(payload: createUserPayload) {
    try {
      // first trim all whitespaces
      payload.firstName = payload.firstName.trim();
      payload.lastName = payload.lastName?.trim();
      payload.email = payload.email.trim();
      payload.password = payload.password.trim();

      // check all fields are valid
      if (!payload.firstName) {
        throw new Error('First name is required');
      }
      if (!payload.lastName) {
        throw new Error('Last name is required');
      }
      if (!payload.email) {
        throw new Error('Email is required');
      }
      // check email is valid
      if (!isValidEmail(payload.email)) {
        throw new Error('Invalid email');
      }
      if (!payload.password) {
        throw new Error('Password is required');
      }

      // check if user already exists
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

  public static async decodeJWTToken(token: string) {
    const jwtSecret = String(process.env.JWT_SECRET);
    return Jwt.verify(token, jwtSecret);
  }
}
