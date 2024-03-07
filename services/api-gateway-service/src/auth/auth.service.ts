import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    var success = true;
    return {
      success: success,
      data: {
        id_user: user._id,
        usuario: user.usuario,
        email: user.email,
        roles: user.roles,
        nombre_apellido: user.nombre_apellido,
        access_token: this.jwtService.sign(user),
      },
    };
  }

  async decode(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      return decoded;
    } catch (e) {
      return e;
    }
  }
}
