import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('api/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @Get('allStore')
  async getAllStore() {
    const res = await this.storeService.getAllStores();
    console.log(res);
    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }

  @Post('createPayment')
  async createPay(@Body() body: any) {
    const { userId, crypto, network, amount } = body;
    const res = await this.storeService.createPayment(
      userId,
      crypto,
      network,
      amount,
    );

    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }

  @Patch('confirmPayment/:id')
  async confirmPayment(@Param('id') id: number) {
    const res = this.storeService.confirmPaymentService(id);
    console.log("Patch('confirmPayment/:", res);
  }
}
