import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayrollsService } from './payroll.service';
import { Payroll, PayrollStatus } from './payroll.entity';
import { PayrollEmployeeDetail } from './payroll-employee.entity';
import { NotFoundException } from '@nestjs/common';

describe('PayrollsService', () => {
  let service: PayrollsService;

  const mockPayrollRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPayrollDetailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollsService,
        {
          provide: getRepositoryToken(Payroll),
          useValue: mockPayrollRepository,
        },
        {
          provide: getRepositoryToken(PayrollEmployeeDetail),
          useValue: mockPayrollDetailRepository,
        },
      ],
    }).compile();

    service = module.get<PayrollsService>(PayrollsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayroll', () => {
    it('should create a payroll and employee details', async () => {
      const mockPayroll = {
        id: 1,
        status: PayrollStatus.PENDING,
      };

      mockPayrollRepository.create.mockReturnValue(mockPayroll);
      mockPayrollRepository.save.mockResolvedValue(mockPayroll);
      mockPayrollDetailRepository.create.mockReturnValue({});
      mockPayrollDetailRepository.save.mockResolvedValue([]);
      
      const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(mockPayroll as Payroll);

      const dto = {
        paymentDate: new Date(),
        employees: [{ employee_id: 1, amount: 1000 }],
      };

      const result = await service.createPayroll(dto);
      
      expect(result).toBe(mockPayroll);
      expect(mockPayrollRepository.create).toHaveBeenCalled();
      expect(mockPayrollRepository.save).toHaveBeenCalled();
      expect(mockPayrollDetailRepository.create).toHaveBeenCalled();
      expect(mockPayrollDetailRepository.save).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a payroll if found', async () => {
      const mockPayroll = { id: 1 };
      mockPayrollRepository.findOne.mockResolvedValue(mockPayroll);
      
      const result = await service.findOne(1);
      expect(result).toBe(mockPayroll);
    });

    it('should throw NotFoundException if payroll not found', async () => {
      mockPayrollRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPayrollDetails', () => {
    it('should return details if found', async () => {
      const mockDetails = [{ id: 1 }];
      mockPayrollDetailRepository.find.mockResolvedValue(mockDetails);
      
      const result = await service.getPayrollDetails(1);
      expect(result).toBe(mockDetails);
    });

    it('should throw NotFoundException if no details found', async () => {
      mockPayrollDetailRepository.find.mockResolvedValue([]);
      
      await expect(service.getPayrollDetails(999)).rejects.toThrow(NotFoundException);
    });
  });
});