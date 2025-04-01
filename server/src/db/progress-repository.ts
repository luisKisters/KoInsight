import { Progress } from '@/common/types/progress';
import { User } from '@/common/types/user';
import knex from '../knex';

export type ProgressCreate = Omit<Progress, 'id' | 'created_at' | 'updated_at'>;
export type ProgressUpdate = Omit<Progress, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export class ProgressRepository {
  static async hasDocument(user_id: User['id'], document: Progress['document']): Promise<boolean> {
    const result = await knex<Progress>('progress')
      .where({ user_id, document })
      .select('id')
      .first();
    return !!result;
  }

  static async create(progress: ProgressCreate): Promise<Progress | undefined> {
    const date = new Date();
    const result = await knex<Progress>('progress')
      .insert({ ...progress, created_at: date, updated_at: date })
      .returning('*');
    return result.at(0);
  }

  static async update(
    user_id: User['id'],
    progress: ProgressUpdate
  ): Promise<Progress | undefined> {
    const result = await knex<Progress>('progress')
      .where({ user_id, document: progress.document })
      .update({ ...progress, updated_at: new Date() })
      .returning('*');

    return result.at(0);
  }

  static async upsert(
    user_id: User['id'],
    progress: ProgressUpdate
  ): Promise<Progress | undefined> {
    const exists = await this.hasDocument(user_id, progress.document);

    if (exists) {
      return this.update(user_id, progress);
    } else {
      return this.create({ ...progress, user_id });
    }
  }

  static async getByUserIdAndDocument(
    user_id: User['id'],
    document: Progress['document']
  ): Promise<Progress | undefined> {
    const result = await knex<Progress>('progress')
      .where({ user_id, document })
      .select('*')
      .first();
    return result;
  }

  static async getAll(): Promise<Progress[]> {
    const result = await knex<Progress>('progress').select('*');
    return result;
  }
}
