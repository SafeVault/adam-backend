import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

const mockUser: User = {
  id: 1,
  name: 'tester',
  email: 'test@test.com',
  password: 'hashedPassword',
  role: 'employee', // include if your entity has this
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(mockUser);

      const user = await service.findByEmail('test@test.com');
      expect(user).toEqual(mockUser);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);

      const user = await service.findByEmail('notfound@example.com');
      expect(user).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@test.com', role: 'employee', name: 'tester', });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(null);

      const result = await service.validateUser('nope@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const result = await service.validateUser('test@test.com', 'wrongpass');
      expect(result).toBeNull();
    });

    it('should return null on invalid email format or missing fields', async () => {
      expect(await service.validateUser('', 'pass')).toBeNull();
      expect(await service.validateUser('invalid', 'pass')).toBeNull();
      expect(await service.validateUser('', '')).toBeNull();
    });

    it('should return null if email exceeds 320 characters', async () => {
      const longEmail = 'a'.repeat(321) + '@test.com';
      const result = await service.validateUser(longEmail, 'pass');
      expect(result).toBeNull();
    });
  });
});
