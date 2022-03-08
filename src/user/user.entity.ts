import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ default: false })
    is_admin: boolean;
}