import "reflect-metadata";
import { Methods } from "./Methods";
import { AppRouter } from "../AppRouter";
import { MetadataKeys } from "./MetadataKeys";
import Container from "typedi";

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();
    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );
      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      const instance: any = Container.get(target);
      const routeHandler = instance[key];

      if (path) {
        router[method](
          routePrefix + path,
          ...middlewares,
          routeHandler.bind(instance)
        );
      }
    });
  };
}
