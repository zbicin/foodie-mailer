import * as request from 'request-promise-native';

const ocrUrl = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr';

export class OCR {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    public analyzeByUrl(imageUrl: string): Promise<string> {
        const requestOptions = this.buildUrlRequestOptions(imageUrl);
        return request.post(requestOptions).then((response) => {
            return this.concatenateResponse(response);
        });
    }

    public analyzeByBuffer(image: Buffer): Promise<string> {
        const requestOptions = this.buildBufferRequestOptions(image);
        return request.post(requestOptions).then((response) => {
            return this.concatenateResponse(response);
        });
    }

    private buildBufferRequestOptions(image: Buffer): request.Options {
        const requestOptions: request.Options = {
            url: ocrUrl,
            qs: {
                language: 'pl',
                detectOrientation: false
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                'Ocp-Apim-Subscription-Key': this.key
            },
            json: true,
            method: 'POST',
            formData: {
                image: image
            }
        };
        return requestOptions;
    }

    private buildUrlRequestOptions(imageUrl: string): request.Options {
        const requestOptions: request.Options = {
            url: ocrUrl,
            qs: {
                language: 'pl',
                detectOrientation: false
            },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.key
            },
            json: true,
            method: 'POST',
            body: JSON.stringify({
                url: imageUrl
            })
        };
        return requestOptions;
    }

    private concatenateResponse(response: any): string {
        let result: string[] = [];
        response.regions.forEach((region: any) => {
            region.lines.forEach((line: any) => {
                result.push(line.words.map((w: any) => w.text).join(' '));
            })
        });
        return result.join('\r\n');
    }
}