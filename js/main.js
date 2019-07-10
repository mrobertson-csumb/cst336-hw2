const common = require('./common.js');

/* listeners */
window.onload = _;

$('#submit_btn').click(() => {
    let selections = getInputs();
    let pass = generatePass(selections);
    updateOutput(...pass)
});


const getInputs = () => {
    return new common.UserSelections(true, true, true, true, [], 1, 2)
};

const generatePass = selections => {
    try {
        let generator = new common.PasswordGen(selections);
        return ['SUCCESS', generator.generate()]
    } catch (e) {
        return ['ERROR', e]
    }
};


const updateOutput = (status, message) => {
    $('#generated_pass').empty();
    $('#errors').empty();
    if (status === "ERROR") {
        console.log(status, message);
        $('#errors').append(errorAsSpan(message))
    } else {
        $('#generated_pass').append(passAsSpan(message))
    }
};

function errorAsSpan(message) {
    return `<span class="error">${message}</span>`;
}

function passAsSpan(message) {
    return `<span class="success">${message}</span>`;
}
