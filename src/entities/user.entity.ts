import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import {
  Company,
  Project,
  Brand,
  EditorNotification,
  ProjectEditor,
} from "./index";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  fcm_token: string;

  @Column({ default: false })
  is_editor: boolean;

  @Column({ default: false })
  is_super_admin: boolean;

  @Column({ default: false })
  isAccepted: boolean;
  // Define relationship with clients (user to many clients)
  @OneToMany(() => Project, (project) => project.admin)
  clients: Project[];

  // Define relationship with editors (user to many editors)
  @OneToMany(() => Project, (project) => project.editor)
  editors: Project[];

  // Define relationship with admin (many clients/editors to one admin)
  @ManyToOne(() => User, (user) => user.clients)
  admin: User;

  @OneToMany(() => Project, (project) => project.admin)
  adminProjects: Project[];

  // Define relationship with projects as editor (one editor to many projects)
  @OneToMany(() => Project, (project) => project.editor, {
    onDelete: "CASCADE",
  })
  editorProjects: Project[];

  // Define relationship with projects as client (one client to many projects)

  @OneToMany(() => Project, (project) => project.client, {
    onDelete: "CASCADE",
  })
  clientProjects: Project[];

  @OneToMany(() => Brand, (brand) => brand.editor)
  brands: Brand[];

  @OneToMany(() => EditorNotification, (notification) => notification.user)
  editorNotifications: EditorNotification[];

  @OneToMany(() => ProjectEditor, (projectEditor) => projectEditor.editor)
  projectEditors: ProjectEditor[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
}
