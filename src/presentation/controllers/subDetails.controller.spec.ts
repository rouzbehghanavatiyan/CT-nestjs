import { Test, TestingModule } from '@nestjs/testing';
import { SubDetailsController } from './subDetails.controller';
import { GetAllSubDetailsUseCase } from 'src/application/use-cases/getAllSubDetails.use-case';
import { CreateSubDetailsUseCase } from 'src/application/use-cases/createSubDetails.use-case';

describe('کنترلر زیرمشخصات (SubDetailsController)', () => {
  let controller: SubDetailsController;

  const mockGetAllUseCase = {
    execute: jest.fn(),
  };

  const mockCreateUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubDetailsController],
      providers: [
        {
          provide: GetAllSubDetailsUseCase,
          useValue: mockGetAllUseCase,
        },
        {
          provide: CreateSubDetailsUseCase,
          useValue: mockCreateUseCase,
        },
      ],
    }).compile();

    controller = module.get<SubDetailsController>(SubDetailsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =====================================
  // تست دریافت همه زیرمشخصات
  // =====================================

  it('باید لیست همه زیرمشخصات را برگرداند', async () => {
    const داده_آزمایشی = [{ id: 1, title: 'نمونه تست' }];

    mockGetAllUseCase.execute.mockResolvedValue(داده_آزمایشی);

    const نتیجه = await controller.getAllSubDetailsController();

    expect(mockGetAllUseCase.execute).toHaveBeenCalled();
    expect(نتیجه).toEqual(داده_آزمایشی);
  });

  // =====================================
  // تست ایجاد زیرمشخصه جدید
  // =====================================

  it('باید یک زیرمشخصه جدید ایجاد کند', async () => {
    const dto = { title: 'زیرمشخصه جدید' };
    const پاسخ_آزمایشی = { id: 1, title: 'زیرمشخصه جدید' };

    mockCreateUseCase.execute.mockResolvedValue(پاسخ_آزمایشی);

    const نتیجه = await controller.createDetailController(dto as any);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(dto);
    expect(نتیجه).toEqual(پاسخ_آزمایشی);
  });

  // =====================================
  // تست مدیریت خطا
  // =====================================

  it('در صورت بروز خطا باید خطا را پرتاب کند', async () => {
    mockGetAllUseCase.execute.mockRejectedValue(new Error('خطای پایگاه داده'));

    await expect(controller.getAllSubDetailsController()).rejects.toThrow(
      'خطای پایگاه داده',
    );
  });
});
