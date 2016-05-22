// method executed on submit
function execute() {
    // define input
    var macVal = element("mac").value.trim();
    var isnVal = element("isn").value.trim();

    // clear error is both are empty
    if (!isSet(macVal) && !isSet(isnVal)) {
        printError("Please specify Bluetooth MAC or ISN!");
        return;
    }

    // if mac has been given use that over any given isn value
    if (isSet(macVal)) {
        console.log("MAC given");
        // in case of error make sure that mac is seen as error
        element("isn").value = "";
        // if not valid input, warn
        if (!isValidFormat(macVal)) {
            printError("Invalid Bluetooth MAC given!");
            return;
        }
        // format
        macVal = format(macVal);
        element("mac").value = macVal;
        // calculate isn value from mac
        isnVal = calculateIsn(macVal);
        element("isn").value = isnVal;
    }
    // isnVal is now set either from init OR calculateIsn
    if (isSet(isnVal)) {
        console.log("ISN given");
        if (!isValidFormat(isnVal)) {
            printError("Invalid ISN given!");
            return;
        }
        // calculate unlock code
        element("answer").value = calculateUnlock(isnVal);
    }
}

// ensures that all format is of 11:22:33:44:55:66 format.
function format(value) {
    // create isn array
    var splitValue = value.split(":");
    // this can happen if colon was left away
    if (splitValue.length == 1) {
        splitValue = [];
        for (i = 0; i < 6; i++) {
            splitValue[i] = value.slice(i*2, i*2+2);
        }
    }
    return splitValue.join(':');
}

// helper to select an html element
function element(name) {
    return document.getElementById(name);
}

// helper function that checks validity of input with regex
function isValidFormat(value) {
    // regex which matches mac / isn format with and without colon
    var reg = new RegExp("^(([0-9a-fA-F]{2})(:|)){5}([0-9a-fA-F]{2})$");
    return reg.test(value);
}

// helper function that checks that value has been set
function isSet(value) {
    return value != undefined && value != "";
}

// given the mac will calculate the isn
function calculateIsn(mac) {
    // see: http://forum.electricunicycle.org/topic/2608-ks-isn-code-calculator-web-version/?do=findComment&comment=38925
    return mac.split(':').reverse().join(':');
}

// given the isn will calculate the unlock code
function calculateUnlock(isnVal) {

    var isn = isnVal.split(':');
    // shouldn't happen, but... :P
    if(isn.length != 6) {
        return "Script error! Invalid paramter for calculateUnlock!";
    }

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
    return codeVal.toUpperCase();
}

// unified error text
function printError(text) {
    // There was an error processing your ISN.
    element("answer").value = text;
}
