import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/intities/user.entity';

export const toUserDto = (data: User): UserDto => {
  const { id, username, email, roles } = data;
  const userDto: UserDto = { id, username, email, roles };
  return userDto;
};
