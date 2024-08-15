const fetch = require('node-fetch'),
    WebSocket = require('ws'),
    colors = require('colors'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
colors.setTheme({
    'x1': ['grey', 'bold'],
    'r': ['red', 'bold'],
    'ss': ['green', 'italic'],
    'v': ['red', 'bold']
});

class Sniper {
    constructor() {
        this.guilds = {};
        this.connectWebSocket();
        this.updateTitle();
    }

    connectWebSocket() {
        console.log;
        this.socket = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json&shard=0&shardcount=1&region=afg-east');
        this.socket.on('open', async () => {
            this.socket.send(JSON.stringify({
                'op': 0x2,
                'd': {
                    'token': config['yetkili_token'],
                    'intents': 0x201,
                    'properties': {
                        'os': 'IOS',
                        'browser': 'Safari',
                        'device': 'Night1966'
                    }
                }
            }));
        });

        this.socket.on('c', (_0x33b8ac, _0x44a026) => {
            console.log('Res.'['r']);
            setTimeout(() => {
                this.connectWebSocket();
            }, 0x64);
        });

        this.socket.on('message', async _0x7f33a5 => {
            const _0x47964d = JSON.parse(_0x7f33a5);
            if (_0x47964d.t === 'GUILD_UPDATE') this.handleGuildUpdate(_0x47964d['d']);
            else {
                if (_0x47964d.t === 'READY') this.handleReady(_0x47964d['d']);
                else {
                    if (_0x47964d.t === 'GUILD_CREATE') this.handleGuildCreate(_0x47964d['d']);
                    else _0x47964d.t === 'GUILD_DELETE' && this.handleGuildDelete(_0x47964d['d']);
                }
            }
        });

        this.socket.on('error', _0x3b0e27 => {
            console.error(_0x3b0e27);
            process.exit(0x1);
        });
    }

    handleGuildUpdate(_0x4b4222) {
        const _0x580478 = this.guilds[_0x4b4222['guild_id']];
        _0x580478?.['vanity_url_code'] && _0x580478['vanity_url_code'] !== _0x4b4222['vanity_url_code'] && this.snipeVanityURL(_0x580478['vanity_url_code'], _0x4b4222['guild_id']);
    }

    async snipeVanityURL(_0x1ffed1, _0x54e902, _0x25911b = Math.floor(Math.random() * 1 + 0x5)) {
        const startTime = Date.now();
        try {
            const _0x5a7303 = Math.random() * _0x25911b,
                [_0xaf264f] = await Promise.all([fetch('https://canary.discord.com/api/v10/guilds/' + config['sunucu_id'] + '/vanity-url', {
                    'method': 'PATCH',
                    'body': JSON.stringify({
                        'code': _0x1ffed1
                    }),
                    'headers': {
                        'Authorization': config['yetkili_token'],
                        'Content-Type': 'application/json'
                    }
                }), new Promise(_0x528012 => setTimeout(_0x528012, _0x5a7303))]),
                _0x3ae007 = Math.floor(Math.random() * -38 + 0x82);
            const elapsedSeconds = (Date.now() - startTime) / 1000;

            if (_0xaf264f.ok) {
                console.log(('discord.gg/${vanity} MS:{elapsedSeconds}. BAŞARILI.\nID ' + config['sunucu_id'] + '\n\nURL ' + _0x1ffed1 + '\n\n' + elapsedSeconds + 's + acc 0.' + _0x25911b)['ss']);
                const _0x1d6536 = {
                    'title': 'BAŞARILI',
                    'description': 'ID ' + config['sunucu_id'] + '\n\nURL ' + _0x1ffed1 + '\n\n' + elapsedSeconds + 's + acc 0.' + _0x25911b,
                    'color': 0xff00,
                    'thumbnail': {
                        'url': ''
                    },
                    'image': {
                        'url': ''
                    }
                };
                this.sendWebhookRequest(config['webhook'], _0x1d6536);
            } else {
                console.error('F4IL = ' + _0x1ffed1);
                const _0x1b797a = {
                    'title': 'F4IL',
                    'description': 'ID ' + config['sunucu_id'] + '\n\nURL ' + _0x1ffed1 + '\n\n' + _0xaf264f['status'],
                    'color': 0xff0000,
                    'thumbnail': {
                        'url': ''
                    }
                };
                this.sendWebhookRequest(config['webhook'], _0x1b797a);
            }
            delete this.guilds[_0x54e902];
        } catch (_0x5444ec) {
            console.error('Hata: Vanity URL snipe işlemi sırasında bir hata oluştu: ' + _0x1ffed1, _0x5444ec);
            delete this.guilds[_0x54e902];
        }
    }

    handleReady(_0x43b513) {
        _0x43b513['guilds']['filter'](_0x4d31b6 => typeof _0x4d31b6['vanity_url_code'] === 'string')['forEach'](_0x3f1f7f => {
            this.guilds[_0x3f1f7f['id']] = {
                'vanity_url_code': _0x3f1f7f['vanity_url_code'],
                'boostCount': _0x3f1f7f['premium_subscription_count']
            };
            this.printGuildInfo(_0x3f1f7f);
        });
        this.updateTitle();
        const _0x34fba1 = {
            'title': 'Allah Github Night',
            'description': '',
            'color': 0x3498db,
            'footer': {
                            },
            'thumbnail': {
                'url': ''
            },
            'author': {
                'name': 'Allah Github Night',
                'icon_url': '',
                'url': ''
            },
            'fields': [{
                'name': 'Allah Github Night',
                'value': '' + _0x43b513['guilds']['map'](_0x55933b => _0x55933b['vanity_url_code'])['join'](' '),
                'inline': true
            }, {
                'name': 'Sunucu ID',
                'value': '' + config['sunucu_id'],
                'inline': true
            }, {
                'name': 'C',
                'value': '' + config['c'],
                'inline': true
            }],
            'image': {
                'url': 'https://cdn.discordapp.com/banners/338801704239890432/cc220a76d93ef0108a6464a371427890.webp?size=1024&format=webp&width=0&height=256'
            }
        };
        this.sendWebhookRequest(config['webhook'], _0x34fba1);
    }

    handleGuildCreate(_0xc0937b) {
        this.guilds[_0xc0937b['id']] = {
            'vanity_url_code': _0xc0937b['vanity_url_code']
        };
        this.printGuildInfo(_0xc0937b);
        this.updateTitle();
    }

    handleGuildDelete(_0x221e6e) {
        const _0x58cc2d = this.guilds[_0x221e6e['id']];
        setTimeout(async () => {
            _0x58cc2d?.['vanity_url_code'] && this.snipeVanityURL(_0x58cc2d['vanity_url_code'], _0x221e6e['id']);
        }, 0x32);
    }

    updateTitle() {
        const _0x4bfabc = Object.keys(this.guilds).length;
        process.title = 'cmd - ' + _0x4bfabc + ' guilds';
    }

    printGuildInfo(_0x20b70e) {
        const _0x4d72ce = '>'['x1'] + 'Server Vanity '['v'] + ('' + _0x20b70e['vanity_url_code'])['x1'] + '| SUNUCU ID '['v'] + (' ' + config['sunucu_id'] + ' ')['x1'] + '| ISMI '['v'] + (' ' + _0x20b70e['name'] + ' ')['x1'] + '| BOOST '['v'] + (' ' + _0x20b70e['premium_subscription_count'] + ' ')['x1'];
        console.log(_0x4d72ce);
    }

    async sendWebhookRequest(_0x4a7d41, _0x5b94f3) {
        try {
            const _0x3264fe = await fetch(_0x4a7d41, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'embeds': [_0x5b94f3],
                })
            });
            if (!_0x3264fe.ok) {
                console.error('webhook error veriyor: ' + _0x3264fe['status']);
                const _0x41dfd5 = await _0x3264fe['text']();
                console.error('Response content: ' + _0x41dfd5);
            }
        } catch (_0x422ca2) {
            console.error('webhook hatalı :', _0x422ca2);
        }
    }
}

const sniper = new Sniper();
