import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' }
                }
            }   
        }) 
    ],
    exports: [JwtModule]
})
export default class SharedModule {

}