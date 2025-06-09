import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {
        // La imagen es opcional
        if (!file) {
            return null
        }

        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        const maxSize = 5 * 1024 * 1024

        if (!allowedMimeTypes.includes(file.mimetype)){
            throw new BadRequestException(
                'Solo se permite archivos de imagen JPEG, JPG, PNG, GIF, WEBP.'
            )
        }

        return file;
    }
}