import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { BotReplyJobEntity } from '../chat/botReplyJob.entity';
import {
  BOT_REPLY_MAX_ATTEMPTS,
  BOT_REPLY_POLL_MS,
} from 'src/utils/bot-reply.constants';

type Handler = (userId: string, botId: string) => Promise<void>;

@Injectable()
export class BotReplyScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BotReplyScheduler.name);
  private timer?: NodeJS.Timeout;
  private busy = false;
  private handler?: Handler;

  constructor(
    @InjectRepository(BotReplyJobEntity)
    private readonly repo: Repository<BotReplyJobEntity>,
  ) {}

  setHandler(fn: Handler) {
    this.handler = fn;
  }

  async onModuleInit() {
    await this.repo.update({ status: 'processing' }, { status: 'pending' });
    this.logger.log(`Bot reply job runs every ${BOT_REPLY_POLL_MS}ms`);
    void this.tick();
    this.timer = setInterval(() => void this.tick(), BOT_REPLY_POLL_MS);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async schedule(userId: string, botId: string, delayMs: number) {
    const existing = await this.repo.findOne({
      where: { userId, botId, status: In(['pending', 'processing']) },
    });
    if (existing) {
      return { alreadyScheduled: true, runAt: existing.runAt };
    }

    const runAt = new Date(Date.now() + delayMs);
    await this.repo.save(
      this.repo.create({ userId, botId, runAt, status: 'pending' }),
    );
    return { alreadyScheduled: false, runAt };
  }

  private async tick() {
    if (this.busy || !this.handler) return;
    this.busy = true;

    try {
      const due = await this.repo.find({
        where: { status: 'pending', runAt: LessThanOrEqual(new Date()) },
        order: { runAt: 'ASC' },
        take: 10,
      });

      for (const job of due) {
        const claim = await this.repo.update(
          { id: job.id, status: 'pending' },
          { status: 'processing' },
        );
        if (!claim.affected) continue;

        try {
          await this.handler(job.userId, job.botId);
          await this.repo.delete(job.id);
        } catch (err: any) {
          const attempts = job.attempts + 1;
          this.logger.error(
            `Bot reply failed (attempt ${attempts}): ${err?.message}`,
          );
          if (attempts >= BOT_REPLY_MAX_ATTEMPTS) {
            await this.repo.delete(job.id);
          } else {
            await this.repo.update(job.id, {
              status: 'pending',
              attempts,
              runAt: new Date(Date.now() + 30_000 * attempts),
            });
          }
        }
      }
    } finally {
      this.busy = false;
    }
  }
}
