import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
@Injectable()
export class EndDateValidator implements ValidatorConstraintInterface {
    validate(value: Date, validationArguments: ValidationArguments) {
        const startDate = new Date(validationArguments.object[validationArguments.constraints[0]]);
        const endDate = new Date(value);

        return endDate > startDate
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `End Date must be greater than ${validationArguments.constraints[0]}`
    }
}