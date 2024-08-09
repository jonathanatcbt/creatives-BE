import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Project } from "./index";
@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commentText: string;

  @CreateDateColumn({ type: "timestamp" }) // Automatically set the creation date
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp" }) // Automatically update the modification date
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.comments)
  project: Project;
}
