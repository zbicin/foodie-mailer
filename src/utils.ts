import sharp from 'sharp';
import * as request from 'request-promise-native';

export class Utils {
    constructor() {
        throw new Error('It\'s a static class, mate');
    }

    public static enhanceImage(image: Buffer): Promise<Buffer> {
        return sharp(image)
            .normalise()
            .grayscale()
            .toBuffer();
    }

    public static downloadImage(url: string): request.RequestPromise {
        const requestOptions: request.Options = {
            url: url,
            encoding: null
        };
        return request.get(requestOptions);
    }
}