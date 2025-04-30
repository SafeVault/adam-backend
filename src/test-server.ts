import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppTestModule } from './app.test.module';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from './transactions/transactions.entity';

async function seedTestData(dataSource: DataSource) {
  try {
    // Sample data
    const transactions = [
      {
        type: TransactionType.DEPOSIT,
        amount: 2458.66,
        from: '0x4f...3a4c0',
        to: '0x8f...7a81b',
        department: 'Marketing',
        status: TransactionStatus.SUCCESSFUL,
        network: 'Ethereum',
        currency: 'ETH',
        userId: '1',
      },
      {
        type: TransactionType.WITHDRAW,
        amount: 2458.66,
        from: '0x4f...3a4c0',
        to: '0x8f...7a81b',
        department: 'Marketing',
        status: TransactionStatus.FAILED,
        network: 'Ethereum',
        currency: 'ETH',
        userId: '1',
      },
      {
        type: TransactionType.DEPOSIT,
        amount: 2458.66,
        from: '0x4f...3a4c0',
        to: '0x8f...7a81b',
        department: 'Marketing',
        status: TransactionStatus.PENDING,
        network: 'Ethereum',
        currency: 'ETH',
        userId: '1',
      },
    ];

    const transactionRepository = dataSource.getRepository(Transaction);

    // Save transactions
    for (const transactionData of transactions) {
      const transaction = transactionRepository.create(transactionData);
      await transactionRepository.save(transaction);
    }

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppTestModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  
  // Bypass JWT auth for testing
  app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: '1', username: 'testuser', role: 'admin' };
    next();
  });

  // Get DataSource
  const dataSource = app.get(DataSource);
  
  await app.listen(3001);
  console.log('Test server running on http://localhost:3001');
  
  // Seed some test data
  await seedTestData(dataSource);
}

bootstrap(); 