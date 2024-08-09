import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class EditorNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  body: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ nullable: true })
  projectId: number;

  @Column({ default: false })
  projectHide: boolean;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.editorNotifications)
  user: User;
}
