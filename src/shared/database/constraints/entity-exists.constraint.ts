import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { isNil } from 'lodash';
import { DataSource, ObjectType, Repository } from 'typeorm';

interface Condition {
    entity: ObjectType<any>;

    field?: string;
}

@ValidatorConstraint({ name: 'entityItemExist', async: true })
@Injectable()
export class EntityExistConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        let repo: Repository<any>;

        if (!value) return true;

        let field = 'id';
        if ('entity' in args.constraints[0]) {
            field = args.constraints[0].field ?? 'id';
            repo = this.dataSource.getRepository(args.constraints[0].entity);
        } else {
            repo = this.dataSource.getRepository(args.constraints[0]);
        }

        const item = await repo.findOne({ where: { [field]: value } });
        return !isNil(item);
    }
    defaultMessage?(args?: ValidationArguments): string {
        if (!args.constraints[0]) return 'Model not been  specified';

        return `All instance of ${args.constraints[0].name ?? args.constraints[0].entity.name} must been exists in database`;
    }
}

function IsEntityExist(
    entity: ObjectType<any>,
    validationOptions?: ValidationOptions,
  ): (object: Record<string, any>, propertyName: string) => void
  
  function IsEntityExist(
    condition: { entity: ObjectType<any>, field?: string },
    validationOptions?: ValidationOptions,
  ): (object: Record<string, any>, propertyName: string) => void
  

function IsEntityExist(
    condition: Condition | ObjectType<any>,
    validationOptions?: ValidationOptions
) {
    return (object: Record<string, any>, propertyName: string) =>
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [condition],
            validator: EntityExistConstraint,
        });
}

export { IsEntityExist };
