import { UserDto } from '../users/dto/user.dto';
export const getUserRedirect = ({ roles }: UserDto): string => {
  return '/cabinet/';
};
