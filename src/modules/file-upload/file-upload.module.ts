import { Module } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";



@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
        }),
    ],
    providers: [FileUploadService],
    exports: [FileUploadService],
})
export class FileUploadModule { }