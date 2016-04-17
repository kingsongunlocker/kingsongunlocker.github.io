// method executed on submit
function execute() {
    // work on mac
    var macVal = element("mac").value.trim();
    if (isValidFormat(macVal)) {
        var isn = calculateIsn(macVal);
        element("isn").value = isn;
    } else {
        // nothing as isnVal could have been directly entered
    }
    // work on isn to get unlock code
    var isnVal = element("isn").value.trim();
    if (isValidFormat(isnVal))  {
        var unlock = calculateUnlock(isnVal);
        element("answer").value = unlock.toUpperCase();
    }
    // if this validation fails, we can't execute, so display error
    else {
        printError("Either Bluetooth MAC or ISN must be valid!");
        return;
    }
}

// helper to select an html element
function element(name) {
    return document.getElementById(name);
}

// helper function that checks validity of input
function isValidFormat(value) {
    if (value == undefined || value == "") {
        return false;
    }
    // regex which matches 5 groups of 'digit digit :' and one final 'digit digit'
    var reg = new RegExp("^([0-9]{2}:){5}([0-9]{2})$");
    return reg.test(value);
}

// given the mac will calculate the isn
function calculateIsn(mac) {
    // see: http://forum.electricunicycle.org/topic/2608-ks-isn-code-calculator-web-version/?do=findComment&comment=38925
    return mac.split(':').reverse().join(':');
}

// given the isn will calculate the unlock code
function calculateUnlock(isn) {
    var code = [];
    code[1] = 0;
    code[3] = 0;

    code[0] = 255 - parseInt(isn[0], 16);
    code[2] = 255 - parseInt(isn[2], 16);
    code[4] = 255 - parseInt(isn[4], 16);

    //Calculate checksum from other values
    code[5] = ((code[0] + code[1] + code[2] + code[3] + code[4]) & 0xFF);

    var codeVal = "";
    for(i = 0; i < 6; i++) {
        codeTemp = code[i].toString(16);
        if(codeTemp.length < 2) {
            codeTemp = "0" + codeTemp;
        }
        codeVal += codeTemp;
        if(i < 5) {
            codeVal += ":";
        }
    }
    return codeVal;
}

// unified error text
function printError(text) {
    // There was an error processing your ISN.
    element("answer").value = text;
}
