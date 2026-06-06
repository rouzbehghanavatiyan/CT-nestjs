import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';

@Entity('Payment')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  crypto: string; // نوع ارز دیجیتال (BTC, ETH, USDT)

  @Column()
  network: string; // شبکه (TRX, ERC20, BEP20)

  @Column('decimal')
  amount: number; // مبلغ واریز

  @Column()
  walletAddress: string; // آدرس کیف پول

  @Column({ default: 'pending' })
  status: string; // وضعیت تراکنش (pending, completed, failed)

  @Column('int')
  userId: number;
}
