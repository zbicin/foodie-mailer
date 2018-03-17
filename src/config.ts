import * as fs from 'fs';
import * as path from 'path';

const secretsPath = path.join(__dirname, '..', 'secrets.json');

export class Config {
    public azureKey: string = null;;
    public cronTime: string;
    public fbAppId: string;
    public fbAppSecret: string;
    public isDebug: boolean;
    public sendInBlueKey: string;

    constructor() {
        let secrets: SecretsJson = null;
        let isSecretsPresent = false;

        try {
            const stats = fs.statSync(secretsPath);
            if (stats.isFile()) {
                fs.accessSync(secretsPath, fs.constants.R_OK);
                isSecretsPresent = true;
                const secretsRaw = fs.readFileSync(secretsPath).toString();
                secrets = JSON.parse(secretsRaw);
            }
        } catch (e) { }

        if (isSecretsPresent) {
            this.azureKey = secrets.azureKey;
            this.cronTime = secrets.cronTime;
            this.fbAppId = secrets.fbAppId;
            this.fbAppSecret = secrets.fbAppSecret;
            this.isDebug = secrets.isDebug;
            this.sendInBlueKey = secrets.sendInBlueKey;
        } else {
            this.azureKey = process.env.FOODIE_AZURE_KEY;
            this.cronTime = process.env.FOODIE_CRON_TIME;
            this.fbAppId = process.env.FOODIE_FB_APP_ID;
            this.fbAppSecret = process.env.FOODIE_FB_APP_SECRET;
            this.isDebug = process.env.FOODIE_IS_DEBUG === 'true';
            this.sendInBlueKey = process.env.FOODIE_SEND_IN_BLUE_KEY;
        }

        if (this.isDebug) {
            this.cronTime = '* * * * *';
        }
    }

    public validate(): void {
        if (this.azureKey === undefined
            || this.cronTime === undefined
            || this.fbAppId === undefined
            || this.fbAppSecret === undefined
            || this.isDebug === undefined
            || this.sendInBlueKey === undefined) {
            throw new Error('Invalid config');
        }
    }
}