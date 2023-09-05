import mongoose from "mongoose";
import { createClient } from "redis";
const keys = require("../config/keys");

const redisClient = createClient({
  url: `${keys.redisHOST}:${keys.redisPORT}`,
});

const exec = mongoose.Query.prototype.exec;

declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    cache(options: {
      key?: string;
    }): Query<ResultType, DocType, THelpers, RawDocType>;
    useCache: boolean;
    hashKey: string;
  }
}

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.model.collection.name,
    })
  );

  const cacheValue = await redisClient.hGet(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this);
  //lua로 작성하여 atomic하게 만들자.
  redisClient.hSet(this.hashKey, key, JSON.stringify(result));
  redisClient.expire(key, 9000);

  return result;
};

export { redisClient };
