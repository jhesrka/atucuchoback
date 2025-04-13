import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { Post } from "./post.model";  // Importar la entidad Post
import { encriptAdapter } from "../../../config";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 80,
    nullable: false
  })
  name: string;

  @Column("varchar", {
    length: 80,
    nullable: false
  })
  surname: string;

  @Column("varchar", {
    length: 80,
    nullable: false,
    unique: true
  })
  email: string;

  @Column("varchar", {
    nullable: false
  })
  password: string;

  @Column("date", {
    nullable: false
  })
  birthday: Date;

  @Column("varchar", {
    nullable: true
  })
  photoperfil: string;

  @Column("varchar", {
    length: 10,
    nullable: false,
    unique: true
  })
  whatsapp: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  updated_at: Date;

  @Column("boolean", {
    default: false
  })
  is_verified: boolean;

  @Column("varchar", {
    length: 20,
    default: true
  })
  status: boolean;

  @BeforeInsert()
  encryptedPassword(){
    this.password = encriptAdapter.hash(this.password)
  }

  // Relación de un usuario con muchos posts
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]; // Un usuario tiene muchos posts
}
