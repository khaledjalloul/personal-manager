import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSigninDto, AuthSignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: AuthSignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (existingUser) throw new BadRequestException('CREDENTIALS_TAKEN');

    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        hash,
      },
    });

    // this.emailService.sendVerificationEmail(
    //   user.email,
    //   `${this.config.get('SERVER_URL')}:3000/auth/verifyEmail?token=${token}`,
    // );

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: await this.jwt.signAsync({ id: user.id }),
    };
  }

  async signin(dto: AuthSigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new BadRequestException('CREDENTIALS_INCORRECT');

    // if (!user.emailVerified)
    //   throw new BadRequestException({
    //     statusCode: 400,
    //     message: 'EMAIL_NOT_VERIFIED',
    //     userId: user.id,
    //     isBranch,
    //   });

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new BadRequestException('CREDENTIALS_INCORRECT');

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: await this.jwt.signAsync({ id: user.id }),
    };
  }
}
