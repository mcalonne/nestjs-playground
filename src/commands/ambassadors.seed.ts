import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import faker from '@faker-js/faker';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const numberOfUsersToCreate = 30;
  let cpt = 0,
    user: User;

  const hashedPassword = await bcrypt.hash('1234', 12);

  while (cpt !== numberOfUsersToCreate) {
    user = await userService.save({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      is_ambassador: true,
    });
    ++cpt;
    Logger.log(
      `[${cpt}/${numberOfUsersToCreate}] ambassador user with id=${user.id} successfully created`,
    );
  }

  process.exit();
})();
