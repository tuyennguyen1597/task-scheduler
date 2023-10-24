import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  
  @ValidatorConstraint({ name: 'IsStartDateValid', async: false })
  @Injectable()
  export class StartDateValidator implements ValidatorConstraintInterface {
    validate(value: Date, validationArguments: ValidationArguments) {
      const startDate = new Date(value);
      let endDate = null;
      if (validationArguments.object[validationArguments.constraints[0]]) {
        endDate = new Date(validationArguments.object[validationArguments.constraints[0]]);
      }
    
      const currentDate = new Date();
      // Check if the startDate is greater than or equal to the current date
      // and if the endDate is greater than the startDate
      return endDate ? startDate >= currentDate && endDate > startDate : startDate >= currentDate;
    }
  
    defaultMessage(validationArguments: ValidationArguments) {
      return `Start Date must be greater than or equal to the current date, and End Date must be greater than Start Date`;
    }
  }
  