import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectOrdering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("integer", { array: true, default: [] })
  projectOrder: number[];
}
