const hasNumber = (string) => (string.search(/\d/) !== -1);

// BEGIN (write your solution here)
class PasswordValidator {
    constructor(config = {}) {
        this.config = {
            minLength: 8,
            containNumbers: true,
            ...config
        };
    }

    validate(password) {
        const result = {};

        if (password.length < this.config.minLength) {
            result.minLength = 'too small';
        }

        if (this.config.containNumbers && !/\d/.test(password)) {
            result.containNumbers = 'should contain at least one number';
        }

        return result;
    }
}

export default PasswordValidator;
// END