import { plainToInstance } from "class-transformer";

interface ClassConstructor {
  new (...args: string[]): object;
}

abstract class Serializer {
  serializeItems(dto: ClassConstructor, data: object[]) {
    console.log(data.map((post) => post));
    return data.map((post) =>
      plainToInstance(dto, post, {
        excludeExtraneousValues: true,
      })
    );
  }

  serializeItem(dto: ClassConstructor, data: object) {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true,
    });
  }
}

export { Serializer };
