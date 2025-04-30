import { Test, TestingModule } from '@nestjs/testing';
import { PayrollsController } from './payroll.controller';
import { PayrollsService } from './payroll.service';

describe('PayrollsController', () => {
  let controller: PayrollsController;
  let service: PayrollsService;

  const mockPayrollsService = {
    createPayroll: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getPayrollDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollsController],
      providers: [
        {
          provide: PayrollsService,
          useValue: mockPayrollsService,
        },
      ],
    }).compile();

    controller = module.get<PayrollsController>(PayrollsController);
    service = module.get<PayrollsService>(PayrollsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPayroll', () => {
    it('should call service.createPayroll', async () => {
      const dto = { 
        paymentDate: new Date(), 
        employees: [] 
      };
      const expectedResult = { id: 1 };
      
      mockPayrollsService.createPayroll.mockResolvedValue(expectedResult);
      
      const result = await controller.createPayroll(dto);
      
      expect(result).toBe(expectedResult);
      expect(service.createPayroll).toHaveBeenCalledWith(dto);
    });
  });

});