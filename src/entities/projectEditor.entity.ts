import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { Project } from "./index";
import { User } from "./index";

@Entity()
export class ProjectEditor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.projectEditors)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectEditors)
  editor: User;
}
