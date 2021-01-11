import { ApiService } from "./api.service";
import { LoginUserDto } from '../../../backend/src/users/dto/login-user.dto'
import { CreateUserDto } from '../../../backend/src/users/dto/create-user.dto'
export class AuthService extends ApiService {
  constructor() {
    super('/auth')
    this.post.bind(this);
  }
  async login(loginUserDto: LoginUserDto): Promise<any> {
    // this.action()
    return this.post('/login', loginUserDto);
  }
  async register(createUserDto: CreateUserDto): Promise<any> {
    return this.post('/register', createUserDto);
  }
}