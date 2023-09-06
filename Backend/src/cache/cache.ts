import mongoose, { Model } from "mongoose";
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
  interface Aggregate<R> {
    cache(options: { key?: string; collection: Model<any> }): Aggregate<any>;
    useCache: boolean;
    hashKey: string;
    collection: Model<any>;
  }
}

mongoose.Query.prototype.cache = function (options: {
  key?: string;
  collection: Model<any>;
}) {
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

  redisClient.hSet(this.hashKey, key, JSON.stringify(result)).then(() => {
    redisClient.expire(this.hashKey, 90);
  });

  return result;
};

const aggreagateExec = mongoose.Aggregate.prototype.exec;

mongoose.Aggregate.prototype.cache = function (options: {
  key?: string;
  collection: Model<any>;
}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");
  this.collection = options.collection;

  return this;
};

mongoose.Aggregate.prototype.exec = async function () {
  if (!this.useCache) {
    return aggreagateExec.apply(this);
  }
  const key = JSON.stringify(
    Object.assign({}, this.pipeline(), {
      collection: this.collection,
    })
  );

  const cacheValue = await redisClient.hGet(this.hashKey, key);
  console.log("cachedValue", cacheValue);
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) ? doc.map((d) => d) : doc;
  }

  const result = await aggreagateExec.apply(this);

  redisClient.hSet(this.hashKey, key, JSON.stringify(result)).then(() => {
    redisClient.expire(this.hashKey, 90);
  });

  return result;
};

export { redisClient };
