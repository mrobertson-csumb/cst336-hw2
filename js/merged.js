/* === common functions ==================================================== */
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

        // console.log(`len: ${len}, pw.len: ${password.length}, pw: ${password}`);
        return password.join('');
    };
}

class UserSelections {
    constructor(useLowers, useUppers, useNumbers, useSpecials, inputChars, lenMin, lenMax) {
        if (isNaN(lenMin)) {
            throw `Sorry, '${lenMin}' is not a valid number of characters.`
        }

        // not less than zero
        if (lenMin <= 0) {
            throw "A password must be longer than 1 character."
        }


        // omitted max mean use min
        if (isNaN(lenMax) || lenMax === undefined) {
            lenMax = lenMin
        }

        // min must be less than max
        if (lenMax < lenMin) {
            [lenMin, lenMax] = [lenMax, lenMin] // swap them
        }


        // invalid without any character set
        if (inputChars.length === 0 && !useLowers && !useUppers && !useNumbers && !useSpecials) {
            throw "No character sets were selected for generating the password."
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

/* === site functions ====================================================== */
/* listeners */

$('#submit_btn').click(() => {
    let selections = getInputs();
    let pass = generatePass(selections);
    updateOutput(...pass)

});

// todo use double-ended slider
// todo add copy to clipboard
// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery

/* funcs */

let getInputs = () => {
    return [
        $('#use_chars_lower').is(":checked"),
        $('#use_chars_upper').is(":checked"),
        $('#use_chars_num').is(":checked"),
        $('#use_chars_special').is(":checked"),
        [...$('#input_chars').val()],
        $('#input_num').val(),
        $('#input_num').val()
    ]
};

let generatePass = selections => {
    try {
        let inputs = getInputs();
        selections = new UserSelections(...inputs);
        let generator = new PasswordGen(selections);
        return ['SUCCESS', generator.generate()]
    } catch (e) {
        return ['ERROR', e]
    }
};


let updateOutput = (status, message) => {
    $('#errors, #generated_pass').empty();
    if (status === "ERROR") {
        $('#errors').append(errorAsSpan(message))
    } else {
        $('#generated_pass').append(passAsSpan(message))
    }
};

function errorAsSpan(message) {
    message = escapeHTML(message);
    return `<span class="alert alert-danger text-monospace">ERROR: ${message}</span>`;
}

function passAsSpan(message) {
    message = escapeHTML(message);
    return `<strong class="alert alert-dark">Your New Password:</strong><span class="alert alert-success text-monospace">${message}</span>`;
}

function escapeHTML(toEscape) {
    return toEscape.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}