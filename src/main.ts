import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
config();

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enableCors();
  const httpApp = await NestFactory.create<NestExpressApplication>(AppModule);
  httpApp.enableCors();
  // await httpApp.listen(3000);
  // app.use(
  //   multer({
  //     dest: path.join(__dirname, "uploads"),
  //   }).single("image")
  // );

  httpApp.setGlobalPrefix("api/v1");

  // Enable validation for incoming requests
  // app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Dynamic Creative")
    .setDescription("Dynamic Creative Api")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  // app.setGlobalPrefix("api/v1");
  SwaggerModule.setup("api", httpApp, document);

  await httpApp.listen(process.env.PORT);
  const ioApp = await NestFactory.create(AppModule);
  ioApp.useWebSocketAdapter(new IoAdapter(ioApp));
}
bootstrap();
