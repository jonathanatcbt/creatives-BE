import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  User,
  ProjectStatus,
  Company,
  Comments,
  EditingStatus,
  OtherStatus,
  ClientOtherStatus,
  ClientEditingStatus,
  ProjectEditor,
} from "./index";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column({ nullable: true })
  projectType: string;
  @Column({ default: null })
  talentName: string;

  @Column({ nullable: true })
  clientId: number;

  @Column({ nullable: true })
  briefLink: string;

  @Column({ nullable: true })
  videoFolderName: string;

  @Column({ nullable: true })
  talentFootageLink: string;

  @Column({ nullable: true })
  editorId: number;

  @Column({ type: "date", nullable: true })
  completionDate: Date;

  @Column({ type: "date", nullable: true })
  createdDate: Date;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  brandId: number;

  @Column({ default: false })
  hide: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  userActiveProject: boolean;

  @Column({ default: false })
  isDisable: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.adminProjects)
  admin: User;

  @Column({ nullable: true })
  updatedBy: number;
  // Define relationship with editor (many projects to one editor)
  @ManyToOne(() => User, (user) => user.editorProjects)
  editor: User;

  // Define relationship with client (many projects to one client)
  @ManyToOne(() => User, (user) => user.clientProjects)
  client: User;

  @OneToMany(() => ProjectStatus, (status) => status.project)
  statuses: ProjectStatus[];

  @OneToMany(() => Comments, (comment) => comment.project)
  comments: Comment[];

  @Column({ nullable: true })
  currentStatus: string;

  @Column({ nullable: true })
  finalFolder: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  delivered: boolean;
  @Column({ nullable: true })
  currentStage: string;

  @OneToMany(() => EditingStatus, (editingStatus) => editingStatus.project)
  editingStatuses: EditingStatus[];

  @OneToMany(() => OtherStatus, (otherStatus) => otherStatus.project)
  otherStatuses: OtherStatus[];

  @OneToMany(
    () => ClientOtherStatus,
    (clientOtherStatus) => clientOtherStatus.project
  )
  clientOtherStatuses: ClientOtherStatus[];

  @OneToMany(
    () => ClientEditingStatus,
    (clientEditingStatus) => clientEditingStatus.project
  )
  clientEditingStatuses: ClientEditingStatus[];

  @OneToMany(() => ProjectEditor, (projectEditor) => projectEditor.project)
  projectEditors: ProjectEditor[];

  @ManyToOne(() => Company, (company) => company.projects)
  company: Company;
}
