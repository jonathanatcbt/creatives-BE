import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Project } from "./index";

@Entity()
export class OtherStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "date", nullable: true })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;
  @Column({ nullable: true })
  status: boolean;

  @ManyToOne(() => Project, (project) => project.otherStatuses)
  project: Project;
}
