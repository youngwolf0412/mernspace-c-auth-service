import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Tenant } from "./Tenant";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @UpdateDateColumn()
  updatedAt: number;

  @CreateDateColumn()
  createdAt: number;
}
