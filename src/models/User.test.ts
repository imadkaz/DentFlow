import 'dotenv/config';   // ✅ أول سطر


import { afterEach, describe, it, expect } from "vitest";
import { prisma } from "../db";
import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User.model";
import { randomUUID } from "node:crypto";
import { NotFoundError } from '../util/exceptions/http/NotFoundError';

const userRepository = new UserRepository(prisma);
const createdIds: string[] = [];

afterEach(async () => {
    
    for (const id of createdIds) {
        await prisma.user.deleteMany({ where: { id } });
    }
    createdIds.length = 0;
});

describe('UserRepository (integration)', () => {
    it('saves a user and reads it back by id', async () => {
        const email = `test-${Date.now()}@example.com`;
        const user = User.create({
            id: randomUUID(),
            firstName: 'Findable',
            lastName: 'User',
            email,
            passwordHash: 'hashedpassword',
        });

        try {
            const savedUser = await userRepository.save(user);
            createdIds.push(savedUser.getId());

            const foundUser = await userRepository.findById(savedUser.getId());
            expect(foundUser?.getFirstName()).toBe('Findable');
            expect(foundUser?.getLastName()).toBe('User');
        } catch (e: any) {
            console.log('CODE:', e.code);
            console.log('MESSAGE:', e.message);
            console.log('META:', JSON.stringify(e.meta));
            throw e;
        }
    });

    it('finds a user by email', async () => {
        const email = `test-${Date.now()}@example.com`;
        const user = User.create({
            id: randomUUID(),
            firstName: 'Findable',
            lastName: 'User',
            email,
            passwordHash: 'hashedpassword',
        });
        try{
            const savedUser = await userRepository.save(user);
            createdIds.push(savedUser.getId());

            const foundUser = await userRepository.findByEmail(email);
            expect(foundUser?.getEmail()).toBe(savedUser.getEmail());
        } catch (e: any) {
            console.log('CODE:', e.code);
            console.log('MESSAGE:', e.message);
            console.log('META:', JSON.stringify(e.meta));
            throw new NotFoundError('User not found');
        }
    })

    it('returns null when user does not exist', async () => {
        const foundUser = await userRepository.findById(randomUUID());
        expect(foundUser).toBeNull();
    });

    it('updates a user', async () => {
        const user = User.create({
            id: randomUUID(),
            firstName: 'Updatable',
            lastName: 'User',
            email: `updatable-${Date.now()}@example.com`,
            passwordHash: 'hashedpassword',
        });
        const savedUser = await userRepository.save(user);
        createdIds.push(savedUser.getId());
        const updatedUser = User.create({
            id: savedUser.getId(),
            firstName: 'Updated',
            lastName: 'User',
            email: savedUser.getEmail(),
            passwordHash: 'newhashedpassword',
        });
        const result = await userRepository.update(updatedUser);
        expect(result.getFirstName()).toBe('Updated');
        expect(result.getPasswordHash()).toBe('newhashedpassword');
    });

    it('deletes a user', async () => {
        const user = User.create({
            id: randomUUID(),
            firstName: 'Deletable',
            lastName: 'User',
            email: `deletable-${Date.now()}@example.com`,
            passwordHash: 'hashedpassword',
        });
        const savedUser = await userRepository.save(user);
        await userRepository.delete(savedUser.getId());
        const foundUser = await userRepository.findById(savedUser.getId());
        expect(foundUser).toBeNull();
    });
});