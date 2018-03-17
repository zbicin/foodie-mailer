declare interface SingleAlbumPhoto {
    created_time: string;
    id: string;
}

declare interface AlbumPhotosResponse {
    paging: any;
    data: SingleAlbumPhoto[];
}

declare interface SinglePhotoImage {
    height: number;
    source: string;
    width: number;
}

declare interface PhotoImagesResponse {
    id: string;
    images: SinglePhotoImage[];
}

declare interface SecretsJson {
    azureKey: string;
    cronTime: string;
    fbAppId: string;
    fbAppSecret: string;
    isDebug: boolean;
    sendInBlueKey: string;
}