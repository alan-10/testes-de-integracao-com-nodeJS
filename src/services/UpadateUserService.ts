import { readFile } from '../utils/readFileAndWriteFile';
import { User } from '../models/User';
import { AppError } from '../errors/AppError';
import bcrypt from 'bcryptjs';
import { writeFile } from '../utils/readFileAndWriteFile';

interface Request {
  id: string;
  email: string;
  password: string;
}

export class UpdateUserService {
  execute({ email, id, password }: Request): User {
    const users: User[] = readFile();

    const verifyEmailUsed = users.find(user => user.email === email);

    const selectUserByIndex = users.findIndex(user => user.id == id);

    if (selectUserByIndex === -1) {
      throw new AppError('User not exists', 404);
    }

    const { email: emailCurrent, password: passwordCurrent } =
      users[selectUserByIndex];

    const userUpdated = {
      id: id,
      email: email ? email : emailCurrent,
      password: password ? bcrypt.hashSync(password) : passwordCurrent,
    };

    if (!!verifyEmailUsed && email !== emailCurrent) {
      
      throw new AppError('email alread exists', 409);
    }

    users[selectUserByIndex] = userUpdated;

    writeFile(users);

    return userUpdated;
  }
}
