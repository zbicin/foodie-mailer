import * as request from 'request-promise-native';

export class FB {
    public static TIMELINE_PHOTOS_ALBUM_ID = '813250078809691';

    private appId: string;
    private appSecret: string;
    private accessToken: string;

    constructor(appId: string, appSecret: string) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.accessToken = `${appId}|${appSecret}`;
    }

    public getAlbumPhotos(albumId: string): request.RequestPromise {
        const requestOptions: request.Options = {
            url: `https://graph.facebook.com/v2.12/${albumId}/photos`,
            qs: {
                'access_token': this.accessToken
            },
            json: true
        };
        return request.get(requestOptions);
    }

    public getPhotoImages(photoId: string): request.RequestPromise {
        const requestOptions: request.Options = {
            url: `https://graph.facebook.com/v2.12/${photoId}`,
            qs: {
                'access_token': this.accessToken,
                fields: 'images'
            },
            transform: (body) => JSON.parse(body)
        };
        return request.get(requestOptions);
    }
}