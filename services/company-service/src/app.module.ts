import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';


//SCHEMAS
import { UserSchema } from './schemas/user.schema';


//EMPRESA
import { EmpresaSchema } from './empresa/schemas/empresa.schema';
import { EmpresaService } from './empresa/empresa.service';
import { EmpresaController } from './empresa/empresa.controller';

//CONDUCTOR
import { RutaSchema } from './conductor/schemas/ruta.schema';
import { ConductorSchema } from './conductor/schemas/conductor.schema';
import { ConductorService } from './conductor/conductor.service';
import { ConductorController } from './conductor/conductor.controller';


// Pais
import { PaisSchema } from './pais/schemas/pais.schema';
import { PaisController } from './pais/pais.controller';
import { PaisService } from './pais/pais.service';

const env = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: `environments/${env}.env`,
      isGlobal: true,
    }),   
    MongooseModule.forRoot(
      `${process.env.MONGO_URL}?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },      
      { name: 'Ruta', schema: RutaSchema },
      { name: 'Conductor', schema: ConductorSchema },     
      { name: 'Empresa', schema: EmpresaSchema },
      { name: 'Pais', schema: PaisSchema },
    ])
  ],
  controllers: [
    EmpresaController,
    ConductorController,
    PaisController
  ],
  providers: [
    EmpresaService,
    ConductorService,
    PaisService
  ],
})
export class AppModule {}
