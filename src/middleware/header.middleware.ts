import {Context} from "koa";

export default () => async (ctx: Context, next: Function) => {
    await next();
};
