import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'StrongPassword', async: false })
export class StrongPassword implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;

    const errors: string[] = [];

    if (value.length < 8) errors.push('Password must be at least 8 characters long');
    if ((value.match(/[a-z]/g) || []).length < 2)
      errors.push('Password must contain at least 2 lowercase letters');
    if (!/[A-Z]/.test(value)) errors.push('Password must contain at least 1 uppercase letter');
    if (!/\d/.test(value)) errors.push('Password must contain at least 1 number');
    if (!/[@$!%*?&]/.test(value)) errors.push('Password must contain at least 1 special character');

    (this as any).errors = errors;
    return errors.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const errors: string[] = (this as any).errors || [];
    return errors.join('  &&  ');
  }
}
