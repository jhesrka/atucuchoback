import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";  // Importar la entidad User

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", {
    nullable: false,
  })
  content: string;

  @Column("varchar", {
    array: true,
    nullable: true
  })
  imgpost: string[];

  @Column("varchar", {
    length: 30,
    nullable: false,
  })
  title: string;

  @Column("varchar", {
    length: 30,
    nullable: false,
  })
  subtitle: string;

  @Column("timestamp", {
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("bool", {
    default: true,
  })
  status: boolean;

  // Relación de un post con un usuario
  @ManyToOne(() => User, (user) => user.posts) // Un post pertenece a un usuario
  @JoinColumn({ name: "userId" }) // La columna que se usa para la relación
  user: User;
}
