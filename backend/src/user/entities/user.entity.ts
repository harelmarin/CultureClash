import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    type: String,
  })
  id: string;

  @Column()
  @ApiProperty({ description: "Adresse email de l'utilisateur", type: String })
  email: string;

  @Column()
  @ApiProperty({ description: "Nom d'utilisateur unique", type: String })
  username: string;

  @Column()
  @ApiProperty({ description: "Mot de passe de l'utilisateur", type: String })
  password: string;

  @Column({ default: 0 })
  @ApiProperty({
    description: "Nombre de points de l'utilisateur",
    type: Number,
    default: 0,
  })
  points: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'URL de la photo de profil',
    type: String,
    nullable: true,
  })
  profilePic: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: "Date de création de l'utilisateur",
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}

@Entity('users')
export class UserWithoutPassword {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    type: String,
  })
  id: string;

  @Column()
  @ApiProperty({ description: "Adresse email de l'utilisateur", type: String })
  email: string;

  @Column()
  @ApiProperty({ description: "Nom d'utilisateur unique", type: String })
  username: string;

  @Column({ default: 0 })
  @ApiProperty({
    description: "Nombre de points de l'utilisateur",
    type: Number,
    default: 0,
  })
  points: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'URL de la photo de profil',
    type: String,
    nullable: true,
  })
  profilePic: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: "Date de création de l'utilisateur",
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}
