import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ProjectStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  previousStage: string;

  @Column({ nullable: true })
  currentStage: string;

  @Column({ nullable: true })
  projectId: number;

  @Column({ nullable: true })
  module: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" }) // Add this line
  updatedAt: Date;
}
