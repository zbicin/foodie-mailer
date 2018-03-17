import moment from 'moment';
import { CronJob } from 'cron';
import { RequestPromise } from 'request-promise-native';

import { Utils } from './utils';
import { OCR } from './ocr';
import { FB } from './fb';
import { Config } from './config';
import { Mailer } from './mailer';

const config = new Config()
try {
    config.validate();
} catch (e) {
    console.error(e);
    process.exit(1);
}

const ocr = new OCR(config.azureKey);
const fb = new FB(config.fbAppId, config.fbAppSecret);
const mailer = new Mailer(config.sendInBlueKey);
let lastRunAt = moment();

const log = (...args: any[]) => console.log(moment().toISOString(), ...args);

const job = () => {
    log('Job ticked');
    log('Fetching timeline images...');
    fb.getAlbumPhotos(FB.TIMELINE_PHOTOS_ALBUM_ID)
        .then((response: AlbumPhotosResponse) => {
            const newPhotos = response.data.filter((photo: SingleAlbumPhoto, i: number) => {
                if (config.isDebug) {
                    return i < 2;
                } else {
                    return lastRunAt.diff(moment(photo.created_time), 'minutes') < 0;
                }
            });
            log(`Found ${newPhotos.length} new photos since ${lastRunAt.toISOString()}`);
            lastRunAt = moment();
            const promises = newPhotos.map((np) => fb.getPhotoImages(np.id));
            return Promise.all(promises);

        }).then((responses: PhotoImagesResponse[]) => {
            log('Downloading images');
            const urls = responses.map((r) => r.images[0].source);
            urls.forEach((u) => log(u));
            const promises = urls.map((u) => Utils.downloadImage(u));
            return Promise.all(promises);

        }).then((images: Buffer[]) => {
            log('Enhancing images');
            const promises = images.map((i) => Utils.enhanceImage(i));
            return Promise.all(promises);

        }).then((images: Buffer[]) => {
            log('Sending to OCR');
            const promises = images.map((i) => ocr.analyzeByBuffer(i));
            return Promise.all(promises);

        }).then((texts: string[]) => {
            const text = texts.join('\r\n');
            log(`Got result: ${text.slice(0, 100).split('\r\n').join('')}`);

        }).catch((e) => {
            console.error(e);

        });
};

const cron = new CronJob(config.cronTime, job);
//cron.start();
log(`App started. Debug mode: ${config.isDebug}. Cron time: ${config.cronTime}.`);