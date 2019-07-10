
const ALPHA_LOWER = [...'abcdefghijklmnopqrstuvwxyz'];
const ALPHA_UPPER = [...'abcdefghijklmnopqrstuvwxyz'.toUpperCase()];

// characters from: https://www.owasp.org/index.php/Password_special_characters
const SPECIAL = [...'\'\\!"#$%&()*+,-./:;<=>?@[]^_`{|}~']; // space character not included
const NUMBERS = [...'0123456789'];


class PasswordGen {
    constructor(userSelections) {
        this.useChars = [];
        if (userSelections.useLowers) {
            this.useChars.push(...ALPHA_LOWER)
        }

        if (userSelections.useUppers) {
            this.useChars.push(...ALPHA_UPPER)
        }

        if (userSelections.useNumbers) {
            this.useChars.push(...NUMBERS)
        }

        if (userSelections.useSpecials) {
            this.useChars.push(...SPECIAL)
        }

        if (userSelections.inputChars.length !== 0) {
            this.useChars.push(...userSelections.inputChars)
        }

        this.lenMin = userSelections.lenMin;
        this.lenMax = userSelections.lenMax;
    }

    static randBetween(min, max) {
        if (min === max) {
            return min;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    generate() {
        let len = PasswordGen.randBetween(this.lenMin, this.lenMax);
        let password = [];
        while (password.length < len) {
            // randomly choose a character position
            let pos = PasswordGen.randBetween(0, this.useChars.length);
            password.push(this.useChars[pos])
        }
        return password.join('');
    };
}

class UserSelections {
    constructor(useLowers, useUppers, useNumbers, useSpecials, inputChars, lenMin, lenMax) {
        if (lenMin <= 0) {
            throw "A password must be longer than 1 character."
        }

        if (lenMax < lenMin) {
            [lenMin, lenMax] = [lenMax, lenMin] // swap them
        }

        this.useLowers = useLowers;
        this.useUppers = useUppers;
        this.useNumbers = useNumbers;
        this.useSpecials = useSpecials;
        this.inputChars = inputChars;
        this.lenMin = lenMin;
        this.lenMax = lenMax;
    };
}

module.exports = {
    PasswordGen: PasswordGen,
    UserSelections: UserSelections,
    ALPHA_LOWER: ALPHA_LOWER,
    ALPHA_UPPER: ALPHA_UPPER,
    SPECIAL: SPECIAL,
    NUMBERS: NUMBERS,
};
