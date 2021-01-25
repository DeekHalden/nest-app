import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/entities/user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, email, roles } = data;
  const userDto: UserDto = { id, email, roles };
  return userDto;
};
