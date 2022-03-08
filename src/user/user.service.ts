import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DaoService from '../shared/abstract-dao.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService extends DaoService<User> {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){
        super(userRepository);
    }

    protected entityName(): string {
        return User.name;
    }

    async findAllUsers() {
        return this.find();
    }

    async findUserByEmail(userEmail: string) {
        return this.findOne({ email: userEmail });
    }

    async findUserById(userId: string) {
        return this.findOne({ id: userId });
    }
}