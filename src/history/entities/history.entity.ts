import { BeforeUpdate, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class History {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_id', type: 'uuid', default: 'uuid_generate_v4()' })
  displayId: string;

  @Column({ name: 'search', type: 'text' })
  search: string;

  @Column({ name: 'provider', type: 'text' })
  provider: string;

  @Column({ name: 'response', type: 'json' })
  response: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}