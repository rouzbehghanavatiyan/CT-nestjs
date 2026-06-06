import { Injectable } from '@nestjs/common';
import { StoreEntity } from './store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './paymant.entity';

@Injectable()
export class StoreService {
  private generateWalletAddress(crypto: string, network: string): string {
    return `${crypto}-${network}-${Math.random().toString(36).substring(2, 15)}`;
  }
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getAllStores(): Promise<StoreEntity[]> {
    return this.storeRepository.find();
  }

  async createPayment(
    userId: number,
    crypto: string,
    network: string,
    amount: number,
  ): Promise<Payment> {
    const walletAddress = this.generateWalletAddress(crypto, network);

    const payment = this.paymentRepository.create({
      userId,
      crypto,
      network,
      amount,
      walletAddress,
      status: 'pending',
    });
    return this.paymentRepository.save(payment);
  }

  async confirmPaymentService(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    console.log('confirmPaymentService', payment);

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new Error('Payment is already confirmed');
    }

    payment.status = 'completed';
    await this.paymentRepository.save(payment);

    return payment;
  }
}
