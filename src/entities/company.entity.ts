import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { User, Project } from "./index";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @DeleteDateColumn({ name: "deletedAt", type: "timestamptz" })
  deletedAt: Date;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Project, (project) => project.company, { cascade: true }) // Add cascade option
  projects: Project[];

  @CreateDateColumn({ type: "timestamp" }) // Automatically set the creation date
  createdDate: Date;
  @UpdateDateColumn({ type: "timestamp" }) // Add this line
  updatedAt: Date;
}
