import * as request from 'request-promise-native';

export class Mailer {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    public sendTestEmail(): request.RequestPromise {
        const requestOptions: request.Options = {
            body: {
                sender: { email: 'nope@nope.pl' },
                replyTo: { email: 'fistasheq+sendinblue@gmail.com' },
                subject: 'Foodie test',
                to: [{ email: 'fistasheq+sendinblue@gmail.com', name: 'ja' }],
                htmlContent: '<b>Hello!</b>'
            },
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.key
            },
            json: true,
            url: 'https://api.sendinblue.com/v3/smtp/email'
        };

        return request.post(requestOptions);
    }
}