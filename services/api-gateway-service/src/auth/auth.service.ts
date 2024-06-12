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
        codigo_usuario: user.codigo_usuario,
        email: user.email,
        roles: user.roles,
        nombre_apellido: user.nombre_apellido,
        avatar: user.avatar,
        access_token: this.jwtService.sign({
          id_user: user._id,
          codigo_usuario: user.codigo_usuario,
          email: user.email,
          roles: user.roles,
          nombre_apellido: user.nombre_apellido,
        }),
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
