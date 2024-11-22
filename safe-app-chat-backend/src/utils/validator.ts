import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword' })
class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string) {
        // Implement your strong password validation logic here
        // For example, you can check for a combination of uppercase, lowercase, numbers, and special characters
        const minimumLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /([?=.*!#$%&?@"-])/.test(password);

        return (
            minimumLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecialChar
        );
    }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsStrongPasswordConstraint,
        });
    };
}
