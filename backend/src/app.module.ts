import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MusicModule } from './music/music.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 数据库连接 (本示例中暂时使用内存数据库)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'soundsphere'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
      }),
    }),
    
    // 功能模块
    AuthModule,
    UserModule,
    MusicModule,
    CollaborationModule,
    KnowledgeModule,
    MarketplaceModule,
  ],
})
export class AppModule {} 