import Koa from 'koa';
import koaConvert from 'koa-convert';
import koaCors from 'koa-cors';
import koaConnect from 'koa2-connect';
import httpProxyMiddleware from 'http-proxy-middleware';
import config from 'config';
import path from 'path';
import { headerMiddleware, staticMiddleware } from './middleware';

const app = new Koa();
app.use(koaConvert(koaCors()));
app.use(headerMiddleware());
app.use(staticMiddleware(path.join(__dirname, '../', config.get<string>('staticPath'))));

const proxyConnect = function (key: string, options: any) {
    return async function (ctx, next) {
        await koaConnect(httpProxyMiddleware(key, options))(ctx, next);
    };
};

const apis = config.get<any>('apis') || {};
const keys = Object.keys(apis) || [];
keys.forEach((key: string) => {
    let value = apis[key] || {},
        options = Object.assign({}, value);
    if (!options['changeOrigin']) {
        options['changeOrigin'] = true;
    }
    console.log('[proxy] key,options:', key, options);
    app.use(proxyConnect(key, options));
});

const port = config.get<number>('port') || 80;
app.listen(port, function () {
    console.log('Server start at ' + port + ' port!');
});

app.on('error', function (err: any) {
    console.error('[proxy] error:', err);
});
