import "reflect-metadata";
import { MetadataKeys } from "./MetadataKeys";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

function validatorFactory<T>(
  model: { new (...args: any[]): T },
  source: MetadataKeys.query | MetadataKeys.body | MetadataKeys.params
) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(source, model, target, key);

    const method = desc.value;
    desc.value = async function () {
      const model = Reflect.getMetadata(source, target, key);

      const [req, res] = arguments;
      const plain = req[source];

      const result = await validate(plainToInstance(model, plain), {
        validationError: { target: false },
      });

      if (result.length > 0) {
        return res.status(422).send(result);
      }

      return method.apply(this, arguments);
    };
  };
}

const bodyValidator = (dto) => validatorFactory(dto, MetadataKeys.body);
const queryValidator = (dto) => validatorFactory(dto, MetadataKeys.query);
const paramsValidator = (dto) => validatorFactory(dto, MetadataKeys.params);

export { queryValidator, paramsValidator, bodyValidator };
