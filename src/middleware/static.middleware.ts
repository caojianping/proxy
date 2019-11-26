import {Context} from "koa";
import koaSend from "koa-send";
import {resolve} from "path";

export default (root: any, opts?: any) => {
	opts = Object.assign({}, opts || {});
	opts.root = resolve(root);

	opts.setHeaders = function (res: any, path: string, stats: any) {
		res.setHeader("Cache-Control", "private");
	};
	console.log("opts:", opts);
	if (opts.index !== false) {
		opts.index = opts.index || "index.html";
	}

	if (!opts.defer) {
		return async function (ctx: Context, next: Function) {
			let done: any = false;

			if (ctx.method === "HEAD" || ctx.method === "GET" || ctx.method === "POST") {
				try {
					done = await koaSend(ctx, ctx.path, opts);
				} catch (err) {
					if (err.status !== 404) {
						throw err;
					}
				}
			}

			if (!done) {
				await next();
			}
		}
	}

	return async (ctx: Context, next: Function) => {
		await next();

		if (ctx.method !== "HEAD" && ctx.method !== "GET" && ctx.method !== "POST") return;
		if (ctx.body != null || ctx.status !== 404) return;

		try {
			await koaSend(ctx, ctx.path, opts);
			await next();
		} catch (err) {
			if (err.status !== 404) {
				throw err;
			}
		}
	};
}