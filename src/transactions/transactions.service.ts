import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async findAll(queryDto: QueryTransactionsDto): Promise<PaginationDto<Transaction>> {
    const { page = 1, limit = 10, userId, type, status, network, currency, department } = queryDto;
    
    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction');
    
    // Apply filters if they exist
    if (userId) {
      queryBuilder.andWhere('transaction.userId = :userId', { userId });
    }
    
    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }
    
    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }
    
    if (network) {
      queryBuilder.andWhere('transaction.network = :network', { network });
    }
    
    if (currency) {
      queryBuilder.andWhere('transaction.currency = :currency', { currency });
    }
    
    if (department) {
      queryBuilder.andWhere('transaction.department = :department', { department });
    }
    
    // Count total items for pagination
    const totalItems = await queryBuilder.getCount();
    
    // Apply pagination
    const items = await queryBuilder
      .orderBy('transaction.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    
    // Return paginated result
    return new PaginationDto<Transaction>(items, totalItems, page, limit);
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
} 