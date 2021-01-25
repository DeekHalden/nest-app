import { Role, UserRole } from '../roles/entities/role.entity';
import { getUserRedirect } from './redirect';
import { UserDto } from '../users/dto/user.dto';
describe('redirect', () => {
  it('should return correct redirect url', () => {
    const role: Role = { title: UserRole.ADMIN, id: 1 };
    const url: string = getUserRedirect({ roles: [role] } as UserDto);
    expect(url).toEqual('/cabinet/');
  });
});
