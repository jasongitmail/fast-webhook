/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 7943:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var rawAsap = __nccwpck_require__(3691);
var freeTasks = [];

/**
 * Calls a task as soon as possible after returning, in its own event, with
 * priority over IO events. An exception thrown in a task can be handled by
 * `process.on("uncaughtException") or `domain.on("error")`, but will otherwise
 * crash the process. If the error is handled, all subsequent tasks will
 * resume.
 *
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawTask.domain = process.domain;
    rawAsap(rawTask);
}

function RawTask() {
    this.task = null;
    this.domain = null;
}

RawTask.prototype.call = function () {
    if (this.domain) {
        this.domain.enter();
    }
    var threw = true;
    try {
        this.task.call();
        threw = false;
        // If the task throws an exception (presumably) Node.js restores the
        // domain stack for the next event.
        if (this.domain) {
            this.domain.exit();
        }
    } finally {
        // We use try/finally and a threw flag to avoid messing up stack traces
        // when we catch and release errors.
        if (threw) {
            // In Node.js, uncaught exceptions are considered fatal errors.
            // Re-throw them to interrupt flushing!
            // Ensure that flushing continues if an uncaught exception is
            // suppressed listening process.on("uncaughtException") or
            // domain.on("error").
            rawAsap.requestFlush();
        }
        // If the task threw an error, we do not want to exit the domain here.
        // Exiting the domain would prevent the domain from catching the error.
        this.task = null;
        this.domain = null;
        freeTasks.push(this);
    }
};



/***/ }),

/***/ 3691:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var domain; // The domain module is executed on demand
var hasSetImmediate = typeof setImmediate === "function";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including network IO events in Node.js.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Avoids a function call
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory excaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

rawAsap.requestFlush = requestFlush;
function requestFlush() {
    // Ensure flushing is not bound to any domain.
    // It is not sufficient to exit the domain, because domains exist on a stack.
    // To execute code outside of any domain, the following dance is necessary.
    var parentDomain = process.domain;
    if (parentDomain) {
        if (!domain) {
            // Lazy execute the domain module.
            // Only employed if the user elects to use domains.
            domain = __nccwpck_require__(3639);
        }
        domain.active = process.domain = null;
    }

    // `setImmediate` is slower that `process.nextTick`, but `process.nextTick`
    // cannot handle recursion.
    // `requestFlush` will only be called recursively from `asap.js`, to resume
    // flushing after an error is thrown into a domain.
    // Conveniently, `setImmediate` was introduced in the same version
    // `process.nextTick` started throwing recursion errors.
    if (flushing && hasSetImmediate) {
        setImmediate(flush);
    } else {
        process.nextTick(flush);
    }

    if (parentDomain) {
        domain.active = process.domain = parentDomain;
    }
}


/***/ }),

/***/ 4812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports =
{
  parallel      : __nccwpck_require__(8210),
  serial        : __nccwpck_require__(445),
  serialOrdered : __nccwpck_require__(3578)
};


/***/ }),

/***/ 1700:
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),

/***/ 2794:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var defer = __nccwpck_require__(5295);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),

/***/ 5295:
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),

/***/ 9023:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var async = __nccwpck_require__(2794)
  , abort = __nccwpck_require__(1700)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),

/***/ 2474:
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),

/***/ 7942:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var abort = __nccwpck_require__(1700)
  , async = __nccwpck_require__(2794)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),

/***/ 445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var serialOrdered = __nccwpck_require__(3578);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 3578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),

/***/ 8803:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var GetIntrinsic = __nccwpck_require__(4538);

var callBind = __nccwpck_require__(2977);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 2977:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(8334);
var GetIntrinsic = __nccwpck_require__(4538);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 5443:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(3837);
var Stream = (__nccwpck_require__(2781).Stream);
var DelayedStream = __nccwpck_require__(8611);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),

/***/ 5507:
/***/ ((__unused_webpack_module, exports) => {

/* jshint node: true */
(function () {
    "use strict";

    function CookieAccessInfo(domain, path, secure, script) {
        if (this instanceof CookieAccessInfo) {
            this.domain = domain || undefined;
            this.path = path || "/";
            this.secure = !!secure;
            this.script = !!script;
            return this;
        }
        return new CookieAccessInfo(domain, path, secure, script);
    }
    CookieAccessInfo.All = Object.freeze(Object.create(null));
    exports.CookieAccessInfo = CookieAccessInfo;

    function Cookie(cookiestr, request_domain, request_path) {
        if (cookiestr instanceof Cookie) {
            return cookiestr;
        }
        if (this instanceof Cookie) {
            this.name = null;
            this.value = null;
            this.expiration_date = Infinity;
            this.path = String(request_path || "/");
            this.explicit_path = false;
            this.domain = request_domain || null;
            this.explicit_domain = false;
            this.secure = false; //how to define default?
            this.noscript = false; //httponly
            if (cookiestr) {
                this.parse(cookiestr, request_domain, request_path);
            }
            return this;
        }
        return new Cookie(cookiestr, request_domain, request_path);
    }
    exports.Cookie = Cookie;

    Cookie.prototype.toString = function toString() {
        var str = [this.name + "=" + this.value];
        if (this.expiration_date !== Infinity) {
            str.push("expires=" + (new Date(this.expiration_date)).toGMTString());
        }
        if (this.domain) {
            str.push("domain=" + this.domain);
        }
        if (this.path) {
            str.push("path=" + this.path);
        }
        if (this.secure) {
            str.push("secure");
        }
        if (this.noscript) {
            str.push("httponly");
        }
        return str.join("; ");
    };

    Cookie.prototype.toValueString = function toValueString() {
        return this.name + "=" + this.value;
    };

    var cookie_str_splitter = /[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g;
    Cookie.prototype.parse = function parse(str, request_domain, request_path) {
        if (this instanceof Cookie) {
            if ( str.length > 32768 ) {
                console.warn("Cookie too long for parsing (>32768 characters)");
                return;
            }
    
            var parts = str.split(";").filter(function (value) {
                    return !!value;
                });
            var i;

            var pair = parts[0].match(/([^=]+)=([\s\S]*)/);
            if (!pair) {
                console.warn("Invalid cookie header encountered. Header: '"+str+"'");
                return;
            }

            var key = pair[1];
            var value = pair[2];
            if ( typeof key !== 'string' || key.length === 0 || typeof value !== 'string' ) {
                console.warn("Unable to extract values from cookie header. Cookie: '"+str+"'");
                return;
            }

            this.name = key;
            this.value = value;

            for (i = 1; i < parts.length; i += 1) {
                pair = parts[i].match(/([^=]+)(?:=([\s\S]*))?/);
                key = pair[1].trim().toLowerCase();
                value = pair[2];
                switch (key) {
                case "httponly":
                    this.noscript = true;
                    break;
                case "expires":
                    this.expiration_date = value ?
                            Number(Date.parse(value)) :
                            Infinity;
                    break;
                case "path":
                    this.path = value ?
                            value.trim() :
                            "";
                    this.explicit_path = true;
                    break;
                case "domain":
                    this.domain = value ?
                            value.trim() :
                            "";
                    this.explicit_domain = !!this.domain;
                    break;
                case "secure":
                    this.secure = true;
                    break;
                }
            }

            if (!this.explicit_path) {
               this.path = request_path || "/";
            }
            if (!this.explicit_domain) {
               this.domain = request_domain;
            }

            return this;
        }
        return new Cookie().parse(str, request_domain, request_path);
    };

    Cookie.prototype.matches = function matches(access_info) {
        if (access_info === CookieAccessInfo.All) {
          return true;
        }
        if (this.noscript && access_info.script ||
                this.secure && !access_info.secure ||
                !this.collidesWith(access_info)) {
            return false;
        }
        return true;
    };

    Cookie.prototype.collidesWith = function collidesWith(access_info) {
        if ((this.path && !access_info.path) || (this.domain && !access_info.domain)) {
            return false;
        }
        if (this.path && access_info.path.indexOf(this.path) !== 0) {
            return false;
        }
        if (this.explicit_path && access_info.path.indexOf( this.path ) !== 0) {
           return false;
        }
        var access_domain = access_info.domain && access_info.domain.replace(/^[\.]/,'');
        var cookie_domain = this.domain && this.domain.replace(/^[\.]/,'');
        if (cookie_domain === access_domain) {
            return true;
        }
        if (cookie_domain) {
            if (!this.explicit_domain) {
                return false; // we already checked if the domains were exactly the same
            }
            var wildcard = access_domain.indexOf(cookie_domain);
            if (wildcard === -1 || wildcard !== access_domain.length - cookie_domain.length) {
                return false;
            }
            return true;
        }
        return true;
    };

    function CookieJar() {
        var cookies, cookies_list, collidable_cookie;
        if (this instanceof CookieJar) {
            cookies = Object.create(null); //name: [Cookie]

            this.setCookie = function setCookie(cookie, request_domain, request_path) {
                var remove, i;
                cookie = new Cookie(cookie, request_domain, request_path);
                //Delete the cookie if the set is past the current time
                remove = cookie.expiration_date <= Date.now();
                if (cookies[cookie.name] !== undefined) {
                    cookies_list = cookies[cookie.name];
                    for (i = 0; i < cookies_list.length; i += 1) {
                        collidable_cookie = cookies_list[i];
                        if (collidable_cookie.collidesWith(cookie)) {
                            if (remove) {
                                cookies_list.splice(i, 1);
                                if (cookies_list.length === 0) {
                                    delete cookies[cookie.name];
                                }
                                return false;
                            }
                            cookies_list[i] = cookie;
                            return cookie;
                        }
                    }
                    if (remove) {
                        return false;
                    }
                    cookies_list.push(cookie);
                    return cookie;
                }
                if (remove) {
                    return false;
                }
                cookies[cookie.name] = [cookie];
                return cookies[cookie.name];
            };
            //returns a cookie
            this.getCookie = function getCookie(cookie_name, access_info) {
                var cookie, i;
                cookies_list = cookies[cookie_name];
                if (!cookies_list) {
                    return;
                }
                for (i = 0; i < cookies_list.length; i += 1) {
                    cookie = cookies_list[i];
                    if (cookie.expiration_date <= Date.now()) {
                        if (cookies_list.length === 0) {
                            delete cookies[cookie.name];
                        }
                        continue;
                    }

                    if (cookie.matches(access_info)) {
                        return cookie;
                    }
                }
            };
            //returns a list of cookies
            this.getCookies = function getCookies(access_info) {
                var matches = [], cookie_name, cookie;
                for (cookie_name in cookies) {
                    cookie = this.getCookie(cookie_name, access_info);
                    if (cookie) {
                        matches.push(cookie);
                    }
                }
                matches.toString = function toString() {
                    return matches.join(":");
                };
                matches.toValueString = function toValueString() {
                    return matches.map(function (c) {
                        return c.toValueString();
                    }).join('; ');
                };
                return matches;
            };

            return this;
        }
        return new CookieJar();
    }
    exports.CookieJar = CookieJar;

    //returns list of cookies that were set correctly. Cookies that are expired and removed are not returned.
    CookieJar.prototype.setCookies = function setCookies(cookies, request_domain, request_path) {
        cookies = Array.isArray(cookies) ?
                cookies :
                cookies.split(cookie_str_splitter);
        var successful = [],
            i,
            cookie;
        cookies = cookies.map(function(item){
            return new Cookie(item, request_domain, request_path);
        });
        for (i = 0; i < cookies.length; i += 1) {
            cookie = cookies[i];
            if (this.setCookie(cookie, request_domain, request_path)) {
                successful.push(cookie);
            }
        }
        return successful;
    };
}());


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(900);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(4874);
}


/***/ }),

/***/ 4874:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(6224);
const util = __nccwpck_require__(3837);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(132);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 8611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = (__nccwpck_require__(2781).Stream);
var util = __nccwpck_require__(3837);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),

/***/ 4308:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(dezalgo)

var asap = __nccwpck_require__(7943)

function dezalgo (cb) {
  var sync = true
  asap(function () {
    sync = false
  })

  return function zalgoSafe() {
    var args = arguments
    var me = this
    if (sync)
      asap(function() {
        cb.apply(me, args)
      })
    else
      cb.apply(me, args)
  }
}


/***/ }),

/***/ 7676:
/***/ ((module) => {

module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}


/***/ }),

/***/ 1826:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var CombinedStream = __nccwpck_require__(5443);
var util = __nccwpck_require__(3837);
var path = __nccwpck_require__(1017);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var parseUrl = (__nccwpck_require__(7310).parse);
var fs = __nccwpck_require__(7147);
var Stream = (__nccwpck_require__(2781).Stream);
var mime = __nccwpck_require__(3583);
var asynckit = __nccwpck_require__(4812);
var populate = __nccwpck_require__(7142);

// Public API
module.exports = FormData;

// make it a Stream
util.inherits(FormData, CombinedStream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition
    ;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc( 0 );
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {

      // Add content to the buffer.
      if(Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
      }else {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData.LINE_BREAK)] );
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
};

FormData.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'}
    ;

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce);
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};


/***/ }),

/***/ 7142:
/***/ ((module) => {

// populates missing values
module.exports = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};


/***/ }),

/***/ 6952:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

function __ncc_wildcard$0 (arg) {
  if (arg === "index") return __nccwpck_require__(3300);
  else if (arg === "json") return __nccwpck_require__(9378);
  else if (arg === "multipart") return __nccwpck_require__(7964);
  else if (arg === "octetstream") return __nccwpck_require__(6197);
  else if (arg === "querystring") return __nccwpck_require__(2210);
}
'use strict';

const os = __nccwpck_require__(2037);
const path = __nccwpck_require__(1017);
const hexoid = __nccwpck_require__(7108);
const once = __nccwpck_require__(1223);
const dezalgo = __nccwpck_require__(4308);
const { EventEmitter } = __nccwpck_require__(2361);
const { StringDecoder } = __nccwpck_require__(1576);
const qs = __nccwpck_require__(2760);

const toHexoId = hexoid(25);
const DEFAULT_OPTIONS = {
  maxFields: 1000,
  maxFieldsSize: 20 * 1024 * 1024,
  maxFileSize: 200 * 1024 * 1024,
  minFileSize: 1,
  allowEmptyFiles: true,
  keepExtensions: false,
  encoding: 'utf-8',
  hashAlgorithm: false,
  uploadDir: os.tmpdir(),
  multiples: false,
  enabledPlugins: ['octetstream', 'querystring', 'multipart', 'json'],
  fileWriteStreamHandler: null,
  defaultInvalidName: 'invalid-name',
  filter: function () {
    return true;
  },
};

const PersistentFile = __nccwpck_require__(6580);
const VolatileFile = __nccwpck_require__(2908);
const DummyParser = __nccwpck_require__(4335);
const MultipartParser = __nccwpck_require__(5139);
const errors = __nccwpck_require__(3808);

const { FormidableError } = errors;

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

class IncomingForm extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = { ...DEFAULT_OPTIONS, ...options };

    const dir = path.resolve(
      this.options.uploadDir || this.options.uploaddir || os.tmpdir(),
    );

    this.uploaddir = dir;
    this.uploadDir = dir;

    // initialize with null
    [
      'error',
      'headers',
      'type',
      'bytesExpected',
      'bytesReceived',
      '_parser',
    ].forEach((key) => {
      this[key] = null;
    });

    this._setUpRename();

    this._flushing = 0;
    this._fieldsSize = 0;
    this._fileSize = 0;
    this._plugins = [];
    this.openedFiles = [];

    this.options.enabledPlugins = []
      .concat(this.options.enabledPlugins)
      .filter(Boolean);

    if (this.options.enabledPlugins.length === 0) {
      throw new FormidableError(
        'expect at least 1 enabled builtin plugin, see options.enabledPlugins',
        errors.missingPlugin,
      );
    }

    this.options.enabledPlugins.forEach((pluginName) => {
      const plgName = pluginName.toLowerCase();
      // eslint-disable-next-line import/no-dynamic-require, global-require
      this.use(__ncc_wildcard$0(plgName));
    });

    this._setUpMaxFields();
  }

  use(plugin) {
    if (typeof plugin !== 'function') {
      throw new FormidableError(
        '.use: expect `plugin` to be a function',
        errors.pluginFunction,
      );
    }
    this._plugins.push(plugin.bind(this));
    return this;
  }

  parse(req, cb) {
    this.pause = () => {
      try {
        req.pause();
      } catch (err) {
        // the stream was destroyed
        if (!this.ended) {
          // before it was completed, crash & burn
          this._error(err);
        }
        return false;
      }
      return true;
    };

    this.resume = () => {
      try {
        req.resume();
      } catch (err) {
        // the stream was destroyed
        if (!this.ended) {
          // before it was completed, crash & burn
          this._error(err);
        }
        return false;
      }

      return true;
    };

    // Setup callback first, so we don't miss anything from data events emitted immediately.
    if (cb) {
      const callback = once(dezalgo(cb));
      const fields = {};
      let mockFields = '';
      const files = {};

      this.on('field', (name, value) => {
        if (
          this.options.multiples &&
          (this.type === 'multipart' || this.type === 'urlencoded')
        ) {
          const mObj = { [name]: value };
          mockFields = mockFields
            ? `${mockFields}&${qs.stringify(mObj)}`
            : `${qs.stringify(mObj)}`;
        } else {
          fields[name] = value;
        }
      });
      this.on('file', (name, file) => {
        // TODO: too much nesting
        if (this.options.multiples) {
          if (hasOwnProp(files, name)) {
            if (!Array.isArray(files[name])) {
              files[name] = [files[name]];
            }
            files[name].push(file);
          } else {
            files[name] = file;
          }
        } else {
          files[name] = file;
        }
      });
      this.on('error', (err) => {
        callback(err, fields, files);
      });
      this.on('end', () => {
        if (this.options.multiples) {
          Object.assign(fields, qs.parse(mockFields));
        }
        callback(null, fields, files);
      });
    }

    // Parse headers and setup the parser, ready to start listening for data.
    this.writeHeaders(req.headers);

    // Start listening for data.
    req
      .on('error', (err) => {
        this._error(err);
      })
      .on('aborted', () => {
        this.emit('aborted');
        this._error(new FormidableError('Request aborted', errors.aborted));
      })
      .on('data', (buffer) => {
        try {
          this.write(buffer);
        } catch (err) {
          this._error(err);
        }
      })
      .on('end', () => {
        if (this.error) {
          return;
        }
        if (this._parser) {
          this._parser.end();
        }
        this._maybeEnd();
      });

    return this;
  }

  writeHeaders(headers) {
    this.headers = headers;
    this._parseContentLength();
    this._parseContentType();

    if (!this._parser) {
      this._error(
        new FormidableError(
          'no parser found',
          errors.noParser,
          415, // Unsupported Media Type
        ),
      );
      return;
    }

    this._parser.once('error', (error) => {
      this._error(error);
    });
  }

  write(buffer) {
    if (this.error) {
      return null;
    }
    if (!this._parser) {
      this._error(
        new FormidableError('uninitialized parser', errors.uninitializedParser),
      );
      return null;
    }

    this.bytesReceived += buffer.length;
    this.emit('progress', this.bytesReceived, this.bytesExpected);

    this._parser.write(buffer);

    return this.bytesReceived;
  }

  pause() {
    // this does nothing, unless overwritten in IncomingForm.parse
    return false;
  }

  resume() {
    // this does nothing, unless overwritten in IncomingForm.parse
    return false;
  }

  onPart(part) {
    // this method can be overwritten by the user
    this._handlePart(part);
  }

  _handlePart(part) {
    if (part.originalFilename && typeof part.originalFilename !== 'string') {
      this._error(
        new FormidableError(
          `the part.originalFilename should be string when it exists`,
          errors.filenameNotString,
        ),
      );
      return;
    }

    // This MUST check exactly for undefined. You can not change it to !part.originalFilename.

    // todo: uncomment when switch tests to Jest
    // console.log(part);

    // ? NOTE(@tunnckocore): no it can be any falsey value, it most probably depends on what's returned
    // from somewhere else. Where recently I changed the return statements
    // and such thing because code style
    // ? NOTE(@tunnckocore): or even better, if there is no mimetype, then it's for sure a field
    // ? NOTE(@tunnckocore): originalFilename is an empty string when a field?
    if (!part.mimetype) {
      let value = '';
      const decoder = new StringDecoder(
        part.transferEncoding || this.options.encoding,
      );

      part.on('data', (buffer) => {
        this._fieldsSize += buffer.length;
        if (this._fieldsSize > this.options.maxFieldsSize) {
          this._error(
            new FormidableError(
              `options.maxFieldsSize (${this.options.maxFieldsSize} bytes) exceeded, received ${this._fieldsSize} bytes of field data`,
              errors.maxFieldsSizeExceeded,
              413, // Payload Too Large
            ),
          );
          return;
        }
        value += decoder.write(buffer);
      });

      part.on('end', () => {
        this.emit('field', part.name, value);
      });
      return;
    }

    if (!this.options.filter(part)) {
      return;
    }

    this._flushing += 1;

    const newFilename = this._getNewName(part);
    const filepath = this._joinDirectoryName(newFilename);
    const file = this._newFile({
      newFilename,
      filepath,
      originalFilename: part.originalFilename,
      mimetype: part.mimetype,
    });
    file.on('error', (err) => {
      this._error(err);
    });
    this.emit('fileBegin', part.name, file);

    file.open();
    this.openedFiles.push(file);

    part.on('data', (buffer) => {
      this._fileSize += buffer.length;
      if (this._fileSize < this.options.minFileSize) {
        this._error(
          new FormidableError(
            `options.minFileSize (${this.options.minFileSize} bytes) inferior, received ${this._fileSize} bytes of file data`,
            errors.smallerThanMinFileSize,
            400,
          ),
        );
        return;
      }
      if (this._fileSize > this.options.maxFileSize) {
        this._error(
          new FormidableError(
            `options.maxFileSize (${this.options.maxFileSize} bytes) exceeded, received ${this._fileSize} bytes of file data`,
            errors.biggerThanMaxFileSize,
            413,
          ),
        );
        return;
      }
      if (buffer.length === 0) {
        return;
      }
      this.pause();
      file.write(buffer, () => {
        this.resume();
      });
    });

    part.on('end', () => {
      if (!this.options.allowEmptyFiles && this._fileSize === 0) {
        this._error(
          new FormidableError(
            `options.allowEmptyFiles is false, file size should be greather than 0`,
            errors.noEmptyFiles,
            400,
          ),
        );
        return;
      }

      file.end(() => {
        this._flushing -= 1;
        this.emit('file', part.name, file);
        this._maybeEnd();
      });
    });
  }

  // eslint-disable-next-line max-statements
  _parseContentType() {
    if (this.bytesExpected === 0) {
      this._parser = new DummyParser(this, this.options);
      return;
    }

    if (!this.headers['content-type']) {
      this._error(
        new FormidableError(
          'bad content-type header, no content-type',
          errors.missingContentType,
          400,
        ),
      );
      return;
    }

    const results = [];
    const _dummyParser = new DummyParser(this, this.options);

    // eslint-disable-next-line no-plusplus
    for (let idx = 0; idx < this._plugins.length; idx++) {
      const plugin = this._plugins[idx];

      let pluginReturn = null;

      try {
        pluginReturn = plugin(this, this.options) || this;
      } catch (err) {
        // directly throw from the `form.parse` method;
        // there is no other better way, except a handle through options
        const error = new FormidableError(
          `plugin on index ${idx} failed with: ${err.message}`,
          errors.pluginFailed,
          500,
        );
        error.idx = idx;
        throw error;
      }

      Object.assign(this, pluginReturn);

      // todo: use Set/Map and pass plugin name instead of the `idx` index
      this.emit('plugin', idx, pluginReturn);
      results.push(pluginReturn);
    }

    this.emit('pluginsResults', results);

    // NOTE: probably not needed, because we check options.enabledPlugins in the constructor
    // if (results.length === 0 /* && results.length !== this._plugins.length */) {
    //   this._error(
    //     new Error(
    //       `bad content-type header, unknown content-type: ${this.headers['content-type']}`,
    //     ),
    //   );
    // }
  }

  _error(err, eventName = 'error') {
    // if (!err && this.error) {
    //   this.emit('error', this.error);
    //   return;
    // }
    if (this.error || this.ended) {
      return;
    }

    this.error = err;
    this.emit(eventName, err);

    if (Array.isArray(this.openedFiles)) {
      this.openedFiles.forEach((file) => {
        file.destroy();
      });
    }
  }

  _parseContentLength() {
    this.bytesReceived = 0;
    if (this.headers['content-length']) {
      this.bytesExpected = parseInt(this.headers['content-length'], 10);
    } else if (this.headers['transfer-encoding'] === undefined) {
      this.bytesExpected = 0;
    }

    if (this.bytesExpected !== null) {
      this.emit('progress', this.bytesReceived, this.bytesExpected);
    }
  }

  _newParser() {
    return new MultipartParser(this.options);
  }

  _newFile({ filepath, originalFilename, mimetype, newFilename }) {
    return this.options.fileWriteStreamHandler
      ? new VolatileFile({
          newFilename,
          filepath,
          originalFilename,
          mimetype,
          createFileWriteStream: this.options.fileWriteStreamHandler,
          hashAlgorithm: this.options.hashAlgorithm,
        })
      : new PersistentFile({
          newFilename,
          filepath,
          originalFilename,
          mimetype,
          hashAlgorithm: this.options.hashAlgorithm,
        });
  }

  _getFileName(headerValue) {
    // matches either a quoted-string or a token (RFC 2616 section 19.5.1)
    const m = headerValue.match(
      /\bfilename=("(.*?)"|([^()<>{}[\]@,;:"?=\s/\t]+))($|;\s)/i,
    );
    if (!m) return null;

    const match = m[2] || m[3] || '';
    let originalFilename = match.substr(match.lastIndexOf('\\') + 1);
    originalFilename = originalFilename.replace(/%22/g, '"');
    originalFilename = originalFilename.replace(/&#([\d]{4});/g, (_, code) =>
      String.fromCharCode(code),
    );

    return originalFilename;
  }

  _getExtension(str) {
    if (!str) {
      return '';
    }

    const basename = path.basename(str);
    const firstDot = basename.indexOf('.');
    const lastDot = basename.lastIndexOf('.');
    const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');

    if (firstDot === lastDot) {
      return extname;
    }

    return basename.slice(firstDot, lastDot) + extname;
  }



  _joinDirectoryName(name) {
    const newPath = path.join(this.uploadDir, name);

    // prevent directory traversal attacks
    if (!newPath.startsWith(this.uploadDir)) {
      return path.join(this.uploadDir, this.options.defaultInvalidName);
    }

    return newPath;
  }

  _setUpRename() {
    const hasRename = typeof this.options.filename === 'function';
    if (hasRename) {
      this._getNewName = (part) => {
        let ext = '';
        let name = this.options.defaultInvalidName;
        if (part.originalFilename) {
          // can be null
          ({ ext, name } = path.parse(part.originalFilename));
          if (this.options.keepExtensions !== true) {
            ext = '';
          }
        }
        return this.options.filename.call(this, name, ext, part, this);
      };
    } else {
      this._getNewName = (part) => {
        const name = toHexoId();

        if (part && this.options.keepExtensions) {
          const originalFilename = typeof part === 'string' ? part : part.originalFilename;
          return `${name}${this._getExtension(originalFilename)}`;
        }
    
        return name;
      }
    }
  }

  _setUpMaxFields() {
    if (this.options.maxFields !== 0) {
      let fieldsCount = 0;
      this.on('field', () => {
        fieldsCount += 1;
        if (fieldsCount > this.options.maxFields) {
          this._error(
            new FormidableError(
              `options.maxFields (${this.options.maxFields}) exceeded`,
              errors.maxFieldsExceeded,
              413,
            ),
          );
        }
      });
    }
  }

  _maybeEnd() {
    // console.log('ended', this.ended);
    // console.log('_flushing', this._flushing);
    // console.log('error', this.error);
    if (!this.ended || this._flushing || this.error) {
      return;
    }

    this.emit('end');
  }
}

IncomingForm.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports = IncomingForm;


/***/ }),

/***/ 3808:
/***/ ((module) => {

/* eslint-disable no-plusplus */

const missingPlugin = 1000;
const pluginFunction = 1001;
const aborted = 1002;
const noParser = 1003;
const uninitializedParser = 1004;
const filenameNotString = 1005;
const maxFieldsSizeExceeded = 1006;
const maxFieldsExceeded = 1007;
const smallerThanMinFileSize = 1008;
const biggerThanMaxFileSize = 1009;
const noEmptyFiles = 1010;
const missingContentType = 1011;
const malformedMultipart = 1012;
const missingMultipartBoundary = 1013;
const unknownTransferEncoding = 1014;

const FormidableError = class extends Error {
  constructor(message, internalCode, httpCode = 500) {
    super(message);
    this.code = internalCode;
    this.httpCode = httpCode;
  }
};

module.exports = {
  missingPlugin,
  pluginFunction,
  aborted,
  noParser,
  uninitializedParser,
  filenameNotString,
  maxFieldsSizeExceeded,
  maxFieldsExceeded,
  smallerThanMinFileSize,
  biggerThanMaxFileSize,
  noEmptyFiles,
  missingContentType,
  malformedMultipart,
  missingMultipartBoundary,
  unknownTransferEncoding,

  FormidableError,
};


/***/ }),

/***/ 6580:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const fs = __nccwpck_require__(7147);
const crypto = __nccwpck_require__(6113);
const { EventEmitter } = __nccwpck_require__(2361);

class PersistentFile extends EventEmitter {
  constructor({ filepath, newFilename, originalFilename, mimetype, hashAlgorithm }) {
    super();

    this.lastModifiedDate = null;
    Object.assign(this, { filepath, newFilename, originalFilename, mimetype, hashAlgorithm });

    this.size = 0;
    this._writeStream = null;

    if (typeof this.hashAlgorithm === 'string') {
      this.hash = crypto.createHash(this.hashAlgorithm);
    } else {
      this.hash = null;
    }
  }

  open() {
    this._writeStream = new fs.WriteStream(this.filepath);
    this._writeStream.on('error', (err) => {
      this.emit('error', err);
    });
  }

  toJSON() {
    const json = {
      size: this.size,
      filepath: this.filepath,
      newFilename: this.newFilename,
      mimetype: this.mimetype,
      mtime: this.lastModifiedDate,
      length: this.length,
      originalFilename: this.originalFilename,
    };
    if (this.hash && this.hash !== '') {
      json.hash = this.hash;
    }
    return json;
  }

  toString() {
    return `PersistentFile: ${this.newFilename}, Original: ${this.originalFilename}, Path: ${this.filepath}`;
  }

  write(buffer, cb) {
    if (this.hash) {
      this.hash.update(buffer);
    }

    if (this._writeStream.closed) {
      cb();
      return;
    }

    this._writeStream.write(buffer, () => {
      this.lastModifiedDate = new Date();
      this.size += buffer.length;
      this.emit('progress', this.size);
      cb();
    });
  }

  end(cb) {
    if (this.hash) {
      this.hash = this.hash.digest('hex');
    }
    this._writeStream.end(() => {
      this.emit('end');
      cb();
    });
  }

  destroy() {
    this._writeStream.destroy();
    fs.unlink(this.filepath, () => {});
  }
}

module.exports = PersistentFile;


/***/ }),

/***/ 2908:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const crypto = __nccwpck_require__(6113);
const { EventEmitter } = __nccwpck_require__(2361);

class VolatileFile extends EventEmitter {
  constructor({ filepath, newFilename, originalFilename, mimetype, hashAlgorithm, createFileWriteStream }) {
    super();

    this.lastModifiedDate = null;
    Object.assign(this, { filepath, newFilename, originalFilename, mimetype, hashAlgorithm, createFileWriteStream });

    this.size = 0;
    this._writeStream = null;

    if (typeof this.hashAlgorithm === 'string') {
      this.hash = crypto.createHash(this.hashAlgorithm);
    } else {
      this.hash = null;
    }
  }

  open() {
    this._writeStream = this.createFileWriteStream(this);
    this._writeStream.on('error', (err) => {
      this.emit('error', err);
    });
  }

  destroy() {
    this._writeStream.destroy();
  }

  toJSON() {
    const json = {
      size: this.size,
      newFilename: this.newFilename,
      length: this.length,
      originalFilename: this.originalFilename,
      mimetype: this.mimetype,
    };
    if (this.hash && this.hash !== '') {
      json.hash = this.hash;
    }
    return json;
  }

  toString() {
    return `VolatileFile: ${this.originalFilename}`;
  }

  write(buffer, cb) {
    if (this.hash) {
      this.hash.update(buffer);
    }

    if (this._writeStream.closed || this._writeStream.destroyed) {
      cb();
      return;
    }

    this._writeStream.write(buffer, () => {
      this.size += buffer.length;
      this.emit('progress', this.size);
      cb();
    });
  }

  end(cb) {
    if (this.hash) {
      this.hash = this.hash.digest('hex');
    }
    this._writeStream.end(() => {
      this.emit('end');
      cb();
    });
  }
}

module.exports = VolatileFile;


/***/ }),

/***/ 5706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const PersistentFile = __nccwpck_require__(6580);
const VolatileFile = __nccwpck_require__(2908);
const Formidable = __nccwpck_require__(6952);
const FormidableError = __nccwpck_require__(3808);

const plugins = __nccwpck_require__(3300);
const parsers = __nccwpck_require__(8652);

// make it available without requiring the `new` keyword
// if you want it access `const formidable.IncomingForm` as v1
const formidable = (...args) => new Formidable(...args);

module.exports = Object.assign(formidable, {
  errors: FormidableError,
  File: PersistentFile,
  PersistentFile,
  VolatileFile,
  Formidable,
  formidable,

  // alias
  IncomingForm: Formidable,

  // parsers
  ...parsers,
  parsers,

  // misc
  defaultOptions: Formidable.DEFAULT_OPTIONS,
  enabledPlugins: Formidable.DEFAULT_OPTIONS.enabledPlugins,

  // plugins
  plugins: {
    ...plugins,
  },
});


/***/ }),

/***/ 4335:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const { Transform } = __nccwpck_require__(2781);

class DummyParser extends Transform {
  constructor(incomingForm, options = {}) {
    super();
    this.globalOptions = { ...options };
    this.incomingForm = incomingForm;
  }

  _flush(callback) {
    this.incomingForm.ended = true;
    this.incomingForm._maybeEnd();
    callback();
  }
}

module.exports = DummyParser;


/***/ }),

/***/ 4739:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const { Transform } = __nccwpck_require__(2781);

class JSONParser extends Transform {
  constructor(options = {}) {
    super({ readableObjectMode: true });
    this.chunks = [];
    this.globalOptions = { ...options };
  }

  _transform(chunk, encoding, callback) {
    this.chunks.push(String(chunk)); // todo consider using a string decoder
    callback();
  }

  _flush(callback) {
    try {
      const fields = JSON.parse(this.chunks.join(''));
      Object.keys(fields).forEach((key) => {
        const value = fields[key];
        this.push({ key, value });
      });
    } catch (e) {
      callback(e);
      return;
    }
    this.chunks = null;
    callback();
  }
}

module.exports = JSONParser;


/***/ }),

/***/ 5139:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-fallthrough */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */



const { Transform } = __nccwpck_require__(2781);
const errors = __nccwpck_require__(3808);

const { FormidableError } = errors;

let s = 0;
const STATE = {
  PARSER_UNINITIALIZED: s++,
  START: s++,
  START_BOUNDARY: s++,
  HEADER_FIELD_START: s++,
  HEADER_FIELD: s++,
  HEADER_VALUE_START: s++,
  HEADER_VALUE: s++,
  HEADER_VALUE_ALMOST_DONE: s++,
  HEADERS_ALMOST_DONE: s++,
  PART_DATA_START: s++,
  PART_DATA: s++,
  PART_END: s++,
  END: s++,
};

let f = 1;
const FBOUNDARY = { PART_BOUNDARY: f, LAST_BOUNDARY: (f *= 2) };

const LF = 10;
const CR = 13;
const SPACE = 32;
const HYPHEN = 45;
const COLON = 58;
const A = 97;
const Z = 122;

function lower(c) {
  return c | 0x20;
}

exports.STATES = {};

Object.keys(STATE).forEach((stateName) => {
  exports.STATES[stateName] = STATE[stateName];
});

class MultipartParser extends Transform {
  constructor(options = {}) {
    super({ readableObjectMode: true });
    this.boundary = null;
    this.boundaryChars = null;
    this.lookbehind = null;
    this.bufferLength = 0;
    this.state = STATE.PARSER_UNINITIALIZED;

    this.globalOptions = { ...options };
    this.index = null;
    this.flags = 0;
  }

  _flush(done) {
    if (
      (this.state === STATE.HEADER_FIELD_START && this.index === 0) ||
      (this.state === STATE.PART_DATA && this.index === this.boundary.length)
    ) {
      this._handleCallback('partEnd');
      this._handleCallback('end');
      done();
    } else if (this.state !== STATE.END) {
      done(
        new FormidableError(
          `MultipartParser.end(): stream ended unexpectedly: ${this.explain()}`,
          errors.malformedMultipart,
          400,
        ),
      );
    }
  }

  initWithBoundary(str) {
    this.boundary = Buffer.from(`\r\n--${str}`);
    this.lookbehind = Buffer.alloc(this.boundary.length + 8);
    this.state = STATE.START;
    this.boundaryChars = {};

    for (let i = 0; i < this.boundary.length; i++) {
      this.boundaryChars[this.boundary[i]] = true;
    }
  }

  // eslint-disable-next-line max-params
  _handleCallback(name, buf, start, end) {
    if (start !== undefined && start === end) {
      return;
    }
    this.push({ name, buffer: buf, start, end });
  }

  // eslint-disable-next-line max-statements
  _transform(buffer, _, done) {
    let i = 0;
    let prevIndex = this.index;
    let { index, state, flags } = this;
    const { lookbehind, boundary, boundaryChars } = this;
    const boundaryLength = boundary.length;
    const boundaryEnd = boundaryLength - 1;
    this.bufferLength = buffer.length;
    let c = null;
    let cl = null;

    const setMark = (name, idx) => {
      this[`${name}Mark`] = typeof idx === 'number' ? idx : i;
    };

    const clearMarkSymbol = (name) => {
      delete this[`${name}Mark`];
    };

    const dataCallback = (name, shouldClear) => {
      const markSymbol = `${name}Mark`;
      if (!(markSymbol in this)) {
        return;
      }

      if (!shouldClear) {
        this._handleCallback(name, buffer, this[markSymbol], buffer.length);
        setMark(name, 0);
      } else {
        this._handleCallback(name, buffer, this[markSymbol], i);
        clearMarkSymbol(name);
      }
    };

    for (i = 0; i < this.bufferLength; i++) {
      c = buffer[i];
      switch (state) {
        case STATE.PARSER_UNINITIALIZED:
          return i;
        case STATE.START:
          index = 0;
          state = STATE.START_BOUNDARY;
        case STATE.START_BOUNDARY:
          if (index === boundary.length - 2) {
            if (c === HYPHEN) {
              flags |= FBOUNDARY.LAST_BOUNDARY;
            } else if (c !== CR) {
              return i;
            }
            index++;
            break;
          } else if (index - 1 === boundary.length - 2) {
            if (flags & FBOUNDARY.LAST_BOUNDARY && c === HYPHEN) {
              this._handleCallback('end');
              state = STATE.END;
              flags = 0;
            } else if (!(flags & FBOUNDARY.LAST_BOUNDARY) && c === LF) {
              index = 0;
              this._handleCallback('partBegin');
              state = STATE.HEADER_FIELD_START;
            } else {
              return i;
            }
            break;
          }

          if (c !== boundary[index + 2]) {
            index = -2;
          }
          if (c === boundary[index + 2]) {
            index++;
          }
          break;
        case STATE.HEADER_FIELD_START:
          state = STATE.HEADER_FIELD;
          setMark('headerField');
          index = 0;
        case STATE.HEADER_FIELD:
          if (c === CR) {
            clearMarkSymbol('headerField');
            state = STATE.HEADERS_ALMOST_DONE;
            break;
          }

          index++;
          if (c === HYPHEN) {
            break;
          }

          if (c === COLON) {
            if (index === 1) {
              // empty header field
              return i;
            }
            dataCallback('headerField', true);
            state = STATE.HEADER_VALUE_START;
            break;
          }

          cl = lower(c);
          if (cl < A || cl > Z) {
            return i;
          }
          break;
        case STATE.HEADER_VALUE_START:
          if (c === SPACE) {
            break;
          }

          setMark('headerValue');
          state = STATE.HEADER_VALUE;
        case STATE.HEADER_VALUE:
          if (c === CR) {
            dataCallback('headerValue', true);
            this._handleCallback('headerEnd');
            state = STATE.HEADER_VALUE_ALMOST_DONE;
          }
          break;
        case STATE.HEADER_VALUE_ALMOST_DONE:
          if (c !== LF) {
            return i;
          }
          state = STATE.HEADER_FIELD_START;
          break;
        case STATE.HEADERS_ALMOST_DONE:
          if (c !== LF) {
            return i;
          }

          this._handleCallback('headersEnd');
          state = STATE.PART_DATA_START;
          break;
        case STATE.PART_DATA_START:
          state = STATE.PART_DATA;
          setMark('partData');
        case STATE.PART_DATA:
          prevIndex = index;

          if (index === 0) {
            // boyer-moore derrived algorithm to safely skip non-boundary data
            i += boundaryEnd;
            while (i < this.bufferLength && !(buffer[i] in boundaryChars)) {
              i += boundaryLength;
            }
            i -= boundaryEnd;
            c = buffer[i];
          }

          if (index < boundary.length) {
            if (boundary[index] === c) {
              if (index === 0) {
                dataCallback('partData', true);
              }
              index++;
            } else {
              index = 0;
            }
          } else if (index === boundary.length) {
            index++;
            if (c === CR) {
              // CR = part boundary
              flags |= FBOUNDARY.PART_BOUNDARY;
            } else if (c === HYPHEN) {
              // HYPHEN = end boundary
              flags |= FBOUNDARY.LAST_BOUNDARY;
            } else {
              index = 0;
            }
          } else if (index - 1 === boundary.length) {
            if (flags & FBOUNDARY.PART_BOUNDARY) {
              index = 0;
              if (c === LF) {
                // unset the PART_BOUNDARY flag
                flags &= ~FBOUNDARY.PART_BOUNDARY;
                this._handleCallback('partEnd');
                this._handleCallback('partBegin');
                state = STATE.HEADER_FIELD_START;
                break;
              }
            } else if (flags & FBOUNDARY.LAST_BOUNDARY) {
              if (c === HYPHEN) {
                this._handleCallback('partEnd');
                this._handleCallback('end');
                state = STATE.END;
                flags = 0;
              } else {
                index = 0;
              }
            } else {
              index = 0;
            }
          }

          if (index > 0) {
            // when matching a possible boundary, keep a lookbehind reference
            // in case it turns out to be a false lead
            lookbehind[index - 1] = c;
          } else if (prevIndex > 0) {
            // if our boundary turned out to be rubbish, the captured lookbehind
            // belongs to partData
            this._handleCallback('partData', lookbehind, 0, prevIndex);
            prevIndex = 0;
            setMark('partData');

            // reconsider the current character even so it interrupted the sequence
            // it could be the beginning of a new sequence
            i--;
          }

          break;
        case STATE.END:
          break;
        default:
          return i;
      }
    }

    dataCallback('headerField');
    dataCallback('headerValue');
    dataCallback('partData');

    this.index = index;
    this.state = state;
    this.flags = flags;

    done();
    return this.bufferLength;
  }

  explain() {
    return `state = ${MultipartParser.stateToString(this.state)}`;
  }
}

// eslint-disable-next-line consistent-return
MultipartParser.stateToString = (stateNumber) => {
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const stateName in STATE) {
    const number = STATE[stateName];
    if (number === stateNumber) return stateName;
  }
};

module.exports = Object.assign(MultipartParser, { STATES: exports.STATES });


/***/ }),

/***/ 1084:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { PassThrough } = __nccwpck_require__(2781);

class OctetStreamParser extends PassThrough {
  constructor(options = {}) {
    super();
    this.globalOptions = { ...options };
  }
}

module.exports = OctetStreamParser;


/***/ }),

/***/ 4279:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const { Transform } = __nccwpck_require__(2781);
const querystring = __nccwpck_require__(3477);

// This is a buffering parser, not quite as nice as the multipart one.
// If I find time I'll rewrite this to be fully streaming as well
class QuerystringParser extends Transform {
  constructor(options = {}) {
    super({ readableObjectMode: true });
    this.globalOptions = { ...options };
    this.buffer = '';
    this.bufferLength = 0;
  }

  _transform(buffer, encoding, callback) {
    this.buffer += buffer.toString('ascii');
    this.bufferLength = this.buffer.length;
    callback();
  }

  _flush(callback) {
    const fields = querystring.parse(this.buffer, '&', '=');
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in fields) {
      this.push({
        key,
        value: fields[key],
      });
    }
    this.buffer = '';
    callback();
  }
}

module.exports = QuerystringParser;


/***/ }),

/***/ 8652:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const JSONParser = __nccwpck_require__(4739);
const DummyParser = __nccwpck_require__(4335);
const MultipartParser = __nccwpck_require__(5139);
const OctetStreamParser = __nccwpck_require__(1084);
const QueryStringParser = __nccwpck_require__(4279);

Object.assign(exports, {
  JSONParser,
  DummyParser,
  MultipartParser,
  OctetStreamParser,
  OctetstreamParser: OctetStreamParser,
  QueryStringParser,
  QuerystringParser: QueryStringParser,
});


/***/ }),

/***/ 3300:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const octetstream = __nccwpck_require__(6197);
const querystring = __nccwpck_require__(2210);
const multipart = __nccwpck_require__(7964);
const json = __nccwpck_require__(9378);

Object.assign(exports, {
  octetstream,
  querystring,
  multipart,
  json,
});


/***/ }),

/***/ 9378:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const JSONParser = __nccwpck_require__(4739);

// the `options` is also available through the `this.options` / `formidable.options`
module.exports = function plugin(formidable, options) {
  // the `this` context is always formidable, as the first argument of a plugin
  // but this allows us to customize/test each plugin

  /* istanbul ignore next */
  const self = this || formidable;

  if (/json/i.test(self.headers['content-type'])) {
    init.call(self, self, options);
  }
};

// Note that it's a good practice (but it's up to you) to use the `this.options` instead
// of the passed `options` (second) param, because when you decide
// to test the plugin you can pass custom `this` context to it (and so `this.options`)
function init(_self, _opts) {
  this.type = 'json';

  const parser = new JSONParser(this.options);

  parser.on('data', ({ key, value }) => {
    this.emit('field', key, value);
  });

  parser.once('end', () => {
    this.ended = true;
    this._maybeEnd();
  });

  this._parser = parser;
}


/***/ }),

/***/ 7964:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const { Stream } = __nccwpck_require__(2781);
const MultipartParser = __nccwpck_require__(5139);
const errors = __nccwpck_require__(3808);

const { FormidableError } = errors;

// the `options` is also available through the `options` / `formidable.options`
module.exports = function plugin(formidable, options) {
  // the `this` context is always formidable, as the first argument of a plugin
  // but this allows us to customize/test each plugin

  /* istanbul ignore next */
  const self = this || formidable;

  // NOTE: we (currently) support both multipart/form-data and multipart/related
  const multipart = /multipart/i.test(self.headers['content-type']);

  if (multipart) {
    const m = self.headers['content-type'].match(
      /boundary=(?:"([^"]+)"|([^;]+))/i,
    );
    if (m) {
      const initMultipart = createInitMultipart(m[1] || m[2]);
      initMultipart.call(self, self, options); // lgtm [js/superfluous-trailing-arguments]
    } else {
      const err = new FormidableError(
        'bad content-type header, no multipart boundary',
        errors.missingMultipartBoundary,
        400,
      );
      self._error(err);
    }
  }
};

// Note that it's a good practice (but it's up to you) to use the `this.options` instead
// of the passed `options` (second) param, because when you decide
// to test the plugin you can pass custom `this` context to it (and so `this.options`)
function createInitMultipart(boundary) {
  return function initMultipart() {
    this.type = 'multipart';

    const parser = new MultipartParser(this.options);
    let headerField;
    let headerValue;
    let part;

    parser.initWithBoundary(boundary);

    // eslint-disable-next-line max-statements, consistent-return
    parser.on('data', ({ name, buffer, start, end }) => {
      if (name === 'partBegin') {
        part = new Stream();
        part.readable = true;
        part.headers = {};
        part.name = null;
        part.originalFilename = null;
        part.mimetype = null;

        part.transferEncoding = this.options.encoding;
        part.transferBuffer = '';

        headerField = '';
        headerValue = '';
      } else if (name === 'headerField') {
        headerField += buffer.toString(this.options.encoding, start, end);
      } else if (name === 'headerValue') {
        headerValue += buffer.toString(this.options.encoding, start, end);
      } else if (name === 'headerEnd') {
        headerField = headerField.toLowerCase();
        part.headers[headerField] = headerValue;

        // matches either a quoted-string or a token (RFC 2616 section 19.5.1)
        const m = headerValue.match(
          // eslint-disable-next-line no-useless-escape
          /\bname=("([^"]*)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))/i,
        );
        if (headerField === 'content-disposition') {
          if (m) {
            part.name = m[2] || m[3] || '';
          }

          part.originalFilename = this._getFileName(headerValue);
        } else if (headerField === 'content-type') {
          part.mimetype = headerValue;
        } else if (headerField === 'content-transfer-encoding') {
          part.transferEncoding = headerValue.toLowerCase();
        }

        headerField = '';
        headerValue = '';
      } else if (name === 'headersEnd') {
        switch (part.transferEncoding) {
          case 'binary':
          case '7bit':
          case '8bit':
          case 'utf-8': {
            const dataPropagation = (ctx) => {
              if (ctx.name === 'partData') {
                part.emit('data', ctx.buffer.slice(ctx.start, ctx.end));
              }
            };
            const dataStopPropagation = (ctx) => {
              if (ctx.name === 'partEnd') {
                part.emit('end');
                parser.off('data', dataPropagation);
                parser.off('data', dataStopPropagation);
              }
            };
            parser.on('data', dataPropagation);
            parser.on('data', dataStopPropagation);
            break;
          }
          case 'base64': {
            const dataPropagation = (ctx) => {
              if (ctx.name === 'partData') {
                part.transferBuffer += ctx.buffer
                  .slice(ctx.start, ctx.end)
                  .toString('ascii');

                /*
                  four bytes (chars) in base64 converts to three bytes in binary
                  encoding. So we should always work with a number of bytes that
                  can be divided by 4, it will result in a number of buytes that
                  can be divided vy 3.
                  */
                const offset = parseInt(part.transferBuffer.length / 4, 10) * 4;
                part.emit(
                  'data',
                  Buffer.from(
                    part.transferBuffer.substring(0, offset),
                    'base64',
                  ),
                );
                part.transferBuffer = part.transferBuffer.substring(offset);
              }
            };
            const dataStopPropagation = (ctx) => {
              if (ctx.name === 'partEnd') {
                part.emit('data', Buffer.from(part.transferBuffer, 'base64'));
                part.emit('end');
                parser.off('data', dataPropagation);
                parser.off('data', dataStopPropagation);
              }
            };
            parser.on('data', dataPropagation);
            parser.on('data', dataStopPropagation);
            break;
          }
          default:
            return this._error(
              new FormidableError(
                'unknown transfer-encoding',
                errors.unknownTransferEncoding,
                501,
              ),
            );
        }

        this.onPart(part);
      } else if (name === 'end') {
        this.ended = true;
        this._maybeEnd();
      }
    });

    this._parser = parser;
  };
}


/***/ }),

/***/ 6197:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const OctetStreamParser = __nccwpck_require__(1084);

// the `options` is also available through the `options` / `formidable.options`
module.exports = function plugin(formidable, options) {
  // the `this` context is always formidable, as the first argument of a plugin
  // but this allows us to customize/test each plugin

  /* istanbul ignore next */
  const self = this || formidable;

  if (/octet-stream/i.test(self.headers['content-type'])) {
    init.call(self, self, options);
  }

  return self;
};

// Note that it's a good practice (but it's up to you) to use the `this.options` instead
// of the passed `options` (second) param, because when you decide
// to test the plugin you can pass custom `this` context to it (and so `this.options`)
function init(_self, _opts) {
  this.type = 'octet-stream';
  const originalFilename = this.headers['x-file-name'];
  const mimetype = this.headers['content-type'];

  const thisPart = {
    originalFilename,
    mimetype,
  };
  const newFilename = this._getNewName(thisPart);
  const filepath = this._joinDirectoryName(newFilename);
  const file = this._newFile({
    newFilename,
    filepath,
    originalFilename,
    mimetype,
  });

  this.emit('fileBegin', originalFilename, file);
  file.open();
  this.openedFiles.push(file);
  this._flushing += 1;

  this._parser = new OctetStreamParser(this.options);

  // Keep track of writes that haven't finished so we don't emit the file before it's done being written
  let outstandingWrites = 0;

  this._parser.on('data', (buffer) => {
    this.pause();
    outstandingWrites += 1;

    file.write(buffer, () => {
      outstandingWrites -= 1;
      this.resume();

      if (this.ended) {
        this._parser.emit('doneWritingFile');
      }
    });
  });

  this._parser.on('end', () => {
    this._flushing -= 1;
    this.ended = true;

    const done = () => {
      file.end(() => {
        this.emit('file', 'file', file);
        this._maybeEnd();
      });
    };

    if (outstandingWrites === 0) {
      done();
    } else {
      this._parser.once('doneWritingFile', done);
    }
  });

  return this;
}


/***/ }),

/***/ 2210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-underscore-dangle */



const QuerystringParser = __nccwpck_require__(4279);

// the `options` is also available through the `this.options` / `formidable.options`
module.exports = function plugin(formidable, options) {
  // the `this` context is always formidable, as the first argument of a plugin
  // but this allows us to customize/test each plugin

  /* istanbul ignore next */
  const self = this || formidable;

  if (/urlencoded/i.test(self.headers['content-type'])) {
    init.call(self, self, options);
  }

  return self;
};

// Note that it's a good practice (but it's up to you) to use the `this.options` instead
// of the passed `options` (second) param, because when you decide
// to test the plugin you can pass custom `this` context to it (and so `this.options`)
function init(_self, _opts) {
  this.type = 'urlencoded';

  const parser = new QuerystringParser(this.options);

  parser.on('data', ({ key, value }) => {
    this.emit('field', key, value);
  });

  parser.once('end', () => {
    this.ended = true;
    this._maybeEnd();
  });

  this._parser = parser;

  return this;
}


/***/ }),

/***/ 9320:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 8334:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var implementation = __nccwpck_require__(9320);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 4538:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __nccwpck_require__(587)();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

try {
	null.error; // eslint-disable-line no-unused-expressions
} catch (e) {
	// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
	var errorProto = getProto(getProto(e));
	INTRINSICS['%Error.prototype%'] = errorProto;
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __nccwpck_require__(8334);
var hasOwn = __nccwpck_require__(6339);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __nccwpck_require__(7747);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 7747:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 6339:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(8334);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ 7108:
/***/ ((module) => {

var IDX=256, HEX=[];
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

module.exports = function (len) {
	len = len || 16;
	var str='', num=0;
	return function () {
		if (!str || num === 256) {
			str=''; num=(1+len)/2 | 0;
			while (num--) str += HEX[256 * Math.random() | 0];
			str = str.substring(num=0, len-2);
		}
		return str + HEX[num++];
	};
}


/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(665)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 8752:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*!
 * methods
 * Copyright(c) 2013-2014 TJ Holowaychuk
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var http = __nccwpck_require__(3685);

/**
 * Module exports.
 * @public
 */

module.exports = getCurrentNodeMethods() || getBasicNodeMethods();

/**
 * Get the current Node.js methods.
 * @private
 */

function getCurrentNodeMethods() {
  return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {
    return method.toLowerCase();
  });
}

/**
 * Get the "basic" Node.js methods, a snapshot from Node.js 0.10.
 * @private
 */

function getBasicNodeMethods() {
  return [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect'
  ];
}


/***/ }),

/***/ 7426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __nccwpck_require__(3765)


/***/ }),

/***/ 3583:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __nccwpck_require__(7426)
var extname = (__nccwpck_require__(1017).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),

/***/ 6038:
/***/ ((module) => {

"use strict";


/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] === '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = (ext[0] !== '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  let last = path.replace(/^.*[/\\]/, '').toLowerCase();
  let ext = last.replace(/^.*\./, '').toLowerCase();

  let hasPath = last.length < path.length;
  let hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

module.exports = Mime;


/***/ }),

/***/ 9994:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


let Mime = __nccwpck_require__(6038);
module.exports = new Mime(__nccwpck_require__(3114), __nccwpck_require__(8809));


/***/ }),

/***/ 8809:
/***/ ((module) => {

module.exports = {"application/prs.cww":["cww"],"application/vnd.1000minds.decision-model+xml":["1km"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.keynote":["key"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.numbers":["numbers"],"application/vnd.apple.pages":["pages"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.balsamiq.bmml+xml":["bmml"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.citationstyles.style+xml":["csl"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dbf":["dbf"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mapbox-vector-tile":["mvt"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["*stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.ac+xml":["*ac"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openblox.game+xml":["obgx"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openstreetmap.data+xml":["osm"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.rar":["rar"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.software602.filler.form+xml":["fo"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.syncml.dmddf+xml":["ddf"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["*dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["*bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["*deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["*iso"],"application/x-iwork-keynote-sffkey":["*key"],"application/x-iwork-numbers-sffnumbers":["*numbers"],"application/x-iwork-pages-sffpages":["*pages"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-keepass2":["kdbx"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["*exe"],"application/x-msdownload":["*exe","*dll","com","bat","*msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["*wmf","*wmz","*emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["*prc","*pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["*rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["*obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["*xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["*m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["*ra"],"audio/x-wav":["*wav"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"image/prs.btif":["btif"],"image/prs.pti":["pti"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.airzip.accelerator.azv":["azv"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["*sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.microsoft.icon":["ico"],"image/vnd.ms-dds":["dds"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.pco.b16":["b16"],"image/vnd.tencent.tap":["tap"],"image/vnd.valve.source.texture":["vtf"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/vnd.zbrush.pcx":["pcx"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["*ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["*bmp"],"image/x-pcx":["*pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/vnd.wfa.wsc":["wsc"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.opengex":["ogex"],"model/vnd.parasolid.transmit.binary":["x_b"],"model/vnd.parasolid.transmit.text":["x_t"],"model/vnd.sap.vds":["vds"],"model/vnd.usdz+zip":["usdz"],"model/vnd.valve.source.compiled-map":["bsp"],"model/vnd.vtu":["vtu"],"text/prs.lines.tag":["dsc"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["*org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]};

/***/ }),

/***/ 3114:
/***/ ((module) => {

module.exports = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["es","ecma"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/express":["exp"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/trig":["trig"],"application/ttml+xml":["ttml"],"application/ubjson":["ubj"],"application/urc-ressheet+xml":["rsheet"],"application/urc-targetdesc+xml":["td"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["*xsl","xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/amr":["amr"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx","opus"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/avif":["avif"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/ktx2":["ktx2"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/step+xml":["stpx"],"model/step+zip":["stpz"],"model/step-xml+zip":["stpxz"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/spdx":["spdx"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/iso.segment":["m4s"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 504:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __nccwpck_require__(7265);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 7265:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(3837).inspect;


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 4907:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 2760:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var stringify = __nccwpck_require__(9954);
var parse = __nccwpck_require__(3912);
var formats = __nccwpck_require__(4907);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 3912:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(2360);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 9954:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var getSideChannel = __nccwpck_require__(4334);
var utils = __nccwpck_require__(2360);
var formats = __nccwpck_require__(4907);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
                var valuesArray = split.call(String(obj), ',');
                var valuesJoined = '';
                for (var i = 0; i < valuesArray.length; ++i) {
                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults.encoder, charset, 'value', format));
                }
                return [formatter(keyValue) + (commaRoundTrip && isArray(obj) && valuesArray.length === 1 ? '[]' : '') + '=' + valuesJoined];
            }
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 2360:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var formats = __nccwpck_require__(4907);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 1532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(785)
const { re, t } = __nccwpck_require__(9523)
const cmp = __nccwpck_require__(5098)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim()

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',')
    const memoKey = `parseRange:${memoOpts}:${range}`
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const LRU = __nccwpck_require__(7129)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(785)
const Comparator = __nccwpck_require__(1532)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(9523)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceTilde(c, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceCaret(c, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((c) => {
    return replaceXRange(c, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(427)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(2293)
const { re, t } = __nccwpck_require__(9523)

const parseOptions = __nccwpck_require__(785)
const { compareIdentifiers } = __nccwpck_require__(2463)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 5098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gt = __nccwpck_require__(4123)
const gte = __nccwpck_require__(5522)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 3466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = __nccwpck_require__(5925)
const { re, t } = __nccwpck_require__(9523)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const eq = __nccwpck_require__(1898)

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff


/***/ }),

/***/ 1898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5522:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 929:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 6017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MAX_LENGTH } = __nccwpck_require__(2293)
const { re, t } = __nccwpck_require__(9523)
const SemVer = __nccwpck_require__(8088)

const parseOptions = __nccwpck_require__(785)
const parse = (version, options) => {
  options = parseOptions(options)

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),

/***/ 2866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 6417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 8701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 6055:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(9523)
const constants = __nccwpck_require__(2293)
const SemVer = __nccwpck_require__(8088)
const identifiers = __nccwpck_require__(2463)
const parse = __nccwpck_require__(5925)
const valid = __nccwpck_require__(9601)
const clean = __nccwpck_require__(8848)
const inc = __nccwpck_require__(929)
const diff = __nccwpck_require__(4297)
const major = __nccwpck_require__(6688)
const minor = __nccwpck_require__(8447)
const patch = __nccwpck_require__(2866)
const prerelease = __nccwpck_require__(4016)
const compare = __nccwpck_require__(4309)
const rcompare = __nccwpck_require__(6417)
const compareLoose = __nccwpck_require__(2804)
const compareBuild = __nccwpck_require__(2156)
const sort = __nccwpck_require__(1426)
const rsort = __nccwpck_require__(8701)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gte = __nccwpck_require__(5522)
const lte = __nccwpck_require__(7520)
const cmp = __nccwpck_require__(5098)
const coerce = __nccwpck_require__(3466)
const Comparator = __nccwpck_require__(1532)
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const toComparators = __nccwpck_require__(2706)
const maxSatisfying = __nccwpck_require__(579)
const minSatisfying = __nccwpck_require__(832)
const minVersion = __nccwpck_require__(4179)
const validRange = __nccwpck_require__(2098)
const outside = __nccwpck_require__(420)
const gtr = __nccwpck_require__(9380)
const ltr = __nccwpck_require__(3323)
const intersects = __nccwpck_require__(7008)
const simplifyRange = __nccwpck_require__(5297)
const subset = __nccwpck_require__(7863)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 2293:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH,
}


/***/ }),

/***/ 427:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 2463:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 785:
/***/ ((module) => {

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl']
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((o, k) => {
    o[k] = true
    return o
  }, {})
module.exports = parseOptions


/***/ }),

/***/ 9523:
/***/ ((module, exports, __nccwpck_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH } = __nccwpck_require__(2293)
const debug = __nccwpck_require__(427)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(420)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}
module.exports = intersects


/***/ }),

/***/ 3323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(420)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 4179:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const gt = __nccwpck_require__(4123)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 420:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)
const gte = __nccwpck_require__(5522)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 7863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = [new Comparator('>=0.0.0-0')]
    } else {
      sub = [new Comparator('>=0.0.0')]
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = [new Comparator('>=0.0.0')]
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 2706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 2098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 4334:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var GetIntrinsic = __nccwpck_require__(4538);
var callBound = __nccwpck_require__(8803);
var inspect = __nccwpck_require__(504);

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};


/***/ }),

/***/ 1744:
/***/ ((module) => {

"use strict";


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function Agent() {
  this._defaults = [];
}
for (var _i = 0, _arr = ['use', 'on', 'once', 'set', 'query', 'type', 'accept', 'auth', 'withCredentials', 'sortQuery', 'retry', 'ok', 'redirects', 'timeout', 'buffer', 'serialize', 'parse', 'ca', 'key', 'pfx', 'cert', 'disableTLSCerts']; _i < _arr.length; _i++) {
  const fn = _arr[_i];
  // Default setting for all requests from this agent
  Agent.prototype[fn] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this._defaults.push({
      fn,
      args
    });
    return this;
  };
}
Agent.prototype._setDefaults = function (request) {
  var _iterator = _createForOfIteratorHelper(this._defaults),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const def = _step.value;
      request[def.fn](...def.args);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
module.exports = Agent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBZ2VudCIsIl9kZWZhdWx0cyIsImZuIiwicHJvdG90eXBlIiwiYXJncyIsInB1c2giLCJfc2V0RGVmYXVsdHMiLCJyZXF1ZXN0IiwiZGVmIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9hZ2VudC1iYXNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEFnZW50KCkge1xuICB0aGlzLl9kZWZhdWx0cyA9IFtdO1xufVxuXG5mb3IgKGNvbnN0IGZuIG9mIFtcbiAgJ3VzZScsXG4gICdvbicsXG4gICdvbmNlJyxcbiAgJ3NldCcsXG4gICdxdWVyeScsXG4gICd0eXBlJyxcbiAgJ2FjY2VwdCcsXG4gICdhdXRoJyxcbiAgJ3dpdGhDcmVkZW50aWFscycsXG4gICdzb3J0UXVlcnknLFxuICAncmV0cnknLFxuICAnb2snLFxuICAncmVkaXJlY3RzJyxcbiAgJ3RpbWVvdXQnLFxuICAnYnVmZmVyJyxcbiAgJ3NlcmlhbGl6ZScsXG4gICdwYXJzZScsXG4gICdjYScsXG4gICdrZXknLFxuICAncGZ4JyxcbiAgJ2NlcnQnLFxuICAnZGlzYWJsZVRMU0NlcnRzJ1xuXSkge1xuICAvLyBEZWZhdWx0IHNldHRpbmcgZm9yIGFsbCByZXF1ZXN0cyBmcm9tIHRoaXMgYWdlbnRcbiAgQWdlbnQucHJvdG90eXBlW2ZuXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMucHVzaCh7IGZuLCBhcmdzIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG5BZ2VudC5wcm90b3R5cGUuX3NldERlZmF1bHRzID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgZm9yIChjb25zdCBkZWYgb2YgdGhpcy5fZGVmYXVsdHMpIHtcbiAgICByZXF1ZXN0W2RlZi5mbl0oLi4uZGVmLmFyZ3MpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFnZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLFNBQVNBLEtBQUssR0FBRztFQUNmLElBQUksQ0FBQ0MsU0FBUyxHQUFHLEVBQUU7QUFDckI7QUFFQSx3QkFBaUIsQ0FDZixLQUFLLEVBQ0wsSUFBSSxFQUNKLE1BQU0sRUFDTixLQUFLLEVBQ0wsT0FBTyxFQUNQLE1BQU0sRUFDTixRQUFRLEVBQ1IsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixXQUFXLEVBQ1gsT0FBTyxFQUNQLElBQUksRUFDSixXQUFXLEVBQ1gsU0FBUyxFQUNULFFBQVEsRUFDUixXQUFXLEVBQ1gsT0FBTyxFQUNQLElBQUksRUFDSixLQUFLLEVBQ0wsS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsQ0FDbEIsMEJBQUU7RUF2QkUsTUFBTUMsRUFBRTtFQXdCWDtFQUNBRixLQUFLLENBQUNHLFNBQVMsQ0FBQ0QsRUFBRSxDQUFDLEdBQUcsWUFBbUI7SUFBQSxrQ0FBTkUsSUFBSTtNQUFKQSxJQUFJO0lBQUE7SUFDckMsSUFBSSxDQUFDSCxTQUFTLENBQUNJLElBQUksQ0FBQztNQUFFSCxFQUFFO01BQUVFO0lBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sSUFBSTtFQUNiLENBQUM7QUFDSDtBQUVBSixLQUFLLENBQUNHLFNBQVMsQ0FBQ0csWUFBWSxHQUFHLFVBQVVDLE9BQU8sRUFBRTtFQUFBLDJDQUM5QixJQUFJLENBQUNOLFNBQVM7SUFBQTtFQUFBO0lBQWhDLG9EQUFrQztNQUFBLE1BQXZCTyxHQUFHO01BQ1pELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDTixFQUFFLENBQUMsQ0FBQyxHQUFHTSxHQUFHLENBQUNKLElBQUksQ0FBQztJQUM5QjtFQUFDO0lBQUE7RUFBQTtJQUFBO0VBQUE7QUFDSCxDQUFDO0FBRURLLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHVixLQUFLIn0=

/***/ }),

/***/ 4816:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Module dependencies.
 */

// eslint-disable-next-line node/no-deprecated-api
const _require = __nccwpck_require__(7310),
  parse = _require.parse;
const _require2 = __nccwpck_require__(5507),
  CookieJar = _require2.CookieJar;
const _require3 = __nccwpck_require__(5507),
  CookieAccessInfo = _require3.CookieAccessInfo;
const methods = __nccwpck_require__(8752);
const request = __nccwpck_require__(1524);
const AgentBase = __nccwpck_require__(1744);

/**
 * Expose `Agent`.
 */

module.exports = Agent;

/**
 * Initialize a new `Agent`.
 *
 * @api public
 */

function Agent(options) {
  if (!(this instanceof Agent)) {
    return new Agent(options);
  }
  AgentBase.call(this);
  this.jar = new CookieJar();
  if (options) {
    if (options.ca) {
      this.ca(options.ca);
    }
    if (options.key) {
      this.key(options.key);
    }
    if (options.pfx) {
      this.pfx(options.pfx);
    }
    if (options.cert) {
      this.cert(options.cert);
    }
    if (options.rejectUnauthorized === false) {
      this.disableTLSCerts();
    }
  }
}
Agent.prototype = Object.create(AgentBase.prototype);

/**
 * Save the cookies in the given `res` to
 * the agent's cookie jar for persistence.
 *
 * @param {Response} res
 * @api private
 */

Agent.prototype._saveCookies = function (res) {
  const cookies = res.headers['set-cookie'];
  if (cookies) {
    var _res$request;
    const url = parse(((_res$request = res.request) === null || _res$request === void 0 ? void 0 : _res$request.url) || '');
    this.jar.setCookies(cookies, url.hostname, url.pathname);
  }
};

/**
 * Attach cookies when available to the given `req`.
 *
 * @param {Request} req
 * @api private
 */

Agent.prototype._attachCookies = function (request_) {
  const url = parse(request_.url);
  const access = new CookieAccessInfo(url.hostname, url.pathname, url.protocol === 'https:');
  const cookies = this.jar.getCookies(access).toValueString();
  request_.cookies = cookies;
};
var _iterator = _createForOfIteratorHelper(methods),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    const name = _step.value;
    const method = name.toUpperCase();
    Agent.prototype[name] = function (url, fn) {
      const request_ = new request.Request(method, url);
      request_.on('response', this._saveCookies.bind(this));
      request_.on('redirect', this._saveCookies.bind(this));
      request_.on('redirect', this._attachCookies.bind(this, request_));
      this._setDefaults(request_);
      this._attachCookies(request_);
      if (fn) {
        request_.end(fn);
      }
      return request_;
    };
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
Agent.prototype.del = Agent.prototype.delete;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXF1aXJlIiwicGFyc2UiLCJDb29raWVKYXIiLCJDb29raWVBY2Nlc3NJbmZvIiwibWV0aG9kcyIsInJlcXVlc3QiLCJBZ2VudEJhc2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiQWdlbnQiLCJvcHRpb25zIiwiY2FsbCIsImphciIsImNhIiwia2V5IiwicGZ4IiwiY2VydCIsInJlamVjdFVuYXV0aG9yaXplZCIsImRpc2FibGVUTFNDZXJ0cyIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsIl9zYXZlQ29va2llcyIsInJlcyIsImNvb2tpZXMiLCJoZWFkZXJzIiwidXJsIiwic2V0Q29va2llcyIsImhvc3RuYW1lIiwicGF0aG5hbWUiLCJfYXR0YWNoQ29va2llcyIsInJlcXVlc3RfIiwiYWNjZXNzIiwicHJvdG9jb2wiLCJnZXRDb29raWVzIiwidG9WYWx1ZVN0cmluZyIsIm5hbWUiLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsImZuIiwiUmVxdWVzdCIsIm9uIiwiYmluZCIsIl9zZXREZWZhdWx0cyIsImVuZCIsImRlbCIsImRlbGV0ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL2FnZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby1kZXByZWNhdGVkLWFwaVxuY29uc3QgeyBwYXJzZSB9ID0gcmVxdWlyZSgndXJsJyk7XG5jb25zdCB7IENvb2tpZUphciB9ID0gcmVxdWlyZSgnY29va2llamFyJyk7XG5jb25zdCB7IENvb2tpZUFjY2Vzc0luZm8gfSA9IHJlcXVpcmUoJ2Nvb2tpZWphcicpO1xuY29uc3QgbWV0aG9kcyA9IHJlcXVpcmUoJ21ldGhvZHMnKTtcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCcuLi8uLicpO1xuY29uc3QgQWdlbnRCYXNlID0gcmVxdWlyZSgnLi4vYWdlbnQtYmFzZScpO1xuXG4vKipcbiAqIEV4cG9zZSBgQWdlbnRgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gQWdlbnQ7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgQWdlbnRgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gQWdlbnQob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQWdlbnQpKSB7XG4gICAgcmV0dXJuIG5ldyBBZ2VudChvcHRpb25zKTtcbiAgfVxuXG4gIEFnZW50QmFzZS5jYWxsKHRoaXMpO1xuICB0aGlzLmphciA9IG5ldyBDb29raWVKYXIoKTtcblxuICBpZiAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmNhKSB7XG4gICAgICB0aGlzLmNhKG9wdGlvbnMuY2EpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmtleSkge1xuICAgICAgdGhpcy5rZXkob3B0aW9ucy5rZXkpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnBmeCkge1xuICAgICAgdGhpcy5wZngob3B0aW9ucy5wZngpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNlcnQpIHtcbiAgICAgIHRoaXMuY2VydChvcHRpb25zLmNlcnQpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZGlzYWJsZVRMU0NlcnRzKCk7XG4gICAgfVxuICB9XG59XG5cbkFnZW50LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWdlbnRCYXNlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogU2F2ZSB0aGUgY29va2llcyBpbiB0aGUgZ2l2ZW4gYHJlc2AgdG9cbiAqIHRoZSBhZ2VudCdzIGNvb2tpZSBqYXIgZm9yIHBlcnNpc3RlbmNlLlxuICpcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQWdlbnQucHJvdG90eXBlLl9zYXZlQ29va2llcyA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgY29uc3QgY29va2llcyA9IHJlcy5oZWFkZXJzWydzZXQtY29va2llJ107XG4gIGlmIChjb29raWVzKSB7XG4gICAgY29uc3QgdXJsID0gcGFyc2UocmVzLnJlcXVlc3Q/LnVybCB8fCAnJylcbiAgICB0aGlzLmphci5zZXRDb29raWVzKGNvb2tpZXMsIHVybC5ob3N0bmFtZSwgdXJsLnBhdGhuYW1lKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBdHRhY2ggY29va2llcyB3aGVuIGF2YWlsYWJsZSB0byB0aGUgZ2l2ZW4gYHJlcWAuXG4gKlxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkFnZW50LnByb3RvdHlwZS5fYXR0YWNoQ29va2llcyA9IGZ1bmN0aW9uIChyZXF1ZXN0Xykge1xuICBjb25zdCB1cmwgPSBwYXJzZShyZXF1ZXN0Xy51cmwpO1xuICBjb25zdCBhY2Nlc3MgPSBuZXcgQ29va2llQWNjZXNzSW5mbyhcbiAgICB1cmwuaG9zdG5hbWUsXG4gICAgdXJsLnBhdGhuYW1lLFxuICAgIHVybC5wcm90b2NvbCA9PT0gJ2h0dHBzOidcbiAgKTtcbiAgY29uc3QgY29va2llcyA9IHRoaXMuamFyLmdldENvb2tpZXMoYWNjZXNzKS50b1ZhbHVlU3RyaW5nKCk7XG4gIHJlcXVlc3RfLmNvb2tpZXMgPSBjb29raWVzO1xufTtcblxuZm9yIChjb25zdCBuYW1lIG9mIG1ldGhvZHMpIHtcbiAgY29uc3QgbWV0aG9kID0gbmFtZS50b1VwcGVyQ2FzZSgpO1xuICBBZ2VudC5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAodXJsLCBmbikge1xuICAgIGNvbnN0IHJlcXVlc3RfID0gbmV3IHJlcXVlc3QuUmVxdWVzdChtZXRob2QsIHVybCk7XG5cbiAgICByZXF1ZXN0Xy5vbigncmVzcG9uc2UnLCB0aGlzLl9zYXZlQ29va2llcy5iaW5kKHRoaXMpKTtcbiAgICByZXF1ZXN0Xy5vbigncmVkaXJlY3QnLCB0aGlzLl9zYXZlQ29va2llcy5iaW5kKHRoaXMpKTtcbiAgICByZXF1ZXN0Xy5vbigncmVkaXJlY3QnLCB0aGlzLl9hdHRhY2hDb29raWVzLmJpbmQodGhpcywgcmVxdWVzdF8pKTtcbiAgICB0aGlzLl9zZXREZWZhdWx0cyhyZXF1ZXN0Xyk7XG4gICAgdGhpcy5fYXR0YWNoQ29va2llcyhyZXF1ZXN0Xyk7XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIHJlcXVlc3RfLmVuZChmbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcXVlc3RfO1xuICB9O1xufVxuXG5BZ2VudC5wcm90b3R5cGUuZGVsID0gQWdlbnQucHJvdG90eXBlLmRlbGV0ZTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBa0JBLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFBeEJDLEtBQUssWUFBTEEsS0FBSztBQUNiLGtCQUFzQkQsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUFsQ0UsU0FBUyxhQUFUQSxTQUFTO0FBQ2pCLGtCQUE2QkYsT0FBTyxDQUFDLFdBQVcsQ0FBQztFQUF6Q0csZ0JBQWdCLGFBQWhCQSxnQkFBZ0I7QUFDeEIsTUFBTUMsT0FBTyxHQUFHSixPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ2xDLE1BQU1LLE9BQU8sR0FBR0wsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNoQyxNQUFNTSxTQUFTLEdBQUdOLE9BQU8sQ0FBQyxlQUFlLENBQUM7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQU8sTUFBTSxDQUFDQyxPQUFPLEdBQUdDLEtBQUs7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0EsS0FBSyxDQUFDQyxPQUFPLEVBQUU7RUFDdEIsSUFBSSxFQUFFLElBQUksWUFBWUQsS0FBSyxDQUFDLEVBQUU7SUFDNUIsT0FBTyxJQUFJQSxLQUFLLENBQUNDLE9BQU8sQ0FBQztFQUMzQjtFQUVBSixTQUFTLENBQUNLLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDcEIsSUFBSSxDQUFDQyxHQUFHLEdBQUcsSUFBSVYsU0FBUyxFQUFFO0VBRTFCLElBQUlR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

/***/ }),

/***/ 3554:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const Stream = __nccwpck_require__(2781);
const util = __nccwpck_require__(3837);
const net = __nccwpck_require__(1808);
const tls = __nccwpck_require__(4404);
// eslint-disable-next-line node/no-deprecated-api
const _require = __nccwpck_require__(7310),
  parse = _require.parse;
const process = __nccwpck_require__(7282);
const semverGte = __nccwpck_require__(5522);
let http2;
if (semverGte(process.version, 'v10.10.0')) http2 = __nccwpck_require__(5158);else throw new Error('superagent: this version of Node.js does not support http2');
const _http2$constants = http2.constants,
  HTTP2_HEADER_PATH = _http2$constants.HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS = _http2$constants.HTTP2_HEADER_STATUS,
  HTTP2_HEADER_METHOD = _http2$constants.HTTP2_HEADER_METHOD,
  HTTP2_HEADER_AUTHORITY = _http2$constants.HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_HOST = _http2$constants.HTTP2_HEADER_HOST,
  HTTP2_HEADER_SET_COOKIE = _http2$constants.HTTP2_HEADER_SET_COOKIE,
  NGHTTP2_CANCEL = _http2$constants.NGHTTP2_CANCEL;
function setProtocol(protocol) {
  return {
    request(options) {
      return new Request(protocol, options);
    }
  };
}
function Request(protocol, options) {
  Stream.call(this);
  const defaultPort = protocol === 'https:' ? 443 : 80;
  const defaultHost = 'localhost';
  const port = options.port || defaultPort;
  const host = options.host || defaultHost;
  delete options.port;
  delete options.host;
  this.method = options.method;
  this.path = options.path;
  this.protocol = protocol;
  this.host = host;
  delete options.method;
  delete options.path;
  const sessionOptions = _objectSpread({}, options);
  if (options.socketPath) {
    sessionOptions.socketPath = options.socketPath;
    sessionOptions.createConnection = this.createUnixConnection.bind(this);
  }
  this._headers = {};
  const session = http2.connect(`${protocol}//${host}:${port}`, sessionOptions);
  this.setHeader('host', `${host}:${port}`);
  session.on('error', error => this.emit('error', error));
  this.session = session;
}

/**
 * Inherit from `Stream` (which inherits from `EventEmitter`).
 */
util.inherits(Request, Stream);
Request.prototype.createUnixConnection = function (authority, options) {
  switch (this.protocol) {
    case 'http:':
      return net.connect(options.socketPath);
    case 'https:':
      options.ALPNProtocols = ['h2'];
      options.servername = this.host;
      options.allowHalfOpen = true;
      return tls.connect(options.socketPath, options);
    default:
      throw new Error('Unsupported protocol', this.protocol);
  }
};
Request.prototype.setNoDelay = function (bool) {
  // We can not use setNoDelay with HTTP/2.
  // Node 10 limits http2session.socket methods to ones safe to use with HTTP/2.
  // See also https://nodejs.org/api/http2.html#http2_http2session_socket
};
Request.prototype.getFrame = function () {
  if (this.frame) {
    return this.frame;
  }
  const method = {
    [HTTP2_HEADER_PATH]: this.path,
    [HTTP2_HEADER_METHOD]: this.method
  };
  let headers = this.mapToHttp2Header(this._headers);
  headers = Object.assign(headers, method);
  const frame = this.session.request(headers);
  frame.once('response', (headers, flags) => {
    headers = this.mapToHttpHeader(headers);
    frame.headers = headers;
    frame.statusCode = headers[HTTP2_HEADER_STATUS];
    frame.status = frame.statusCode;
    this.emit('response', frame);
  });
  this._headerSent = true;
  frame.once('drain', () => this.emit('drain'));
  frame.on('error', error => this.emit('error', error));
  frame.on('close', () => this.session.close());
  this.frame = frame;
  return frame;
};
Request.prototype.mapToHttpHeader = function (headers) {
  const keys = Object.keys(headers);
  const http2Headers = {};
  for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
    let key = _keys[_i];
    let value = headers[key];
    key = key.toLowerCase();
    switch (key) {
      case HTTP2_HEADER_SET_COOKIE:
        value = Array.isArray(value) ? value : [value];
        break;
      default:
        break;
    }
    http2Headers[key] = value;
  }
  return http2Headers;
};
Request.prototype.mapToHttp2Header = function (headers) {
  const keys = Object.keys(headers);
  const http2Headers = {};
  for (var _i2 = 0, _keys2 = keys; _i2 < _keys2.length; _i2++) {
    let key = _keys2[_i2];
    let value = headers[key];
    key = key.toLowerCase();
    switch (key) {
      case HTTP2_HEADER_HOST:
        key = HTTP2_HEADER_AUTHORITY;
        value = /^http:\/\/|^https:\/\//.test(value) ? parse(value).host : value;
        break;
      default:
        break;
    }
    http2Headers[key] = value;
  }
  return http2Headers;
};
Request.prototype.setHeader = function (name, value) {
  this._headers[name.toLowerCase()] = value;
};
Request.prototype.getHeader = function (name) {
  return this._headers[name.toLowerCase()];
};
Request.prototype.write = function (data, encoding) {
  const frame = this.getFrame();
  return frame.write(data, encoding);
};
Request.prototype.pipe = function (stream, options) {
  const frame = this.getFrame();
  return frame.pipe(stream, options);
};
Request.prototype.end = function (data) {
  const frame = this.getFrame();
  frame.end(data);
};
Request.prototype.abort = function (data) {
  const frame = this.getFrame();
  frame.close(NGHTTP2_CANCEL);
  this.session.destroy();
};
exports.setProtocol = setProtocol;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdHJlYW0iLCJyZXF1aXJlIiwidXRpbCIsIm5ldCIsInRscyIsInBhcnNlIiwicHJvY2VzcyIsInNlbXZlckd0ZSIsImh0dHAyIiwidmVyc2lvbiIsIkVycm9yIiwiY29uc3RhbnRzIiwiSFRUUDJfSEVBREVSX1BBVEgiLCJIVFRQMl9IRUFERVJfU1RBVFVTIiwiSFRUUDJfSEVBREVSX01FVEhPRCIsIkhUVFAyX0hFQURFUl9BVVRIT1JJVFkiLCJIVFRQMl9IRUFERVJfSE9TVCIsIkhUVFAyX0hFQURFUl9TRVRfQ09PS0lFIiwiTkdIVFRQMl9DQU5DRUwiLCJzZXRQcm90b2NvbCIsInByb3RvY29sIiwicmVxdWVzdCIsIm9wdGlvbnMiLCJSZXF1ZXN0IiwiY2FsbCIsImRlZmF1bHRQb3J0IiwiZGVmYXVsdEhvc3QiLCJwb3J0IiwiaG9zdCIsIm1ldGhvZCIsInBhdGgiLCJzZXNzaW9uT3B0aW9ucyIsInNvY2tldFBhdGgiLCJjcmVhdGVDb25uZWN0aW9uIiwiY3JlYXRlVW5peENvbm5lY3Rpb24iLCJiaW5kIiwiX2hlYWRlcnMiLCJzZXNzaW9uIiwiY29ubmVjdCIsInNldEhlYWRlciIsIm9uIiwiZXJyb3IiLCJlbWl0IiwiaW5oZXJpdHMiLCJwcm90b3R5cGUiLCJhdXRob3JpdHkiLCJBTFBOUHJvdG9jb2xzIiwic2VydmVybmFtZSIsImFsbG93SGFsZk9wZW4iLCJzZXROb0RlbGF5IiwiYm9vbCIsImdldEZyYW1lIiwiZnJhbWUiLCJoZWFkZXJzIiwibWFwVG9IdHRwMkhlYWRlciIsIk9iamVjdCIsImFzc2lnbiIsIm9uY2UiLCJmbGFncyIsIm1hcFRvSHR0cEhlYWRlciIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJfaGVhZGVyU2VudCIsImNsb3NlIiwia2V5cyIsImh0dHAySGVhZGVycyIsImtleSIsInZhbHVlIiwidG9Mb3dlckNhc2UiLCJBcnJheSIsImlzQXJyYXkiLCJ0ZXN0IiwibmFtZSIsImdldEhlYWRlciIsIndyaXRlIiwiZGF0YSIsImVuY29kaW5nIiwicGlwZSIsInN0cmVhbSIsImVuZCIsImFib3J0IiwiZGVzdHJveSIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS9odHRwMndyYXBwZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgbmV0ID0gcmVxdWlyZSgnbmV0Jyk7XG5jb25zdCB0bHMgPSByZXF1aXJlKCd0bHMnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpXG5jb25zdCB7IHBhcnNlIH0gPSByZXF1aXJlKCd1cmwnKTtcbmNvbnN0IHByb2Nlc3MgPSByZXF1aXJlKCdwcm9jZXNzJyk7XG5jb25zdCBzZW12ZXJHdGUgPSByZXF1aXJlKCdzZW12ZXIvZnVuY3Rpb25zL2d0ZScpO1xuXG5sZXQgaHR0cDI7XG5cbmlmIChzZW12ZXJHdGUocHJvY2Vzcy52ZXJzaW9uLCAndjEwLjEwLjAnKSkgaHR0cDIgPSByZXF1aXJlKCdodHRwMicpO1xuZWxzZVxuICB0aHJvdyBuZXcgRXJyb3IoJ3N1cGVyYWdlbnQ6IHRoaXMgdmVyc2lvbiBvZiBOb2RlLmpzIGRvZXMgbm90IHN1cHBvcnQgaHR0cDInKTtcblxuY29uc3Qge1xuICBIVFRQMl9IRUFERVJfUEFUSCxcbiAgSFRUUDJfSEVBREVSX1NUQVRVUyxcbiAgSFRUUDJfSEVBREVSX01FVEhPRCxcbiAgSFRUUDJfSEVBREVSX0FVVEhPUklUWSxcbiAgSFRUUDJfSEVBREVSX0hPU1QsXG4gIEhUVFAyX0hFQURFUl9TRVRfQ09PS0lFLFxuICBOR0hUVFAyX0NBTkNFTFxufSA9IGh0dHAyLmNvbnN0YW50cztcblxuZnVuY3Rpb24gc2V0UHJvdG9jb2wocHJvdG9jb2wpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgUmVxdWVzdChwcm90b2NvbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBSZXF1ZXN0KHByb3RvY29sLCBvcHRpb25zKSB7XG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xuICBjb25zdCBkZWZhdWx0UG9ydCA9IHByb3RvY29sID09PSAnaHR0cHM6JyA/IDQ0MyA6IDgwO1xuICBjb25zdCBkZWZhdWx0SG9zdCA9ICdsb2NhbGhvc3QnO1xuICBjb25zdCBwb3J0ID0gb3B0aW9ucy5wb3J0IHx8IGRlZmF1bHRQb3J0O1xuICBjb25zdCBob3N0ID0gb3B0aW9ucy5ob3N0IHx8IGRlZmF1bHRIb3N0O1xuXG4gIGRlbGV0ZSBvcHRpb25zLnBvcnQ7XG4gIGRlbGV0ZSBvcHRpb25zLmhvc3Q7XG5cbiAgdGhpcy5tZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcbiAgdGhpcy5wYXRoID0gb3B0aW9ucy5wYXRoO1xuICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2w7XG4gIHRoaXMuaG9zdCA9IGhvc3Q7XG5cbiAgZGVsZXRlIG9wdGlvbnMubWV0aG9kO1xuICBkZWxldGUgb3B0aW9ucy5wYXRoO1xuXG4gIGNvbnN0IHNlc3Npb25PcHRpb25zID0geyAuLi5vcHRpb25zIH07XG4gIGlmIChvcHRpb25zLnNvY2tldFBhdGgpIHtcbiAgICBzZXNzaW9uT3B0aW9ucy5zb2NrZXRQYXRoID0gb3B0aW9ucy5zb2NrZXRQYXRoO1xuICAgIHNlc3Npb25PcHRpb25zLmNyZWF0ZUNvbm5lY3Rpb24gPSB0aGlzLmNyZWF0ZVVuaXhDb25uZWN0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICB0aGlzLl9oZWFkZXJzID0ge307XG5cbiAgY29uc3Qgc2Vzc2lvbiA9IGh0dHAyLmNvbm5lY3QoYCR7cHJvdG9jb2x9Ly8ke2hvc3R9OiR7cG9ydH1gLCBzZXNzaW9uT3B0aW9ucyk7XG4gIHRoaXMuc2V0SGVhZGVyKCdob3N0JywgYCR7aG9zdH06JHtwb3J0fWApO1xuXG4gIHNlc3Npb24ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpKTtcblxuICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xufVxuXG4vKipcbiAqIEluaGVyaXQgZnJvbSBgU3RyZWFtYCAod2hpY2ggaW5oZXJpdHMgZnJvbSBgRXZlbnRFbWl0dGVyYCkuXG4gKi9cbnV0aWwuaW5oZXJpdHMoUmVxdWVzdCwgU3RyZWFtKTtcblxuUmVxdWVzdC5wcm90b3R5cGUuY3JlYXRlVW5peENvbm5lY3Rpb24gPSBmdW5jdGlvbiAoYXV0aG9yaXR5LCBvcHRpb25zKSB7XG4gIHN3aXRjaCAodGhpcy5wcm90b2NvbCkge1xuICAgIGNhc2UgJ2h0dHA6JzpcbiAgICAgIHJldHVybiBuZXQuY29ubmVjdChvcHRpb25zLnNvY2tldFBhdGgpO1xuICAgIGNhc2UgJ2h0dHBzOic6XG4gICAgICBvcHRpb25zLkFMUE5Qcm90b2NvbHMgPSBbJ2gyJ107XG4gICAgICBvcHRpb25zLnNlcnZlcm5hbWUgPSB0aGlzLmhvc3Q7XG4gICAgICBvcHRpb25zLmFsbG93SGFsZk9wZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRscy5jb25uZWN0KG9wdGlvbnMuc29ja2V0UGF0aCwgb3B0aW9ucyk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgcHJvdG9jb2wnLCB0aGlzLnByb3RvY29sKTtcbiAgfVxufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuc2V0Tm9EZWxheSA9IGZ1bmN0aW9uIChib29sKSB7XG4gIC8vIFdlIGNhbiBub3QgdXNlIHNldE5vRGVsYXkgd2l0aCBIVFRQLzIuXG4gIC8vIE5vZGUgMTAgbGltaXRzIGh0dHAyc2Vzc2lvbi5zb2NrZXQgbWV0aG9kcyB0byBvbmVzIHNhZmUgdG8gdXNlIHdpdGggSFRUUC8yLlxuICAvLyBTZWUgYWxzbyBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAyLmh0bWwjaHR0cDJfaHR0cDJzZXNzaW9uX3NvY2tldFxufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuZ2V0RnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmZyYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJhbWU7XG4gIH1cblxuICBjb25zdCBtZXRob2QgPSB7XG4gICAgW0hUVFAyX0hFQURFUl9QQVRIXTogdGhpcy5wYXRoLFxuICAgIFtIVFRQMl9IRUFERVJfTUVUSE9EXTogdGhpcy5tZXRob2RcbiAgfTtcblxuICBsZXQgaGVhZGVycyA9IHRoaXMubWFwVG9IdHRwMkhlYWRlcih0aGlzLl9oZWFkZXJzKTtcblxuICBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbihoZWFkZXJzLCBtZXRob2QpO1xuXG4gIGNvbnN0IGZyYW1lID0gdGhpcy5zZXNzaW9uLnJlcXVlc3QoaGVhZGVycyk7XG5cbiAgZnJhbWUub25jZSgncmVzcG9uc2UnLCAoaGVhZGVycywgZmxhZ3MpID0+IHtcbiAgICBoZWFkZXJzID0gdGhpcy5tYXBUb0h0dHBIZWFkZXIoaGVhZGVycyk7XG4gICAgZnJhbWUuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgZnJhbWUuc3RhdHVzQ29kZSA9IGhlYWRlcnNbSFRUUDJfSEVBREVSX1NUQVRVU107XG4gICAgZnJhbWUuc3RhdHVzID0gZnJhbWUuc3RhdHVzQ29kZTtcbiAgICB0aGlzLmVtaXQoJ3Jlc3BvbnNlJywgZnJhbWUpO1xuICB9KTtcblxuICB0aGlzLl9oZWFkZXJTZW50ID0gdHJ1ZTtcblxuICBmcmFtZS5vbmNlKCdkcmFpbicsICgpID0+IHRoaXMuZW1pdCgnZHJhaW4nKSk7XG4gIGZyYW1lLm9uKCdlcnJvcicsIChlcnJvcikgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKSk7XG4gIGZyYW1lLm9uKCdjbG9zZScsICgpID0+IHRoaXMuc2Vzc2lvbi5jbG9zZSgpKTtcblxuICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIHJldHVybiBmcmFtZTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLm1hcFRvSHR0cEhlYWRlciA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKTtcbiAgY29uc3QgaHR0cDJIZWFkZXJzID0ge307XG4gIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG4gICAgbGV0IHZhbHVlID0gaGVhZGVyc1trZXldO1xuICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIEhUVFAyX0hFQURFUl9TRVRfQ09PS0lFOlxuICAgICAgICB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGh0dHAySGVhZGVyc1trZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gaHR0cDJIZWFkZXJzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUubWFwVG9IdHRwMkhlYWRlciA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKTtcbiAgY29uc3QgaHR0cDJIZWFkZXJzID0ge307XG4gIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG4gICAgbGV0IHZhbHVlID0gaGVhZGVyc1trZXldO1xuICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIEhUVFAyX0hFQURFUl9IT1NUOlxuICAgICAgICBrZXkgPSBIVFRQMl9IRUFERVJfQVVUSE9SSVRZO1xuICAgICAgICB2YWx1ZSA9IC9eaHR0cDpcXC9cXC98Xmh0dHBzOlxcL1xcLy8udGVzdCh2YWx1ZSlcbiAgICAgICAgICA/IHBhcnNlKHZhbHVlKS5ob3N0XG4gICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBodHRwMkhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGh0dHAySGVhZGVycztcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLnNldEhlYWRlciA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV0gPSB2YWx1ZTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV07XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZykge1xuICBjb25zdCBmcmFtZSA9IHRoaXMuZ2V0RnJhbWUoKTtcbiAgcmV0dXJuIGZyYW1lLndyaXRlKGRhdGEsIGVuY29kaW5nKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoc3RyZWFtLCBvcHRpb25zKSB7XG4gIGNvbnN0IGZyYW1lID0gdGhpcy5nZXRGcmFtZSgpO1xuICByZXR1cm4gZnJhbWUucGlwZShzdHJlYW0sIG9wdGlvbnMpO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgY29uc3QgZnJhbWUgPSB0aGlzLmdldEZyYW1lKCk7XG4gIGZyYW1lLmVuZChkYXRhKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgY29uc3QgZnJhbWUgPSB0aGlzLmdldEZyYW1lKCk7XG4gIGZyYW1lLmNsb3NlKE5HSFRUUDJfQ0FOQ0VMKTtcbiAgdGhpcy5zZXNzaW9uLmRlc3Ryb3koKTtcbn07XG5cbmV4cG9ydHMuc2V0UHJvdG9jb2wgPSBzZXRQcm90b2NvbDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE1BQU1BLE1BQU0sR0FBR0MsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNoQyxNQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDNUIsTUFBTUUsR0FBRyxHQUFHRixPQUFP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

/***/ }),

/***/ 1524:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Module dependencies.
 */

// eslint-disable-next-line node/no-deprecated-api
const _require = __nccwpck_require__(7310),
  parse = _require.parse,
  format = _require.format,
  resolve = _require.resolve;
const Stream = __nccwpck_require__(2781);
const https = __nccwpck_require__(5687);
const http = __nccwpck_require__(3685);
const fs = __nccwpck_require__(7147);
const zlib = __nccwpck_require__(9796);
const util = __nccwpck_require__(3837);
const qs = __nccwpck_require__(2760);
const mime = __nccwpck_require__(9994);
let methods = __nccwpck_require__(8752);
const FormData = __nccwpck_require__(1826);
const formidable = __nccwpck_require__(5706);
const debug = __nccwpck_require__(8237)('superagent');
const CookieJar = __nccwpck_require__(5507);
const semverGte = __nccwpck_require__(5522);
const safeStringify = __nccwpck_require__(7676);
const utils = __nccwpck_require__(5523);
const RequestBase = __nccwpck_require__(9723);
const _require2 = __nccwpck_require__(7060),
  unzip = _require2.unzip;
const Response = __nccwpck_require__(9660);
const mixin = utils.mixin,
  hasOwn = utils.hasOwn;
let http2;
if (semverGte(process.version, 'v10.10.0')) http2 = __nccwpck_require__(3554);
function request(method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }
  return new exports.Request(method, url);
}
module.exports = request;
exports = module.exports;

/**
 * Expose `Request`.
 */

exports.Request = Request;

/**
 * Expose the agent function
 */

exports.agent = __nccwpck_require__(4816);

/**
 * Noop.
 */

function noop() {}

/**
 * Expose `Response`.
 */

exports.Response = Response;

/**
 * Define "form" mime type.
 */

mime.define({
  'application/x-www-form-urlencoded': ['form', 'urlencoded', 'form-data']
}, true);

/**
 * Protocol map.
 */

exports.protocols = {
  'http:': http,
  'https:': https,
  'http2:': http2
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

exports.serialize = {
  'application/x-www-form-urlencoded': qs.stringify,
  'application/json': safeStringify
};

/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(res, fn){
 *       fn(null, res);
 *     };
 *
 */

exports.parse = __nccwpck_require__(913);

/**
 * Default buffering map. Can be used to set certain
 * response types to buffer/not buffer.
 *
 *     superagent.buffer['application/xml'] = true;
 */
exports.buffer = {};

/**
 * Initialize internal header tracking properties on a request instance.
 *
 * @param {Object} req the instance
 * @api private
 */
function _initHeaders(request_) {
  request_._header = {
    // coerces header names to lowercase
  };
  request_.header = {
    // preserves header name case
  };
}

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String|Object} url
 * @api public
 */

function Request(method, url) {
  Stream.call(this);
  if (typeof url !== 'string') url = format(url);
  this._enableHttp2 = Boolean(process.env.HTTP2_TEST); // internal only
  this._agent = false;
  this._formData = null;
  this.method = method;
  this.url = url;
  _initHeaders(this);
  this.writable = true;
  this._redirects = 0;
  this.redirects(method === 'HEAD' ? 0 : 5);
  this.cookies = '';
  this.qs = {};
  this._query = [];
  this.qsRaw = this._query; // Unused, for backwards compatibility only
  this._redirectList = [];
  this._streamRequest = false;
  this._lookup = undefined;
  this.once('end', this.clearTimeout.bind(this));
}

/**
 * Inherit from `Stream` (which inherits from `EventEmitter`).
 * Mixin `RequestBase`.
 */
util.inherits(Request, Stream);
mixin(Request.prototype, RequestBase.prototype);

/**
 * Enable or Disable http2.
 *
 * Enable http2.
 *
 * ``` js
 * request.get('http://localhost/')
 *   .http2()
 *   .end(callback);
 *
 * request.get('http://localhost/')
 *   .http2(true)
 *   .end(callback);
 * ```
 *
 * Disable http2.
 *
 * ``` js
 * request = request.http2();
 * request.get('http://localhost/')
 *   .http2(false)
 *   .end(callback);
 * ```
 *
 * @param {Boolean} enable
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.http2 = function (bool) {
  if (exports.protocols['http2:'] === undefined) {
    throw new Error('superagent: this version of Node.js does not support http2');
  }
  this._enableHttp2 = bool === undefined ? true : bool;
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('http://localhost/upload')
 *   .attach('field', Buffer.from('<b>Hello world</b>'), 'hello.html')
 *   .end(callback);
 * ```
 *
 * A filename may also be used:
 *
 * ``` js
 * request.post('http://localhost/upload')
 *   .attach('files', 'image.jpg')
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {String|fs.ReadStream|Buffer} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }
    let o = options || {};
    if (typeof options === 'string') {
      o = {
        filename: options
      };
    }
    if (typeof file === 'string') {
      if (!o.filename) o.filename = file;
      debug('creating `fs.ReadStream` instance for file: %s', file);
      file = fs.createReadStream(file);
      file.on('error', error => {
        const formData = this._getFormData();
        formData.emit('error', error);
      });
    } else if (!o.filename && file.path) {
      o.filename = file.path;
    }
    this._getFormData().append(field, file, o);
  }
  return this;
};
Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new FormData();
    this._formData.on('error', error => {
      debug('FormData error', error);
      if (this.called) {
        // The request has already finished and the callback was called.
        // Silently ignore the error.
        return;
      }
      this.callback(error);
      this.abort();
    });
  }
  return this._formData;
};

/**
 * Gets/sets the `Agent` to use for this HTTP request. The default (if this
 * function is not called) is to opt out of connection pooling (`agent: false`).
 *
 * @param {http.Agent} agent
 * @return {http.Agent}
 * @api public
 */

Request.prototype.agent = function (agent) {
  if (arguments.length === 0) return this._agent;
  this._agent = agent;
  return this;
};

/**
 * Gets/sets the `lookup` function to use custom DNS resolver.
 *
 * @param {Function} lookup
 * @return {Function}
 * @api public
 */

Request.prototype.lookup = function (lookup) {
  if (arguments.length === 0) return this._lookup;
  this._lookup = lookup;
  return this;
};

/**
 * Set _Content-Type_ response header passed through `mime.getType()`.
 *
 * Examples:
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  return this.set('Content-Type', type.includes('/') ? type : mime.getType(type));
};

/**
 * Set _Accept_ response header passed through `mime.getType()`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function (type) {
  return this.set('Accept', type.includes('/') ? type : mime.getType(type));
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function (value) {
  if (typeof value === 'string') {
    this._query.push(value);
  } else {
    Object.assign(this.qs, value);
  }
  return this;
};

/**
 * Write raw `data` / `encoding` to the socket.
 *
 * @param {Buffer|String} data
 * @param {String} encoding
 * @return {Boolean}
 * @api public
 */

Request.prototype.write = function (data, encoding) {
  const request_ = this.request();
  if (!this._streamRequest) {
    this._streamRequest = true;
  }
  return request_.write(data, encoding);
};

/**
 * Pipe the request body to `stream`.
 *
 * @param {Stream} stream
 * @param {Object} options
 * @return {Stream}
 * @api public
 */

Request.prototype.pipe = function (stream, options) {
  this.piped = true; // HACK...
  this.buffer(false);
  this.end();
  return this._pipeContinue(stream, options);
};
Request.prototype._pipeContinue = function (stream, options) {
  this.req.once('response', res => {
    // redirect
    if (isRedirect(res.statusCode) && this._redirects++ !== this._maxRedirects) {
      return this._redirect(res) === this ? this._pipeContinue(stream, options) : undefined;
    }
    this.res = res;
    this._emitResponse();
    if (this._aborted) return;
    if (this._shouldUnzip(res)) {
      const unzipObject = zlib.createUnzip();
      unzipObject.on('error', error => {
        if (error && error.code === 'Z_BUF_ERROR') {
          // unexpected end of file is ignored by browsers and curl
          stream.emit('end');
          return;
        }
        stream.emit('error', error);
      });
      res.pipe(unzipObject).pipe(stream, options);
    } else {
      res.pipe(stream, options);
    }
    res.once('end', () => {
      this.emit('end');
    });
  });
  return stream;
};

/**
 * Enable / disable buffering.
 *
 * @return {Boolean} [val]
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.buffer = function (value) {
  this._buffer = value !== false;
  return this;
};

/**
 * Redirect to `url
 *
 * @param {IncomingMessage} res
 * @return {Request} for chaining
 * @api private
 */

Request.prototype._redirect = function (res) {
  let url = res.headers.location;
  if (!url) {
    return this.callback(new Error('No location header for redirect'), res);
  }
  debug('redirect %s -> %s', this.url, url);

  // location
  url = resolve(this.url, url);

  // ensure the response is being consumed
  // this is required for Node v0.10+
  res.resume();
  let headers = this.req.getHeaders ? this.req.getHeaders() : this.req._headers;
  const changesOrigin = parse(url).host !== parse(this.url).host;

  // implementation of 302 following defacto standard
  if (res.statusCode === 301 || res.statusCode === 302) {
    // strip Content-* related fields
    // in case of POST etc
    headers = utils.cleanHeader(headers, changesOrigin);

    // force GET
    this.method = this.method === 'HEAD' ? 'HEAD' : 'GET';

    // clear data
    this._data = null;
  }

  // 303 is always GET
  if (res.statusCode === 303) {
    // strip Content-* related fields
    // in case of POST etc
    headers = utils.cleanHeader(headers, changesOrigin);

    // force method
    this.method = 'GET';

    // clear data
    this._data = null;
  }

  // 307 preserves method
  // 308 preserves method
  delete headers.host;
  delete this.req;
  delete this._formData;

  // remove all add header except User-Agent
  _initHeaders(this);

  // redirect
  this._endCalled = false;
  this.url = url;
  this.qs = {};
  this._query.length = 0;
  this.set(headers);
  this.emit('redirect', res);
  this._redirectList.push(this.url);
  this.end(this._callback);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * Examples:
 *
 *   .auth('tobi', 'learnboost')
 *   .auth('tobi:learnboost')
 *   .auth('tobi')
 *   .auth(accessToken, { type: 'bearer' })
 *
 * @param {String} user
 * @param {String} [pass]
 * @param {Object} [options] options with authorization type 'basic' or 'bearer' ('basic' is default)
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';
  if (typeof pass === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'basic'
    };
  }
  const encoder = string => Buffer.from(string).toString('base64');
  return this._auth(user, pass, options, encoder);
};

/**
 * Set the certificate authority option for https request.
 *
 * @param {Buffer | Array} cert
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.ca = function (cert) {
  this._ca = cert;
  return this;
};

/**
 * Set the client certificate key option for https request.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.key = function (cert) {
  this._key = cert;
  return this;
};

/**
 * Set the key, certificate, and CA certs of the client in PFX or PKCS12 format.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.pfx = function (cert) {
  if (typeof cert === 'object' && !Buffer.isBuffer(cert)) {
    this._pfx = cert.pfx;
    this._passphrase = cert.passphrase;
  } else {
    this._pfx = cert;
  }
  return this;
};

/**
 * Set the client certificate option for https request.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.cert = function (cert) {
  this._cert = cert;
  return this;
};

/**
 * Do not reject expired or invalid TLS certs.
 * sets `rejectUnauthorized=true`. Be warned that this allows MITM attacks.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.disableTLSCerts = function () {
  this._disableTLSCerts = true;
  return this;
};

/**
 * Return an http[s] request.
 *
 * @return {OutgoingMessage}
 * @api private
 */

// eslint-disable-next-line complexity
Request.prototype.request = function () {
  if (this.req) return this.req;
  const options = {};
  try {
    const query = qs.stringify(this.qs, {
      indices: false,
      strictNullHandling: true
    });
    if (query) {
      this.qs = {};
      this._query.push(query);
    }
    this._finalizeQueryString();
  } catch (err) {
    return this.emit('error', err);
  }
  let url = this.url;
  const retries = this._retries;

  // Capture backticks as-is from the final query string built above.
  // Note: this'll only find backticks entered in req.query(String)
  // calls, because qs.stringify unconditionally encodes backticks.
  let queryStringBackticks;
  if (url.includes('`')) {
    const queryStartIndex = url.indexOf('?');
    if (queryStartIndex !== -1) {
      const queryString = url.slice(queryStartIndex + 1);
      queryStringBackticks = queryString.match(/`|%60/g);
    }
  }

  // default to http://
  if (url.indexOf('http') !== 0) url = `http://${url}`;
  url = parse(url);

  // See https://github.com/ladjs/superagent/issues/1367
  if (queryStringBackticks) {
    let i = 0;
    url.query = url.query.replace(/%60/g, () => queryStringBackticks[i++]);
    url.search = `?${url.query}`;
    url.path = url.pathname + url.search;
  }

  // support unix sockets
  if (/^https?\+unix:/.test(url.protocol) === true) {
    // get the protocol
    url.protocol = `${url.protocol.split('+')[0]}:`;

    // get the socket, path
    const unixParts = url.path.match(/^([^/]+)(.+)$/);
    options.socketPath = unixParts[1].replace(/%2F/g, '/');
    url.path = unixParts[2];
  }

  // Override IP address of a hostname
  if (this._connectOverride) {
    const _url = url,
      hostname = _url.hostname;
    const match = hostname in this._connectOverride ? this._connectOverride[hostname] : this._connectOverride['*'];
    if (match) {
      // backup the real host
      if (!this._header.host) {
        this.set('host', url.host);
      }
      let newHost;
      let newPort;
      if (typeof match === 'object') {
        newHost = match.host;
        newPort = match.port;
      } else {
        newHost = match;
        newPort = url.port;
      }

      // wrap [ipv6]
      url.host = /:/.test(newHost) ? `[${newHost}]` : newHost;
      if (newPort) {
        url.host += `:${newPort}`;
        url.port = newPort;
      }
      url.hostname = newHost;
    }
  }

  // options
  options.method = this.method;
  options.port = url.port;
  options.path = url.path;
  options.host = url.hostname;
  options.ca = this._ca;
  options.key = this._key;
  options.pfx = this._pfx;
  options.cert = this._cert;
  options.passphrase = this._passphrase;
  options.agent = this._agent;
  options.lookup = this._lookup;
  options.rejectUnauthorized = typeof this._disableTLSCerts === 'boolean' ? !this._disableTLSCerts : process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

  // Allows request.get('https://1.2.3.4/').set('Host', 'example.com')
  if (this._header.host) {
    options.servername = this._header.host.replace(/:\d+$/, '');
  }
  if (this._trustLocalhost && /^(?:localhost|127\.0\.0\.\d+|(0*:)+:0*1)$/.test(url.hostname)) {
    options.rejectUnauthorized = false;
  }

  // initiate request
  const module_ = this._enableHttp2 ? exports.protocols['http2:'].setProtocol(url.protocol) : exports.protocols[url.protocol];

  // request
  this.req = module_.request(options);
  const req = this.req;

  // set tcp no delay
  req.setNoDelay(true);
  if (options.method !== 'HEAD') {
    req.setHeader('Accept-Encoding', 'gzip, deflate');
  }
  this.protocol = url.protocol;
  this.host = url.host;

  // expose events
  req.once('drain', () => {
    this.emit('drain');
  });
  req.on('error', error => {
    // flag abortion here for out timeouts
    // because node will emit a faux-error "socket hang up"
    // when request is aborted before a connection is made
    if (this._aborted) return;
    // if not the same, we are in the **old** (cancelled) request,
    // so need to continue (same as for above)
    if (this._retries !== retries) return;
    // if we've received a response then we don't want to let
    // an error in the request blow up the response
    if (this.response) return;
    this.callback(error);
  });

  // auth
  if (url.auth) {
    const auth = url.auth.split(':');
    this.auth(auth[0], auth[1]);
  }
  if (this.username && this.password) {
    this.auth(this.username, this.password);
  }
  for (const key in this.header) {
    if (hasOwn(this.header, key)) req.setHeader(key, this.header[key]);
  }

  // add cookies
  if (this.cookies) {
    if (hasOwn(this._header, 'cookie')) {
      // merge
      const temporaryJar = new CookieJar.CookieJar();
      temporaryJar.setCookies(this._header.cookie.split(';'));
      temporaryJar.setCookies(this.cookies.split(';'));
      req.setHeader('Cookie', temporaryJar.getCookies(CookieJar.CookieAccessInfo.All).toValueString());
    } else {
      req.setHeader('Cookie', this.cookies);
    }
  }
  return req;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function (error, res) {
  if (this._shouldRetry(error, res)) {
    return this._retry();
  }

  // Avoid the error which is emitted from 'socket hang up' to cause the fn undefined error on JS runtime.
  const fn = this._callback || noop;
  this.clearTimeout();
  if (this.called) return console.warn('superagent: double callback bug');
  this.called = true;
  if (!error) {
    try {
      if (!this._isResponseOK(res)) {
        let message = 'Unsuccessful HTTP response';
        if (res) {
          message = http.STATUS_CODES[res.status] || message;
        }
        error = new Error(message);
        error.status = res ? res.status : undefined;
      }
    } catch (err) {
      error = err;
      error.status = error.status || (res ? res.status : undefined);
    }
  }

  // It's important that the callback is called outside try/catch
  // to avoid double callback
  if (!error) {
    return fn(null, res);
  }
  error.response = res;
  if (this._maxRetries) error.retries = this._retries - 1;

  // only emit error event if there is a listener
  // otherwise we assume the callback to `.end()` will get the error
  if (error && this.listeners('error').length > 0) {
    this.emit('error', error);
  }
  fn(error, res);
};

/**
 * Check if `obj` is a host object,
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */
Request.prototype._isHost = function (object) {
  return Buffer.isBuffer(object) || object instanceof Stream || object instanceof FormData;
};

/**
 * Initiate request, invoking callback `fn(err, res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype._emitResponse = function (body, files) {
  const response = new Response(this);
  this.response = response;
  response.redirects = this._redirectList;
  if (undefined !== body) {
    response.body = body;
  }
  response.files = files;
  if (this._endCalled) {
    response.pipe = function () {
      throw new Error("end() has already been called, so it's too late to start piping");
    };
  }
  this.emit('response', response);
  return response;
};
Request.prototype.end = function (fn) {
  this.request();
  debug('%s %s', this.method, this.url);
  if (this._endCalled) {
    throw new Error('.end() was called twice. This is not supported in superagent');
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;
  this._end();
};
Request.prototype._end = function () {
  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  let data = this._data;
  const req = this.req;
  const method = this.method;
  this._setTimeouts();

  // body
  if (method !== 'HEAD' && !req._headerSent) {
    // serialize stuff
    if (typeof data !== 'string') {
      let contentType = req.getHeader('Content-Type');
      // Parse out just the content type from the header (ignore the charset)
      if (contentType) contentType = contentType.split(';')[0];
      let serialize = this._serializer || exports.serialize[contentType];
      if (!serialize && isJSON(contentType)) {
        serialize = exports.serialize['application/json'];
      }
      if (serialize) data = serialize(data);
    }

    // content-length
    if (data && !req.getHeader('Content-Length')) {
      req.setHeader('Content-Length', Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
    }
  }

  // response
  // eslint-disable-next-line complexity
  req.once('response', res => {
    debug('%s %s -> %s', this.method, this.url, res.statusCode);
    if (this._responseTimeoutTimer) {
      clearTimeout(this._responseTimeoutTimer);
    }
    if (this.piped) {
      return;
    }
    const max = this._maxRedirects;
    const mime = utils.type(res.headers['content-type'] || '') || 'text/plain';
    let type = mime.split('/')[0];
    if (type) type = type.toLowerCase().trim();
    const multipart = type === 'multipart';
    const redirect = isRedirect(res.statusCode);
    const responseType = this._responseType;
    this.res = res;

    // redirect
    if (redirect && this._redirects++ !== max) {
      return this._redirect(res);
    }
    if (this.method === 'HEAD') {
      this.emit('end');
      this.callback(null, this._emitResponse());
      return;
    }

    // zlib support
    if (this._shouldUnzip(res)) {
      unzip(req, res);
    }
    let buffer = this._buffer;
    if (buffer === undefined && mime in exports.buffer) {
      buffer = Boolean(exports.buffer[mime]);
    }
    let parser = this._parser;
    if (undefined === buffer && parser) {
      console.warn("A custom superagent parser has been set, but buffering strategy for the parser hasn't been configured. Call `req.buffer(true or false)` or set `superagent.buffer[mime] = true or false`");
      buffer = true;
    }
    if (!parser) {
      if (responseType) {
        parser = exports.parse.image; // It's actually a generic Buffer
        buffer = true;
      } else if (multipart) {
        const form = formidable();
        parser = form.parse.bind(form);
        buffer = true;
      } else if (isBinary(mime)) {
        parser = exports.parse.image;
        buffer = true; // For backwards-compatibility buffering default is ad-hoc MIME-dependent
      } else if (exports.parse[mime]) {
        parser = exports.parse[mime];
      } else if (type === 'text') {
        parser = exports.parse.text;
        buffer = buffer !== false;
        // everyone wants their own white-labeled json
      } else if (isJSON(mime)) {
        parser = exports.parse['application/json'];
        buffer = buffer !== false;
      } else if (buffer) {
        parser = exports.parse.text;
      } else if (undefined === buffer) {
        parser = exports.parse.image; // It's actually a generic Buffer
        buffer = true;
      }
    }

    // by default only buffer text/*, json and messed up thing from hell
    if (undefined === buffer && isText(mime) || isJSON(mime)) {
      buffer = true;
    }
    this._resBuffered = buffer;
    let parserHandlesEnd = false;
    if (buffer) {
      // Protectiona against zip bombs and other nuisance
      let responseBytesLeft = this._maxResponseSize || 200000000;
      res.on('data', buf => {
        responseBytesLeft -= buf.byteLength || buf.length > 0 ? buf.length : 0;
        if (responseBytesLeft < 0) {
          // This will propagate through error event
          const error = new Error('Maximum response size reached');
          error.code = 'ETOOLARGE';
          // Parsers aren't required to observe error event,
          // so would incorrectly report success
          parserHandlesEnd = false;
          // Will not emit error event
          res.destroy(error);
          // so we do callback now
          this.callback(error, null);
        }
      });
    }
    if (parser) {
      try {
        // Unbuffered parsers are supposed to emit response early,
        // which is weird BTW, because response.body won't be there.
        parserHandlesEnd = buffer;
        parser(res, (error, object, files) => {
          if (this.timedout) {
            // Timeout has already handled all callbacks
            return;
          }

          // Intentional (non-timeout) abort is supposed to preserve partial response,
          // even if it doesn't parse.
          if (error && !this._aborted) {
            return this.callback(error);
          }
          if (parserHandlesEnd) {
            this.emit('end');
            this.callback(null, this._emitResponse(object, files));
          }
        });
      } catch (err) {
        this.callback(err);
        return;
      }
    }
    this.res = res;

    // unbuffered
    if (!buffer) {
      debug('unbuffered %s %s', this.method, this.url);
      this.callback(null, this._emitResponse());
      if (multipart) return; // allow multipart to handle end event
      res.once('end', () => {
        debug('end %s %s', this.method, this.url);
        this.emit('end');
      });
      return;
    }

    // terminating events
    res.once('error', error => {
      parserHandlesEnd = false;
      this.callback(error, null);
    });
    if (!parserHandlesEnd) res.once('end', () => {
      debug('end %s %s', this.method, this.url);
      // TODO: unless buffering emit earlier to stream
      this.emit('end');
      this.callback(null, this._emitResponse());
    });
  });
  this.emit('request', this);
  const getProgressMonitor = () => {
    const lengthComputable = true;
    const total = req.getHeader('Content-Length');
    let loaded = 0;
    const progress = new Stream.Transform();
    progress._transform = (chunk, encoding, callback) => {
      loaded += chunk.length;
      this.emit('progress', {
        direction: 'upload',
        lengthComputable,
        loaded,
        total
      });
      callback(null, chunk);
    };
    return progress;
  };
  const bufferToChunks = buffer => {
    const chunkSize = 16 * 1024; // default highWaterMark value
    const chunking = new Stream.Readable();
    const totalLength = buffer.length;
    const remainder = totalLength % chunkSize;
    const cutoff = totalLength - remainder;
    for (let i = 0; i < cutoff; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      chunking.push(chunk);
    }
    if (remainder > 0) {
      const remainderBuffer = buffer.slice(-remainder);
      chunking.push(remainderBuffer);
    }
    chunking.push(null); // no more data

    return chunking;
  };

  // if a FormData instance got created, then we send that as the request body
  const formData = this._formData;
  if (formData) {
    // set headers
    const headers = formData.getHeaders();
    for (const i in headers) {
      if (hasOwn(headers, i)) {
        debug('setting FormData header: "%s: %s"', i, headers[i]);
        req.setHeader(i, headers[i]);
      }
    }

    // attempt to get "Content-Length" header
    formData.getLength((error, length) => {
      // TODO: Add chunked encoding when no length (if err)
      if (error) debug('formData.getLength had error', error, length);
      debug('got FormData Content-Length: %s', length);
      if (typeof length === 'number') {
        req.setHeader('Content-Length', length);
      }
      formData.pipe(getProgressMonitor()).pipe(req);
    });
  } else if (Buffer.isBuffer(data)) {
    bufferToChunks(data).pipe(getProgressMonitor()).pipe(req);
  } else {
    req.end(data);
  }
};

// Check whether response has a non-0-sized gzip-encoded body
Request.prototype._shouldUnzip = res => {
  if (res.statusCode === 204 || res.statusCode === 304) {
    // These aren't supposed to have any body
    return false;
  }

  // header content is a string, and distinction between 0 and no information is crucial
  if (res.headers['content-length'] === '0') {
    // We know that the body is empty (unfortunately, this check does not cover chunked encoding)
    return false;
  }

  // console.log(res);
  return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
};

/**
 * Overrides DNS for selected hostnames. Takes object mapping hostnames to IP addresses.
 *
 * When making a request to a URL with a hostname exactly matching a key in the object,
 * use the given IP address to connect, instead of using DNS to resolve the hostname.
 *
 * A special host `*` matches every hostname (keep redirects in mind!)
 *
 *      request.connect({
 *        'test.example.com': '127.0.0.1',
 *        'ipv6.example.com': '::1',
 *      })
 */
Request.prototype.connect = function (connectOverride) {
  if (typeof connectOverride === 'string') {
    this._connectOverride = {
      '*': connectOverride
    };
  } else if (typeof connectOverride === 'object') {
    this._connectOverride = connectOverride;
  } else {
    this._connectOverride = undefined;
  }
  return this;
};
Request.prototype.trustLocalhost = function (toggle) {
  this._trustLocalhost = toggle === undefined ? true : toggle;
  return this;
};

// generate HTTP verb methods
if (!methods.includes('del')) {
  // create a copy so we don't cause conflicts with
  // other packages using the methods package and
  // npm 3.x
  methods = [...methods];
  methods.push('del');
}
var _iterator = _createForOfIteratorHelper(methods),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    let method = _step.value;
    const name = method;
    method = method === 'del' ? 'delete' : method;
    method = method.toUpperCase();
    request[name] = (url, data, fn) => {
      const request_ = request(method, url);
      if (typeof data === 'function') {
        fn = data;
        data = null;
      }
      if (data) {
        if (method === 'GET' || method === 'HEAD') {
          request_.query(data);
        } else {
          request_.send(data);
        }
      }
      if (fn) request_.end(fn);
      return request_;
    };
  }

  /**
   * Check if `mime` is text and should be buffered.
   *
   * @param {String} mime
   * @return {Boolean}
   * @api public
   */
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
function isText(mime) {
  const parts = mime.split('/');
  let type = parts[0];
  if (type) type = type.toLowerCase().trim();
  let subtype = parts[1];
  if (subtype) subtype = subtype.toLowerCase().trim();
  return type === 'text' || subtype === 'x-www-form-urlencoded';
}

// This is not a catchall, but a start. It might be useful
// in the long run to have file that includes all binary
// content types from https://www.iana.org/assignments/media-types/media-types.xhtml
function isBinary(mime) {
  let _mime$split = mime.split('/'),
    _mime$split2 = _slicedToArray(_mime$split, 2),
    registry = _mime$split2[0],
    name = _mime$split2[1];
  if (registry) registry = registry.toLowerCase().trim();
  if (name) name = name.toLowerCase().trim();
  return ['audio', 'font', 'image', 'video'].includes(registry) || ['gz', 'gzip'].includes(name);
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[/+]json($|[^-\w])/i.test(mime);
}

/**
 * Check if we should follow the redirect `code`.
 *
 * @param {Number} code
 * @return {Boolean}
 * @api private
 */

function isRedirect(code) {
  return [301, 302, 303, 305, 307, 308].includes(code);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXF1aXJlIiwicGFyc2UiLCJmb3JtYXQiLCJyZXNvbHZlIiwiU3RyZWFtIiwiaHR0cHMiLCJodHRwIiwiZnMiLCJ6bGliIiwidXRpbCIsInFzIiwibWltZSIsIm1ldGhvZHMiLCJGb3JtRGF0YSIsImZvcm1pZGFibGUiLCJkZWJ1ZyIsIkNvb2tpZUphciIsInNlbXZlckd0ZSIsInNhZmVTdHJpbmdpZnkiLCJ1dGlscyIsIlJlcXVlc3RCYXNlIiwidW56aXAiLCJSZXNwb25zZSIsIm1peGluIiwiaGFzT3duIiwiaHR0cDIiLCJwcm9jZXNzIiwidmVyc2lvbiIsInJlcXVlc3QiLCJtZXRob2QiLCJ1cmwiLCJleHBvcnRzIiwiUmVxdWVzdCIsImVuZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsIm1vZHVsZSIsImFnZW50Iiwibm9vcCIsImRlZmluZSIsInByb3RvY29scyIsInNlcmlhbGl6ZSIsInN0cmluZ2lmeSIsImJ1ZmZlciIsIl9pbml0SGVhZGVycyIsInJlcXVlc3RfIiwiX2hlYWRlciIsImhlYWRlciIsImNhbGwiLCJfZW5hYmxlSHR0cDIiLCJCb29sZWFuIiwiZW52IiwiSFRUUDJfVEVTVCIsIl9hZ2VudCIsIl9mb3JtRGF0YSIsIndyaXRhYmxlIiwiX3JlZGlyZWN0cyIsInJlZGlyZWN0cyIsImNvb2tpZXMiLCJfcXVlcnkiLCJxc1JhdyIsIl9yZWRpcmVjdExpc3QiLCJfc3RyZWFtUmVxdWVzdCIsIl9sb29rdXAiLCJ1bmRlZmluZWQiLCJvbmNlIiwiY2xlYXJUaW1lb3V0IiwiYmluZCIsImluaGVyaXRzIiwicHJvdG90eXBlIiwiYm9vbCIsIkVycm9yIiwiYXR0YWNoIiwiZmllbGQiLCJmaWxlIiwib3B0aW9ucyIsIl9kYXRhIiwibyIsImZpbGVuYW1lIiwiY3JlYXRlUmVhZFN0cmVhbSIsIm9uIiwiZXJyb3IiLCJmb3JtRGF0YSIsIl9nZXRGb3JtRGF0YSIsImVtaXQiLCJwYXRoIiwiYXBwZW5kIiwiY2FsbGVkIiwiY2FsbGJhY2siLCJhYm9ydCIsImxvb2t1cCIsInR5cGUiLCJzZXQiLCJpbmNsdWRlcyIsImdldFR5cGUiLCJhY2NlcHQiLCJxdWVyeSIsInZhbHVlIiwicHVzaCIsIk9iamVjdCIsImFzc2lnbiIsIndyaXRlIiwiZGF0YSIsImVuY29kaW5nIiwicGlwZSIsInN0cmVhbSIsInBpcGVkIiwiX3BpcGVDb250aW51ZSIsInJlcSIsInJlcyIsImlzUmVkaXJlY3QiLCJzdGF0dXNDb2RlIiwiX21heFJlZGlyZWN0cyIsIl9yZWRpcmVjdCIsIl9lbWl0UmVzcG9uc2UiLCJfYWJvcnRlZCIsIl9zaG91bGRVbnppcCIsInVuemlwT2JqZWN0IiwiY3JlYXRlVW56aXAiLCJjb2RlIiwiX2J1ZmZlciIsImhlYWRlcnMiLCJsb2NhdGlvbiIsInJlc3VtZSIsImdldEhlYWRlcnMiLCJfaGVhZGVycyIsImNoYW5nZXNPcmlnaW4iLCJob3N0IiwiY2xlYW5IZWFkZXIiLCJfZW5kQ2FsbGVkIiwiX2NhbGxiYWNrIiwiYXV0aCIsInVzZXIiLCJwYXNzIiwiZW5jb2RlciIsInN0cmluZyIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsIl9hdXRoIiwiY2EiLCJjZXJ0IiwiX2NhIiwia2V5IiwiX2tleSIsInBmeCIsImlzQnVmZmVyIiwiX3BmeCIsIl9wYXNzcGhyYXNlIiwicGFzc3BocmFzZSIsIl9jZXJ0IiwiZGlzYWJsZVRMU0NlcnRzIiwiX2Rpc2FibGVUTFNDZXJ0cyIsImluZGljZXMiLCJzdHJpY3ROdWxsSGFuZGxpbmciLCJfZmluYWxpemVRdWVyeVN0cmluZyIsImVyciIsInJldHJpZXMiLCJfcmV0cmllcyIsInF1ZXJ5U3RyaW5nQmFja3RpY2tzIiwicXVlcnlTdGFydEluZGV4IiwiaW5kZXhPZiIsInF1ZXJ5U3RyaW5nIiwic2xpY2UiLCJtYXRjaCIsImkiLCJyZXBsYWNlIiwic2VhcmNoIiwicGF0aG5hbWUiLCJ0ZXN0IiwicHJvdG9jb2wiLCJzcGxpdCIsInVuaXhQYXJ0cyIsInNvY2tldFBhdGgiLCJfY29ubmVjdE92ZXJyaWRlIiwiaG9zdG5hbWUiLCJuZXdIb3N0IiwibmV3UG9ydCIsInBvcnQiLCJyZWplY3RVbmF1dGhvcml6ZWQiLCJOT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIiwic2VydmVybmFtZSIsIl90cnVzdExvY2FsaG9zdCIsIm1vZHVsZV8iLCJzZXRQcm90b2NvbCIsInNldE5vRGVsYXkiLCJzZXRIZWFkZXIiLCJyZXNwb25zZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJ0ZW1wb3JhcnlKYXIiLCJzZXRDb29raWVzIiwiY29va2llIiwiZ2V0Q29va2llcyIsIkNvb2tpZUFjY2Vzc0luZm8iLCJBbGwiLCJ0b1ZhbHVlU3RyaW5nIiwiX3Nob3VsZFJldHJ5IiwiX3JldHJ5IiwiZm4iLCJjb25zb2xlIiwid2FybiIsIl9pc1Jlc3BvbnNlT0siLCJtZXNzYWdlIiwiU1RBVFVTX0NPREVTIiwic3RhdHVzIiwiX21heFJldHJpZXMiLCJsaXN0ZW5lcnMiLCJfaXNIb3N0Iiwib2JqZWN0IiwiYm9keSIsImZpbGVzIiwiX2VuZCIsIl9zZXRUaW1lb3V0cyIsIl9oZWFkZXJTZW50IiwiY29udGVudFR5cGUiLCJnZXRIZWFkZXIiLCJfc2VyaWFsaXplciIsImlzSlNPTiIsImJ5dGVMZW5ndGgiLCJfcmVzcG9uc2VUaW1lb3V0VGltZXIiLCJtYXgiLCJ0b0xvd2VyQ2FzZSIsInRyaW0iLCJtdWx0aXBhcnQiLCJyZWRpcmVjdCIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGUiLCJwYXJzZXIiLCJfcGFyc2VyIiwiaW1hZ2UiLCJmb3JtIiwiaXNCaW5hcnkiLCJ0ZXh0IiwiaXNUZXh0IiwiX3Jlc0J1ZmZlcmVkIiwicGFyc2VySGFuZGxlc0VuZCIsInJlc3BvbnNlQnl0ZXNMZWZ0IiwiX21heFJlc3BvbnNlU2l6ZSIsImJ1ZiIsImRlc3Ryb3kiLCJ0aW1lZG91dCIsImdldFByb2dyZXNzTW9uaXRvciIsImxlbmd0aENvbXB1dGFibGUiLCJ0b3RhbCIsImxvYWRlZCIsInByb2dyZXNzIiwiVHJhbnNmb3JtIiwiX3RyYW5zZm9ybSIsImNodW5rIiwiZGlyZWN0aW9uIiwiYnVmZmVyVG9DaHVua3MiLCJjaHVua1NpemUiLCJjaHVua2luZyIsIlJlYWRhYmxlIiwidG90YWxMZW5ndGgiLCJyZW1haW5kZXIiLCJjdXRvZmYiLCJyZW1haW5kZXJCdWZmZXIiLCJnZXRMZW5ndGgiLCJjb25uZWN0IiwiY29ubmVjdE92ZXJyaWRlIiwidHJ1c3RMb2NhbGhvc3QiLCJ0b2dnbGUiLCJuYW1lIiwidG9VcHBlckNhc2UiLCJzZW5kIiwicGFydHMiLCJzdWJ0eXBlIiwicmVnaXN0cnkiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tZGVwcmVjYXRlZC1hcGlcbmNvbnN0IHsgcGFyc2UsIGZvcm1hdCwgcmVzb2x2ZSB9ID0gcmVxdWlyZSgndXJsJyk7XG5jb25zdCBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbmNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbmNvbnN0IGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCB6bGliID0gcmVxdWlyZSgnemxpYicpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHFzID0gcmVxdWlyZSgncXMnKTtcbmNvbnN0IG1pbWUgPSByZXF1aXJlKCdtaW1lJyk7XG5sZXQgbWV0aG9kcyA9IHJlcXVpcmUoJ21ldGhvZHMnKTtcbmNvbnN0IEZvcm1EYXRhID0gcmVxdWlyZSgnZm9ybS1kYXRhJyk7XG5jb25zdCBmb3JtaWRhYmxlID0gcmVxdWlyZSgnZm9ybWlkYWJsZScpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzdXBlcmFnZW50Jyk7XG5jb25zdCBDb29raWVKYXIgPSByZXF1aXJlKCdjb29raWVqYXInKTtcbmNvbnN0IHNlbXZlckd0ZSA9IHJlcXVpcmUoJ3NlbXZlci9mdW5jdGlvbnMvZ3RlJyk7XG5jb25zdCBzYWZlU3RyaW5naWZ5ID0gcmVxdWlyZSgnZmFzdC1zYWZlLXN0cmluZ2lmeScpO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5jb25zdCBSZXF1ZXN0QmFzZSA9IHJlcXVpcmUoJy4uL3JlcXVlc3QtYmFzZScpO1xuY29uc3QgeyB1bnppcCB9ID0gcmVxdWlyZSgnLi91bnppcCcpO1xuY29uc3QgUmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJyk7XG5cbmNvbnN0IHsgbWl4aW4sIGhhc093biB9ID0gdXRpbHM7XG5cbmxldCBodHRwMjtcblxuaWYgKHNlbXZlckd0ZShwcm9jZXNzLnZlcnNpb24sICd2MTAuMTAuMCcpKSBodHRwMiA9IHJlcXVpcmUoJy4vaHR0cDJ3cmFwcGVyJyk7XG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKHR5cGVvZiB1cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5leHBvcnRzLlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgYWdlbnQgZnVuY3Rpb25cbiAqL1xuXG5leHBvcnRzLmFnZW50ID0gcmVxdWlyZSgnLi9hZ2VudCcpO1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxuZXhwb3J0cy5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIERlZmluZSBcImZvcm1cIiBtaW1lIHR5cGUuXG4gKi9cblxubWltZS5kZWZpbmUoXG4gIHtcbiAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogWydmb3JtJywgJ3VybGVuY29kZWQnLCAnZm9ybS1kYXRhJ11cbiAgfSxcbiAgdHJ1ZVxuKTtcblxuLyoqXG4gKiBQcm90b2NvbCBtYXAuXG4gKi9cblxuZXhwb3J0cy5wcm90b2NvbHMgPSB7XG4gICdodHRwOic6IGh0dHAsXG4gICdodHRwczonOiBodHRwcyxcbiAgJ2h0dHAyOic6IGh0dHAyXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuZXhwb3J0cy5zZXJpYWxpemUgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBxcy5zdHJpbmdpZnksXG4gICdhcHBsaWNhdGlvbi9qc29uJzogc2FmZVN0cmluZ2lmeVxufTtcblxuLyoqXG4gKiBEZWZhdWx0IHBhcnNlcnMuXG4gKlxuICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ocmVzLCBmbil7XG4gKiAgICAgICBmbihudWxsLCByZXMpO1xuICogICAgIH07XG4gKlxuICovXG5cbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlcnMnKTtcblxuLyoqXG4gKiBEZWZhdWx0IGJ1ZmZlcmluZyBtYXAuIENhbiBiZSB1c2VkIHRvIHNldCBjZXJ0YWluXG4gKiByZXNwb25zZSB0eXBlcyB0byBidWZmZXIvbm90IGJ1ZmZlci5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5idWZmZXJbJ2FwcGxpY2F0aW9uL3htbCddID0gdHJ1ZTtcbiAqL1xuZXhwb3J0cy5idWZmZXIgPSB7fTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGludGVybmFsIGhlYWRlciB0cmFja2luZyBwcm9wZXJ0aWVzIG9uIGEgcmVxdWVzdCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVxIHRoZSBpbnN0YW5jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9pbml0SGVhZGVycyhyZXF1ZXN0Xykge1xuICByZXF1ZXN0Xy5faGVhZGVyID0ge1xuICAgIC8vIGNvZXJjZXMgaGVhZGVyIG5hbWVzIHRvIGxvd2VyY2FzZVxuICB9O1xuICByZXF1ZXN0Xy5oZWFkZXIgPSB7XG4gICAgLy8gcHJlc2VydmVzIGhlYWRlciBuYW1lIGNhc2VcbiAgfTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICBTdHJlYW0uY2FsbCh0aGlzKTtcbiAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB1cmwgPSBmb3JtYXQodXJsKTtcbiAgdGhpcy5fZW5hYmxlSHR0cDIgPSBCb29sZWFuKHByb2Nlc3MuZW52LkhUVFAyX1RFU1QpOyAvLyBpbnRlcm5hbCBvbmx5XG4gIHRoaXMuX2FnZW50ID0gZmFsc2U7XG4gIHRoaXMuX2Zvcm1EYXRhID0gbnVsbDtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICBfaW5pdEhlYWRlcnModGhpcyk7XG4gIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuICB0aGlzLl9yZWRpcmVjdHMgPSAwO1xuICB0aGlzLnJlZGlyZWN0cyhtZXRob2QgPT09ICdIRUFEJyA/IDAgOiA1KTtcbiAgdGhpcy5jb29raWVzID0gJyc7XG4gIHRoaXMucXMgPSB7fTtcbiAgdGhpcy5fcXVlcnkgPSBbXTtcbiAgdGhpcy5xc1JhdyA9IHRoaXMuX3F1ZXJ5OyAvLyBVbnVzZWQsIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBvbmx5XG4gIHRoaXMuX3JlZGlyZWN0TGlzdCA9IFtdO1xuICB0aGlzLl9zdHJlYW1SZXF1ZXN0ID0gZmFsc2U7XG4gIHRoaXMuX2xvb2t1cCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5vbmNlKCdlbmQnLCB0aGlzLmNsZWFyVGltZW91dC5iaW5kKHRoaXMpKTtcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYFN0cmVhbWAgKHdoaWNoIGluaGVyaXRzIGZyb20gYEV2ZW50RW1pdHRlcmApLlxuICogTWl4aW4gYFJlcXVlc3RCYXNlYC5cbiAqL1xudXRpbC5pbmhlcml0cyhSZXF1ZXN0LCBTdHJlYW0pO1xuXG5taXhpbihSZXF1ZXN0LnByb3RvdHlwZSwgUmVxdWVzdEJhc2UucHJvdG90eXBlKTtcblxuLyoqXG4gKiBFbmFibGUgb3IgRGlzYWJsZSBodHRwMi5cbiAqXG4gKiBFbmFibGUgaHR0cDIuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LmdldCgnaHR0cDovL2xvY2FsaG9zdC8nKVxuICogICAuaHR0cDIoKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiByZXF1ZXN0LmdldCgnaHR0cDovL2xvY2FsaG9zdC8nKVxuICogICAuaHR0cDIodHJ1ZSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBEaXNhYmxlIGh0dHAyLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdCA9IHJlcXVlc3QuaHR0cDIoKTtcbiAqIHJlcXVlc3QuZ2V0KCdodHRwOi8vbG9jYWxob3N0LycpXG4gKiAgIC5odHRwMihmYWxzZSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmh0dHAyID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgaWYgKGV4cG9ydHMucHJvdG9jb2xzWydodHRwMjonXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ3N1cGVyYWdlbnQ6IHRoaXMgdmVyc2lvbiBvZiBOb2RlLmpzIGRvZXMgbm90IHN1cHBvcnQgaHR0cDInXG4gICAgKTtcbiAgfVxuXG4gIHRoaXMuX2VuYWJsZUh0dHAyID0gYm9vbCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGJvb2w7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBRdWV1ZSB0aGUgZ2l2ZW4gYGZpbGVgIGFzIGFuIGF0dGFjaG1lbnQgdG8gdGhlIHNwZWNpZmllZCBgZmllbGRgLFxuICogd2l0aCBvcHRpb25hbCBgb3B0aW9uc2AgKG9yIGZpbGVuYW1lKS5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnaHR0cDovL2xvY2FsaG9zdC91cGxvYWQnKVxuICogICAuYXR0YWNoKCdmaWVsZCcsIEJ1ZmZlci5mcm9tKCc8Yj5IZWxsbyB3b3JsZDwvYj4nKSwgJ2hlbGxvLmh0bWwnKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEEgZmlsZW5hbWUgbWF5IGFsc28gYmUgdXNlZDpcbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnaHR0cDovL2xvY2FsaG9zdC91cGxvYWQnKVxuICogICAuYXR0YWNoKCdmaWxlcycsICdpbWFnZS5qcGcnKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd8ZnMuUmVhZFN0cmVhbXxCdWZmZXJ9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uIChmaWVsZCwgZmlsZSwgb3B0aW9ucykge1xuICBpZiAoZmlsZSkge1xuICAgIGlmICh0aGlzLl9kYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdXBlcmFnZW50IGNhbid0IG1peCAuc2VuZCgpIGFuZCAuYXR0YWNoKClcIik7XG4gICAgfVxuXG4gICAgbGV0IG8gPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG8gPSB7IGZpbGVuYW1lOiBvcHRpb25zIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCFvLmZpbGVuYW1lKSBvLmZpbGVuYW1lID0gZmlsZTtcbiAgICAgIGRlYnVnKCdjcmVhdGluZyBgZnMuUmVhZFN0cmVhbWAgaW5zdGFuY2UgZm9yIGZpbGU6ICVzJywgZmlsZSk7XG4gICAgICBmaWxlID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlKTtcbiAgICAgIGZpbGUub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gdGhpcy5fZ2V0Rm9ybURhdGEoKTtcbiAgICAgICAgZm9ybURhdGEuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFvLmZpbGVuYW1lICYmIGZpbGUucGF0aCkge1xuICAgICAgby5maWxlbmFtZSA9IGZpbGUucGF0aDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChmaWVsZCwgZmlsZSwgbyk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkge1xuICAgIHRoaXMuX2Zvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgdGhpcy5fZm9ybURhdGEub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICBkZWJ1ZygnRm9ybURhdGEgZXJyb3InLCBlcnJvcik7XG4gICAgICBpZiAodGhpcy5jYWxsZWQpIHtcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgaGFzIGFscmVhZHkgZmluaXNoZWQgYW5kIHRoZSBjYWxsYmFjayB3YXMgY2FsbGVkLlxuICAgICAgICAvLyBTaWxlbnRseSBpZ25vcmUgdGhlIGVycm9yLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FsbGJhY2soZXJyb3IpO1xuICAgICAgdGhpcy5hYm9ydCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2Zvcm1EYXRhO1xufTtcblxuLyoqXG4gKiBHZXRzL3NldHMgdGhlIGBBZ2VudGAgdG8gdXNlIGZvciB0aGlzIEhUVFAgcmVxdWVzdC4gVGhlIGRlZmF1bHQgKGlmIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIG5vdCBjYWxsZWQpIGlzIHRvIG9wdCBvdXQgb2YgY29ubmVjdGlvbiBwb29saW5nIChgYWdlbnQ6IGZhbHNlYCkuXG4gKlxuICogQHBhcmFtIHtodHRwLkFnZW50fSBhZ2VudFxuICogQHJldHVybiB7aHR0cC5BZ2VudH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWdlbnQgPSBmdW5jdGlvbiAoYWdlbnQpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLl9hZ2VudDtcbiAgdGhpcy5fYWdlbnQgPSBhZ2VudDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldHMvc2V0cyB0aGUgYGxvb2t1cGAgZnVuY3Rpb24gdG8gdXNlIGN1c3RvbSBETlMgcmVzb2x2ZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbG9va3VwXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24gKGxvb2t1cCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuX2xvb2t1cDtcbiAgdGhpcy5fbG9va3VwID0gbG9va3VwO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IF9Db250ZW50LVR5cGVfIHJlc3BvbnNlIGhlYWRlciBwYXNzZWQgdGhyb3VnaCBgbWltZS5nZXRUeXBlKClgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAuc2VuZChqc29uc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNlbmQoanNvbnN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICByZXR1cm4gdGhpcy5zZXQoXG4gICAgJ0NvbnRlbnQtVHlwZScsXG4gICAgdHlwZS5pbmNsdWRlcygnLycpID8gdHlwZSA6IG1pbWUuZ2V0VHlwZSh0eXBlKVxuICApO1xufTtcblxuLyoqXG4gKiBTZXQgX0FjY2VwdF8gcmVzcG9uc2UgaGVhZGVyIHBhc3NlZCB0aHJvdWdoIGBtaW1lLmdldFR5cGUoKWAuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbiAodHlwZSkge1xuICByZXR1cm4gdGhpcy5zZXQoJ0FjY2VwdCcsIHR5cGUuaW5jbHVkZXMoJy8nKSA/IHR5cGUgOiBtaW1lLmdldFR5cGUodHlwZSkpO1xufTtcblxuLyoqXG4gKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4gKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiAqICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHRoaXMuX3F1ZXJ5LnB1c2godmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5xcywgdmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHJhdyBgZGF0YWAgLyBgZW5jb2RpbmdgIHRvIHRoZSBzb2NrZXQuXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ8U3RyaW5nfSBkYXRhXG4gKiBAcGFyYW0ge1N0cmluZ30gZW5jb2RpbmdcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGRhdGEsIGVuY29kaW5nKSB7XG4gIGNvbnN0IHJlcXVlc3RfID0gdGhpcy5yZXF1ZXN0KCk7XG4gIGlmICghdGhpcy5fc3RyZWFtUmVxdWVzdCkge1xuICAgIHRoaXMuX3N0cmVhbVJlcXVlc3QgPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVlc3RfLndyaXRlKGRhdGEsIGVuY29kaW5nKTtcbn07XG5cbi8qKlxuICogUGlwZSB0aGUgcmVxdWVzdCBib2R5IHRvIGBzdHJlYW1gLlxuICpcbiAqIEBwYXJhbSB7U3RyZWFtfSBzdHJlYW1cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJlYW19XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoc3RyZWFtLCBvcHRpb25zKSB7XG4gIHRoaXMucGlwZWQgPSB0cnVlOyAvLyBIQUNLLi4uXG4gIHRoaXMuYnVmZmVyKGZhbHNlKTtcbiAgdGhpcy5lbmQoKTtcbiAgcmV0dXJuIHRoaXMuX3BpcGVDb250aW51ZShzdHJlYW0sIG9wdGlvbnMpO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX3BpcGVDb250aW51ZSA9IGZ1bmN0aW9uIChzdHJlYW0sIG9wdGlvbnMpIHtcbiAgdGhpcy5yZXEub25jZSgncmVzcG9uc2UnLCAocmVzKSA9PiB7XG4gICAgLy8gcmVkaXJlY3RcbiAgICBpZiAoXG4gICAgICBpc1JlZGlyZWN0KHJlcy5zdGF0dXNDb2RlKSAmJlxuICAgICAgdGhpcy5fcmVkaXJlY3RzKysgIT09IHRoaXMuX21heFJlZGlyZWN0c1xuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlZGlyZWN0KHJlcykgPT09IHRoaXNcbiAgICAgICAgPyB0aGlzLl9waXBlQ29udGludWUoc3RyZWFtLCBvcHRpb25zKVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLnJlcyA9IHJlcztcbiAgICB0aGlzLl9lbWl0UmVzcG9uc2UoKTtcbiAgICBpZiAodGhpcy5fYWJvcnRlZCkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuX3Nob3VsZFVuemlwKHJlcykpIHtcbiAgICAgIGNvbnN0IHVuemlwT2JqZWN0ID0gemxpYi5jcmVhdGVVbnppcCgpO1xuICAgICAgdW56aXBPYmplY3Qub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5jb2RlID09PSAnWl9CVUZfRVJST1InKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCBlbmQgb2YgZmlsZSBpcyBpZ25vcmVkIGJ5IGJyb3dzZXJzIGFuZCBjdXJsXG4gICAgICAgICAgc3RyZWFtLmVtaXQoJ2VuZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgcmVzLnBpcGUodW56aXBPYmplY3QpLnBpcGUoc3RyZWFtLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnBpcGUoc3RyZWFtLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXMub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBzdHJlYW07XG59O1xuXG4vKipcbiAqIEVuYWJsZSAvIGRpc2FibGUgYnVmZmVyaW5nLlxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFt2YWxdXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYnVmZmVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHRoaXMuX2J1ZmZlciA9IHZhbHVlICE9PSBmYWxzZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlZGlyZWN0IHRvIGB1cmxcbiAqXG4gKiBAcGFyYW0ge0luY29taW5nTWVzc2FnZX0gcmVzXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgbGV0IHVybCA9IHJlcy5oZWFkZXJzLmxvY2F0aW9uO1xuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB0aGlzLmNhbGxiYWNrKG5ldyBFcnJvcignTm8gbG9jYXRpb24gaGVhZGVyIGZvciByZWRpcmVjdCcpLCByZXMpO1xuICB9XG5cbiAgZGVidWcoJ3JlZGlyZWN0ICVzIC0+ICVzJywgdGhpcy51cmwsIHVybCk7XG5cbiAgLy8gbG9jYXRpb25cbiAgdXJsID0gcmVzb2x2ZSh0aGlzLnVybCwgdXJsKTtcblxuICAvLyBlbnN1cmUgdGhlIHJlc3BvbnNlIGlzIGJlaW5nIGNvbnN1bWVkXG4gIC8vIHRoaXMgaXMgcmVxdWlyZWQgZm9yIE5vZGUgdjAuMTArXG4gIHJlcy5yZXN1bWUoKTtcblxuICBsZXQgaGVhZGVycyA9IHRoaXMucmVxLmdldEhlYWRlcnMgPyB0aGlzLnJlcS5nZXRIZWFkZXJzKCkgOiB0aGlzLnJlcS5faGVhZGVycztcblxuICBjb25zdCBjaGFuZ2VzT3JpZ2luID0gcGFyc2UodXJsKS5ob3N0ICE9PSBwYXJzZSh0aGlzLnVybCkuaG9zdDtcblxuICAvLyBpbXBsZW1lbnRhdGlvbiBvZiAzMDIgZm9sbG93aW5nIGRlZmFjdG8gc3RhbmRhcmRcbiAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAzMDEgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDMwMikge1xuICAgIC8vIHN0cmlwIENvbnRlbnQtKiByZWxhdGVkIGZpZWxkc1xuICAgIC8vIGluIGNhc2Ugb2YgUE9TVCBldGNcbiAgICBoZWFkZXJzID0gdXRpbHMuY2xlYW5IZWFkZXIoaGVhZGVycywgY2hhbmdlc09yaWdpbik7XG5cbiAgICAvLyBmb3JjZSBHRVRcbiAgICB0aGlzLm1ldGhvZCA9IHRoaXMubWV0aG9kID09PSAnSEVBRCcgPyAnSEVBRCcgOiAnR0VUJztcblxuICAgIC8vIGNsZWFyIGRhdGFcbiAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8vIDMwMyBpcyBhbHdheXMgR0VUXG4gIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMzAzKSB7XG4gICAgLy8gc3RyaXAgQ29udGVudC0qIHJlbGF0ZWQgZmllbGRzXG4gICAgLy8gaW4gY2FzZSBvZiBQT1NUIGV0Y1xuICAgIGhlYWRlcnMgPSB1dGlscy5jbGVhbkhlYWRlcihoZWFkZXJzLCBjaGFuZ2VzT3JpZ2luKTtcblxuICAgIC8vIGZvcmNlIG1ldGhvZFxuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG5cbiAgICAvLyBjbGVhciBkYXRhXG4gICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gIH1cblxuICAvLyAzMDcgcHJlc2VydmVzIG1ldGhvZFxuICAvLyAzMDggcHJlc2VydmVzIG1ldGhvZFxuICBkZWxldGUgaGVhZGVycy5ob3N0O1xuXG4gIGRlbGV0ZSB0aGlzLnJlcTtcbiAgZGVsZXRlIHRoaXMuX2Zvcm1EYXRhO1xuXG4gIC8vIHJlbW92ZSBhbGwgYWRkIGhlYWRlciBleGNlcHQgVXNlci1BZ2VudFxuICBfaW5pdEhlYWRlcnModGhpcyk7XG5cbiAgLy8gcmVkaXJlY3RcbiAgdGhpcy5fZW5kQ2FsbGVkID0gZmFsc2U7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLnFzID0ge307XG4gIHRoaXMuX3F1ZXJ5Lmxlbmd0aCA9IDA7XG4gIHRoaXMuc2V0KGhlYWRlcnMpO1xuICB0aGlzLmVtaXQoJ3JlZGlyZWN0JywgcmVzKTtcbiAgdGhpcy5fcmVkaXJlY3RMaXN0LnB1c2godGhpcy51cmwpO1xuICB0aGlzLmVuZCh0aGlzLl9jYWxsYmFjayk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgLmF1dGgoJ3RvYmknLCAnbGVhcm5ib29zdCcpXG4gKiAgIC5hdXRoKCd0b2JpOmxlYXJuYm9vc3QnKVxuICogICAuYXV0aCgndG9iaScpXG4gKiAgIC5hdXRoKGFjY2Vzc1Rva2VuLCB7IHR5cGU6ICdiZWFyZXInIH0pXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGFzc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gb3B0aW9ucyB3aXRoIGF1dGhvcml6YXRpb24gdHlwZSAnYmFzaWMnIG9yICdiZWFyZXInICgnYmFzaWMnIGlzIGRlZmF1bHQpXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uICh1c2VyLCBwYXNzLCBvcHRpb25zKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSBwYXNzID0gJyc7XG4gIGlmICh0eXBlb2YgcGFzcyA9PT0gJ29iamVjdCcgJiYgcGFzcyAhPT0gbnVsbCkge1xuICAgIC8vIHBhc3MgaXMgb3B0aW9uYWwgYW5kIGNhbiBiZSByZXBsYWNlZCB3aXRoIG9wdGlvbnNcbiAgICBvcHRpb25zID0gcGFzcztcbiAgICBwYXNzID0gJyc7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0geyB0eXBlOiAnYmFzaWMnIH07XG4gIH1cblxuICBjb25zdCBlbmNvZGVyID0gKHN0cmluZykgPT4gQnVmZmVyLmZyb20oc3RyaW5nKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgcmV0dXJuIHRoaXMuX2F1dGgodXNlciwgcGFzcywgb3B0aW9ucywgZW5jb2Rlcik7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY2VydGlmaWNhdGUgYXV0aG9yaXR5IG9wdGlvbiBmb3IgaHR0cHMgcmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlciB8IEFycmF5fSBjZXJ0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2EgPSBmdW5jdGlvbiAoY2VydCkge1xuICB0aGlzLl9jYSA9IGNlcnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNsaWVudCBjZXJ0aWZpY2F0ZSBrZXkgb3B0aW9uIGZvciBodHRwcyByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyIHwgU3RyaW5nfSBjZXJ0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUua2V5ID0gZnVuY3Rpb24gKGNlcnQpIHtcbiAgdGhpcy5fa2V5ID0gY2VydDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUga2V5LCBjZXJ0aWZpY2F0ZSwgYW5kIENBIGNlcnRzIG9mIHRoZSBjbGllbnQgaW4gUEZYIG9yIFBLQ1MxMiBmb3JtYXQuXG4gKlxuICogQHBhcmFtIHtCdWZmZXIgfCBTdHJpbmd9IGNlcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5wZnggPSBmdW5jdGlvbiAoY2VydCkge1xuICBpZiAodHlwZW9mIGNlcnQgPT09ICdvYmplY3QnICYmICFCdWZmZXIuaXNCdWZmZXIoY2VydCkpIHtcbiAgICB0aGlzLl9wZnggPSBjZXJ0LnBmeDtcbiAgICB0aGlzLl9wYXNzcGhyYXNlID0gY2VydC5wYXNzcGhyYXNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX3BmeCA9IGNlcnQ7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjbGllbnQgY2VydGlmaWNhdGUgb3B0aW9uIGZvciBodHRwcyByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyIHwgU3RyaW5nfSBjZXJ0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2VydCA9IGZ1bmN0aW9uIChjZXJ0KSB7XG4gIHRoaXMuX2NlcnQgPSBjZXJ0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRG8gbm90IHJlamVjdCBleHBpcmVkIG9yIGludmFsaWQgVExTIGNlcnRzLlxuICogc2V0cyBgcmVqZWN0VW5hdXRob3JpemVkPXRydWVgLiBCZSB3YXJuZWQgdGhhdCB0aGlzIGFsbG93cyBNSVRNIGF0dGFja3MuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmRpc2FibGVUTFNDZXJ0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fZGlzYWJsZVRMU0NlcnRzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBodHRwW3NdIHJlcXVlc3QuXG4gKlxuICogQHJldHVybiB7T3V0Z29pbmdNZXNzYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcblJlcXVlc3QucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnJlcSkgcmV0dXJuIHRoaXMucmVxO1xuXG4gIGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuICB0cnkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KHRoaXMucXMsIHtcbiAgICAgIGluZGljZXM6IGZhbHNlLFxuICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICB0aGlzLnFzID0ge307XG4gICAgICB0aGlzLl9xdWVyeS5wdXNoKHF1ZXJ5KTtcbiAgICB9XG5cbiAgICB0aGlzLl9maW5hbGl6ZVF1ZXJ5U3RyaW5nKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxuXG4gIGxldCB7IHVybCB9ID0gdGhpcztcbiAgY29uc3QgcmV0cmllcyA9IHRoaXMuX3JldHJpZXM7XG5cbiAgLy8gQ2FwdHVyZSBiYWNrdGlja3MgYXMtaXMgZnJvbSB0aGUgZmluYWwgcXVlcnkgc3RyaW5nIGJ1aWx0IGFib3ZlLlxuICAvLyBOb3RlOiB0aGlzJ2xsIG9ubHkgZmluZCBiYWNrdGlja3MgZW50ZXJlZCBpbiByZXEucXVlcnkoU3RyaW5nKVxuICAvLyBjYWxscywgYmVjYXVzZSBxcy5zdHJpbmdpZnkgdW5jb25kaXRpb25hbGx5IGVuY29kZXMgYmFja3RpY2tzLlxuICBsZXQgcXVlcnlTdHJpbmdCYWNrdGlja3M7XG4gIGlmICh1cmwuaW5jbHVkZXMoJ2AnKSkge1xuICAgIGNvbnN0IHF1ZXJ5U3RhcnRJbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XG5cbiAgICBpZiAocXVlcnlTdGFydEluZGV4ICE9PSAtMSkge1xuICAgICAgY29uc3QgcXVlcnlTdHJpbmcgPSB1cmwuc2xpY2UocXVlcnlTdGFydEluZGV4ICsgMSk7XG4gICAgICBxdWVyeVN0cmluZ0JhY2t0aWNrcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9gfCU2MC9nKTtcbiAgICB9XG4gIH1cblxuICAvLyBkZWZhdWx0IHRvIGh0dHA6Ly9cbiAgaWYgKHVybC5pbmRleE9mKCdodHRwJykgIT09IDApIHVybCA9IGBodHRwOi8vJHt1cmx9YDtcbiAgdXJsID0gcGFyc2UodXJsKTtcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2xhZGpzL3N1cGVyYWdlbnQvaXNzdWVzLzEzNjdcbiAgaWYgKHF1ZXJ5U3RyaW5nQmFja3RpY2tzKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIHVybC5xdWVyeSA9IHVybC5xdWVyeS5yZXBsYWNlKC8lNjAvZywgKCkgPT4gcXVlcnlTdHJpbmdCYWNrdGlja3NbaSsrXSk7XG4gICAgdXJsLnNlYXJjaCA9IGA/JHt1cmwucXVlcnl9YDtcbiAgICB1cmwucGF0aCA9IHVybC5wYXRobmFtZSArIHVybC5zZWFyY2g7XG4gIH1cblxuICAvLyBzdXBwb3J0IHVuaXggc29ja2V0c1xuICBpZiAoL15odHRwcz9cXCt1bml4Oi8udGVzdCh1cmwucHJvdG9jb2wpID09PSB0cnVlKSB7XG4gICAgLy8gZ2V0IHRoZSBwcm90b2NvbFxuICAgIHVybC5wcm90b2NvbCA9IGAke3VybC5wcm90b2NvbC5zcGxpdCgnKycpWzBdfTpgO1xuXG4gICAgLy8gZ2V0IHRoZSBzb2NrZXQsIHBhdGhcbiAgICBjb25zdCB1bml4UGFydHMgPSB1cmwucGF0aC5tYXRjaCgvXihbXi9dKykoLispJC8pO1xuICAgIG9wdGlvbnMuc29ja2V0UGF0aCA9IHVuaXhQYXJ0c1sxXS5yZXBsYWNlKC8lMkYvZywgJy8nKTtcbiAgICB1cmwucGF0aCA9IHVuaXhQYXJ0c1syXTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIElQIGFkZHJlc3Mgb2YgYSBob3N0bmFtZVxuICBpZiAodGhpcy5fY29ubmVjdE92ZXJyaWRlKSB7XG4gICAgY29uc3QgeyBob3N0bmFtZSB9ID0gdXJsO1xuICAgIGNvbnN0IG1hdGNoID1cbiAgICAgIGhvc3RuYW1lIGluIHRoaXMuX2Nvbm5lY3RPdmVycmlkZVxuICAgICAgICA/IHRoaXMuX2Nvbm5lY3RPdmVycmlkZVtob3N0bmFtZV1cbiAgICAgICAgOiB0aGlzLl9jb25uZWN0T3ZlcnJpZGVbJyonXTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIC8vIGJhY2t1cCB0aGUgcmVhbCBob3N0XG4gICAgICBpZiAoIXRoaXMuX2hlYWRlci5ob3N0KSB7XG4gICAgICAgIHRoaXMuc2V0KCdob3N0JywgdXJsLmhvc3QpO1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3SG9zdDtcbiAgICAgIGxldCBuZXdQb3J0O1xuXG4gICAgICBpZiAodHlwZW9mIG1hdGNoID09PSAnb2JqZWN0Jykge1xuICAgICAgICBuZXdIb3N0ID0gbWF0Y2guaG9zdDtcbiAgICAgICAgbmV3UG9ydCA9IG1hdGNoLnBvcnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdIb3N0ID0gbWF0Y2g7XG4gICAgICAgIG5ld1BvcnQgPSB1cmwucG9ydDtcbiAgICAgIH1cblxuICAgICAgLy8gd3JhcCBbaXB2Nl1cbiAgICAgIHVybC5ob3N0ID0gLzovLnRlc3QobmV3SG9zdCkgPyBgWyR7bmV3SG9zdH1dYCA6IG5ld0hvc3Q7XG4gICAgICBpZiAobmV3UG9ydCkge1xuICAgICAgICB1cmwuaG9zdCArPSBgOiR7bmV3UG9ydH1gO1xuICAgICAgICB1cmwucG9ydCA9IG5ld1BvcnQ7XG4gICAgICB9XG5cbiAgICAgIHVybC5ob3N0bmFtZSA9IG5ld0hvc3Q7XG4gICAgfVxuICB9XG5cbiAgLy8gb3B0aW9uc1xuICBvcHRpb25zLm1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICBvcHRpb25zLnBvcnQgPSB1cmwucG9ydDtcbiAgb3B0aW9ucy5wYXRoID0gdXJsLnBhdGg7XG4gIG9wdGlvbnMuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgb3B0aW9ucy5jYSA9IHRoaXMuX2NhO1xuICBvcHRpb25zLmtleSA9IHRoaXMuX2tleTtcbiAgb3B0aW9ucy5wZnggPSB0aGlzLl9wZng7XG4gIG9wdGlvbnMuY2VydCA9IHRoaXMuX2NlcnQ7XG4gIG9wdGlvbnMucGFzc3BocmFzZSA9IHRoaXMuX3Bhc3NwaHJhc2U7XG4gIG9wdGlvbnMuYWdlbnQgPSB0aGlzLl9hZ2VudDtcbiAgb3B0aW9ucy5sb29rdXAgPSB0aGlzLl9sb29rdXA7XG4gIG9wdGlvbnMucmVqZWN0VW5hdXRob3JpemVkID1cbiAgICB0eXBlb2YgdGhpcy5fZGlzYWJsZVRMU0NlcnRzID09PSAnYm9vbGVhbidcbiAgICAgID8gIXRoaXMuX2Rpc2FibGVUTFNDZXJ0c1xuICAgICAgOiBwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEICE9PSAnMCc7XG5cbiAgLy8gQWxsb3dzIHJlcXVlc3QuZ2V0KCdodHRwczovLzEuMi4zLjQvJykuc2V0KCdIb3N0JywgJ2V4YW1wbGUuY29tJylcbiAgaWYgKHRoaXMuX2hlYWRlci5ob3N0KSB7XG4gICAgb3B0aW9ucy5zZXJ2ZXJuYW1lID0gdGhpcy5faGVhZGVyLmhvc3QucmVwbGFjZSgvOlxcZCskLywgJycpO1xuICB9XG5cbiAgaWYgKFxuICAgIHRoaXMuX3RydXN0TG9jYWxob3N0ICYmXG4gICAgL14oPzpsb2NhbGhvc3R8MTI3XFwuMFxcLjBcXC5cXGQrfCgwKjopKzowKjEpJC8udGVzdCh1cmwuaG9zdG5hbWUpXG4gICkge1xuICAgIG9wdGlvbnMucmVqZWN0VW5hdXRob3JpemVkID0gZmFsc2U7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIGNvbnN0IG1vZHVsZV8gPSB0aGlzLl9lbmFibGVIdHRwMlxuICAgID8gZXhwb3J0cy5wcm90b2NvbHNbJ2h0dHAyOiddLnNldFByb3RvY29sKHVybC5wcm90b2NvbClcbiAgICA6IGV4cG9ydHMucHJvdG9jb2xzW3VybC5wcm90b2NvbF07XG5cbiAgLy8gcmVxdWVzdFxuICB0aGlzLnJlcSA9IG1vZHVsZV8ucmVxdWVzdChvcHRpb25zKTtcbiAgY29uc3QgeyByZXEgfSA9IHRoaXM7XG5cbiAgLy8gc2V0IHRjcCBubyBkZWxheVxuICByZXEuc2V0Tm9EZWxheSh0cnVlKTtcblxuICBpZiAob3B0aW9ucy5tZXRob2QgIT09ICdIRUFEJykge1xuICAgIHJlcS5zZXRIZWFkZXIoJ0FjY2VwdC1FbmNvZGluZycsICdnemlwLCBkZWZsYXRlJyk7XG4gIH1cblxuICB0aGlzLnByb3RvY29sID0gdXJsLnByb3RvY29sO1xuICB0aGlzLmhvc3QgPSB1cmwuaG9zdDtcblxuICAvLyBleHBvc2UgZXZlbnRzXG4gIHJlcS5vbmNlKCdkcmFpbicsICgpID0+IHtcbiAgICB0aGlzLmVtaXQoJ2RyYWluJyk7XG4gIH0pO1xuXG4gIHJlcS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAvLyBmbGFnIGFib3J0aW9uIGhlcmUgZm9yIG91dCB0aW1lb3V0c1xuICAgIC8vIGJlY2F1c2Ugbm9kZSB3aWxsIGVtaXQgYSBmYXV4LWVycm9yIFwic29ja2V0IGhhbmcgdXBcIlxuICAgIC8vIHdoZW4gcmVxdWVzdCBpcyBhYm9ydGVkIGJlZm9yZSBhIGNvbm5lY3Rpb24gaXMgbWFkZVxuICAgIGlmICh0aGlzLl9hYm9ydGVkKSByZXR1cm47XG4gICAgLy8gaWYgbm90IHRoZSBzYW1lLCB3ZSBhcmUgaW4gdGhlICoqb2xkKiogKGNhbmNlbGxlZCkgcmVxdWVzdCxcbiAgICAvLyBzbyBuZWVkIHRvIGNvbnRpbnVlIChzYW1lIGFzIGZvciBhYm92ZSlcbiAgICBpZiAodGhpcy5fcmV0cmllcyAhPT0gcmV0cmllcykgcmV0dXJuO1xuICAgIC8vIGlmIHdlJ3ZlIHJlY2VpdmVkIGEgcmVzcG9uc2UgdGhlbiB3ZSBkb24ndCB3YW50IHRvIGxldFxuICAgIC8vIGFuIGVycm9yIGluIHRoZSByZXF1ZXN0IGJsb3cgdXAgdGhlIHJlc3BvbnNlXG4gICAgaWYgKHRoaXMucmVzcG9uc2UpIHJldHVybjtcbiAgICB0aGlzLmNhbGxiYWNrKGVycm9yKTtcbiAgfSk7XG5cbiAgLy8gYXV0aFxuICBpZiAodXJsLmF1dGgpIHtcbiAgICBjb25zdCBhdXRoID0gdXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICB0aGlzLmF1dGgoYXV0aFswXSwgYXV0aFsxXSk7XG4gIH1cblxuICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XG4gICAgdGhpcy5hdXRoKHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQpO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAoaGFzT3duKHRoaXMuaGVhZGVyLCBrZXkpKSByZXEuc2V0SGVhZGVyKGtleSwgdGhpcy5oZWFkZXJba2V5XSk7XG4gIH1cblxuICAvLyBhZGQgY29va2llc1xuICBpZiAodGhpcy5jb29raWVzKSB7XG4gICAgaWYgKGhhc093bih0aGlzLl9oZWFkZXIsICdjb29raWUnKSkge1xuICAgICAgLy8gbWVyZ2VcbiAgICAgIGNvbnN0IHRlbXBvcmFyeUphciA9IG5ldyBDb29raWVKYXIuQ29va2llSmFyKCk7XG4gICAgICB0ZW1wb3JhcnlKYXIuc2V0Q29va2llcyh0aGlzLl9oZWFkZXIuY29va2llLnNwbGl0KCc7JykpO1xuICAgICAgdGVtcG9yYXJ5SmFyLnNldENvb2tpZXModGhpcy5jb29raWVzLnNwbGl0KCc7JykpO1xuICAgICAgcmVxLnNldEhlYWRlcihcbiAgICAgICAgJ0Nvb2tpZScsXG4gICAgICAgIHRlbXBvcmFyeUphci5nZXRDb29raWVzKENvb2tpZUphci5Db29raWVBY2Nlc3NJbmZvLkFsbCkudG9WYWx1ZVN0cmluZygpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXEuc2V0SGVhZGVyKCdDb29raWUnLCB0aGlzLmNvb2tpZXMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2sgd2l0aCBgZXJyYCBhbmQgYHJlc2BcbiAqIGFuZCBoYW5kbGUgYXJpdHkgY2hlY2suXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24gKGVycm9yLCByZXMpIHtcbiAgaWYgKHRoaXMuX3Nob3VsZFJldHJ5KGVycm9yLCByZXMpKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JldHJ5KCk7XG4gIH1cblxuICAvLyBBdm9pZCB0aGUgZXJyb3Igd2hpY2ggaXMgZW1pdHRlZCBmcm9tICdzb2NrZXQgaGFuZyB1cCcgdG8gY2F1c2UgdGhlIGZuIHVuZGVmaW5lZCBlcnJvciBvbiBKUyBydW50aW1lLlxuICBjb25zdCBmbiA9IHRoaXMuX2NhbGxiYWNrIHx8IG5vb3A7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGlmICh0aGlzLmNhbGxlZCkgcmV0dXJuIGNvbnNvbGUud2Fybignc3VwZXJhZ2VudDogZG91YmxlIGNhbGxiYWNrIGJ1ZycpO1xuICB0aGlzLmNhbGxlZCA9IHRydWU7XG5cbiAgaWYgKCFlcnJvcikge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuX2lzUmVzcG9uc2VPSyhyZXMpKSB7XG4gICAgICAgIGxldCBtZXNzYWdlID0gJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJztcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIG1lc3NhZ2UgPSBodHRwLlNUQVRVU19DT0RFU1tyZXMuc3RhdHVzXSB8fCBtZXNzYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGVycm9yLnN0YXR1cyA9IHJlcyA/IHJlcy5zdGF0dXMgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvciA9IGVycjtcbiAgICAgIGVycm9yLnN0YXR1cyA9IGVycm9yLnN0YXR1cyB8fCAocmVzID8gcmVzLnN0YXR1cyA6IHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gSXQncyBpbXBvcnRhbnQgdGhhdCB0aGUgY2FsbGJhY2sgaXMgY2FsbGVkIG91dHNpZGUgdHJ5L2NhdGNoXG4gIC8vIHRvIGF2b2lkIGRvdWJsZSBjYWxsYmFja1xuICBpZiAoIWVycm9yKSB7XG4gICAgcmV0dXJuIGZuKG51bGwsIHJlcyk7XG4gIH1cblxuICBlcnJvci5yZXNwb25zZSA9IHJlcztcbiAgaWYgKHRoaXMuX21heFJldHJpZXMpIGVycm9yLnJldHJpZXMgPSB0aGlzLl9yZXRyaWVzIC0gMTtcblxuICAvLyBvbmx5IGVtaXQgZXJyb3IgZXZlbnQgaWYgdGhlcmUgaXMgYSBsaXN0ZW5lclxuICAvLyBvdGhlcndpc2Ugd2UgYXNzdW1lIHRoZSBjYWxsYmFjayB0byBgLmVuZCgpYCB3aWxsIGdldCB0aGUgZXJyb3JcbiAgaWYgKGVycm9yICYmIHRoaXMubGlzdGVuZXJzKCdlcnJvcicpLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICB9XG5cbiAgZm4oZXJyb3IsIHJlcyk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBob3N0IG9iamVjdFxuICogQHJldHVybiB7Qm9vbGVhbn0gaXMgYSBob3N0IG9iamVjdFxuICogQGFwaSBwcml2YXRlXG4gKi9cblJlcXVlc3QucHJvdG90eXBlLl9pc0hvc3QgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gIHJldHVybiAoXG4gICAgQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkgfHxcbiAgICBvYmplY3QgaW5zdGFuY2VvZiBTdHJlYW0gfHxcbiAgICBvYmplY3QgaW5zdGFuY2VvZiBGb3JtRGF0YVxuICApO1xufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4oZXJyLCByZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZW1pdFJlc3BvbnNlID0gZnVuY3Rpb24gKGJvZHksIGZpbGVzKSB7XG4gIGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKHRoaXMpO1xuICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIHJlc3BvbnNlLnJlZGlyZWN0cyA9IHRoaXMuX3JlZGlyZWN0TGlzdDtcbiAgaWYgKHVuZGVmaW5lZCAhPT0gYm9keSkge1xuICAgIHJlc3BvbnNlLmJvZHkgPSBib2R5O1xuICB9XG5cbiAgcmVzcG9uc2UuZmlsZXMgPSBmaWxlcztcbiAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgIHJlc3BvbnNlLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiZW5kKCkgaGFzIGFscmVhZHkgYmVlbiBjYWxsZWQsIHNvIGl0J3MgdG9vIGxhdGUgdG8gc3RhcnQgcGlwaW5nXCJcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIHRoaXMuZW1pdCgncmVzcG9uc2UnLCByZXNwb25zZSk7XG4gIHJldHVybiByZXNwb25zZTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChmbikge1xuICB0aGlzLnJlcXVlc3QoKTtcbiAgZGVidWcoJyVzICVzJywgdGhpcy5tZXRob2QsIHRoaXMudXJsKTtcblxuICBpZiAodGhpcy5fZW5kQ2FsbGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJy5lbmQoKSB3YXMgY2FsbGVkIHR3aWNlLiBUaGlzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gc3VwZXJhZ2VudCdcbiAgICApO1xuICB9XG5cbiAgdGhpcy5fZW5kQ2FsbGVkID0gdHJ1ZTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgdGhpcy5fZW5kKCk7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZW5kID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYWJvcnRlZClcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFjayhcbiAgICAgIG5ldyBFcnJvcignVGhlIHJlcXVlc3QgaGFzIGJlZW4gYWJvcnRlZCBldmVuIGJlZm9yZSAuZW5kKCkgd2FzIGNhbGxlZCcpXG4gICAgKTtcblxuICBsZXQgZGF0YSA9IHRoaXMuX2RhdGE7XG4gIGNvbnN0IHsgcmVxIH0gPSB0aGlzO1xuICBjb25zdCB7IG1ldGhvZCB9ID0gdGhpcztcblxuICB0aGlzLl9zZXRUaW1lb3V0cygpO1xuXG4gIC8vIGJvZHlcbiAgaWYgKG1ldGhvZCAhPT0gJ0hFQUQnICYmICFyZXEuX2hlYWRlclNlbnQpIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgY29udGVudFR5cGUgPSByZXEuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgIC8vIFBhcnNlIG91dCBqdXN0IHRoZSBjb250ZW50IHR5cGUgZnJvbSB0aGUgaGVhZGVyIChpZ25vcmUgdGhlIGNoYXJzZXQpXG4gICAgICBpZiAoY29udGVudFR5cGUpIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUuc3BsaXQoJzsnKVswXTtcbiAgICAgIGxldCBzZXJpYWxpemUgPSB0aGlzLl9zZXJpYWxpemVyIHx8IGV4cG9ydHMuc2VyaWFsaXplW2NvbnRlbnRUeXBlXTtcbiAgICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHtcbiAgICAgICAgc2VyaWFsaXplID0gZXhwb3J0cy5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBjb250ZW50LWxlbmd0aFxuICAgIGlmIChkYXRhICYmICFyZXEuZ2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcpKSB7XG4gICAgICByZXEuc2V0SGVhZGVyKFxuICAgICAgICAnQ29udGVudC1MZW5ndGgnLFxuICAgICAgICBCdWZmZXIuaXNCdWZmZXIoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlc3BvbnNlXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG4gIHJlcS5vbmNlKCdyZXNwb25zZScsIChyZXMpID0+IHtcbiAgICBkZWJ1ZygnJXMgJXMgLT4gJXMnLCB0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHJlcy5zdGF0dXNDb2RlKTtcblxuICAgIGlmICh0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5waXBlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1heCA9IHRoaXMuX21heFJlZGlyZWN0cztcbiAgICBjb25zdCBtaW1lID0gdXRpbHMudHlwZShyZXMuaGVhZGVyc1snY29udGVudC10eXBlJ10gfHwgJycpIHx8ICd0ZXh0L3BsYWluJztcbiAgICBsZXQgdHlwZSA9IG1pbWUuc3BsaXQoJy8nKVswXTtcbiAgICBpZiAodHlwZSkgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgY29uc3QgbXVsdGlwYXJ0ID0gdHlwZSA9PT0gJ211bHRpcGFydCc7XG4gICAgY29uc3QgcmVkaXJlY3QgPSBpc1JlZGlyZWN0KHJlcy5zdGF0dXNDb2RlKTtcbiAgICBjb25zdCByZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGU7XG5cbiAgICB0aGlzLnJlcyA9IHJlcztcblxuICAgIC8vIHJlZGlyZWN0XG4gICAgaWYgKHJlZGlyZWN0ICYmIHRoaXMuX3JlZGlyZWN0cysrICE9PSBtYXgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWRpcmVjdChyZXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgICB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgICAgdGhpcy5jYWxsYmFjayhudWxsLCB0aGlzLl9lbWl0UmVzcG9uc2UoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gemxpYiBzdXBwb3J0XG4gICAgaWYgKHRoaXMuX3Nob3VsZFVuemlwKHJlcykpIHtcbiAgICAgIHVuemlwKHJlcSwgcmVzKTtcbiAgICB9XG5cbiAgICBsZXQgYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuICAgIGlmIChidWZmZXIgPT09IHVuZGVmaW5lZCAmJiBtaW1lIGluIGV4cG9ydHMuYnVmZmVyKSB7XG4gICAgICBidWZmZXIgPSBCb29sZWFuKGV4cG9ydHMuYnVmZmVyW21pbWVdKTtcbiAgICB9XG5cbiAgICBsZXQgcGFyc2VyID0gdGhpcy5fcGFyc2VyO1xuICAgIGlmICh1bmRlZmluZWQgPT09IGJ1ZmZlciAmJiBwYXJzZXIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJBIGN1c3RvbSBzdXBlcmFnZW50IHBhcnNlciBoYXMgYmVlbiBzZXQsIGJ1dCBidWZmZXJpbmcgc3RyYXRlZ3kgZm9yIHRoZSBwYXJzZXIgaGFzbid0IGJlZW4gY29uZmlndXJlZC4gQ2FsbCBgcmVxLmJ1ZmZlcih0cnVlIG9yIGZhbHNlKWAgb3Igc2V0IGBzdXBlcmFnZW50LmJ1ZmZlclttaW1lXSA9IHRydWUgb3IgZmFsc2VgXCJcbiAgICAgICk7XG4gICAgICBidWZmZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghcGFyc2VyKSB7XG4gICAgICBpZiAocmVzcG9uc2VUeXBlKSB7XG4gICAgICAgIHBhcnNlciA9IGV4cG9ydHMucGFyc2UuaW1hZ2U7IC8vIEl0J3MgYWN0dWFsbHkgYSBnZW5lcmljIEJ1ZmZlclxuICAgICAgICBidWZmZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChtdWx0aXBhcnQpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGZvcm1pZGFibGUoKTtcbiAgICAgICAgcGFyc2VyID0gZm9ybS5wYXJzZS5iaW5kKGZvcm0pO1xuICAgICAgICBidWZmZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0JpbmFyeShtaW1lKSkge1xuICAgICAgICBwYXJzZXIgPSBleHBvcnRzLnBhcnNlLmltYWdlO1xuICAgICAgICBidWZmZXIgPSB0cnVlOyAvLyBGb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgYnVmZmVyaW5nIGRlZmF1bHQgaXMgYWQtaG9jIE1JTUUtZGVwZW5kZW50XG4gICAgICB9IGVsc2UgaWYgKGV4cG9ydHMucGFyc2VbbWltZV0pIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZVttaW1lXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgIHBhcnNlciA9IGV4cG9ydHMucGFyc2UudGV4dDtcbiAgICAgICAgYnVmZmVyID0gYnVmZmVyICE9PSBmYWxzZTtcbiAgICAgICAgLy8gZXZlcnlvbmUgd2FudHMgdGhlaXIgb3duIHdoaXRlLWxhYmVsZWQganNvblxuICAgICAgfSBlbHNlIGlmIChpc0pTT04obWltZSkpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZVsnYXBwbGljYXRpb24vanNvbiddO1xuICAgICAgICBidWZmZXIgPSBidWZmZXIgIT09IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChidWZmZXIpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZS50ZXh0O1xuICAgICAgfSBlbHNlIGlmICh1bmRlZmluZWQgPT09IGJ1ZmZlcikge1xuICAgICAgICBwYXJzZXIgPSBleHBvcnRzLnBhcnNlLmltYWdlOyAvLyBJdCdzIGFjdHVhbGx5IGEgZ2VuZXJpYyBCdWZmZXJcbiAgICAgICAgYnVmZmVyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBieSBkZWZhdWx0IG9ubHkgYnVmZmVyIHRleHQvKiwganNvbiBhbmQgbWVzc2VkIHVwIHRoaW5nIGZyb20gaGVsbFxuICAgIGlmICgodW5kZWZpbmVkID09PSBidWZmZXIgJiYgaXNUZXh0KG1pbWUpKSB8fCBpc0pTT04obWltZSkpIHtcbiAgICAgIGJ1ZmZlciA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzQnVmZmVyZWQgPSBidWZmZXI7XG4gICAgbGV0IHBhcnNlckhhbmRsZXNFbmQgPSBmYWxzZTtcbiAgICBpZiAoYnVmZmVyKSB7XG4gICAgICAvLyBQcm90ZWN0aW9uYSBhZ2FpbnN0IHppcCBib21icyBhbmQgb3RoZXIgbnVpc2FuY2VcbiAgICAgIGxldCByZXNwb25zZUJ5dGVzTGVmdCA9IHRoaXMuX21heFJlc3BvbnNlU2l6ZSB8fCAyMDBfMDAwXzAwMDtcbiAgICAgIHJlcy5vbignZGF0YScsIChidWYpID0+IHtcbiAgICAgICAgcmVzcG9uc2VCeXRlc0xlZnQgLT0gYnVmLmJ5dGVMZW5ndGggfHwgYnVmLmxlbmd0aCA+IDAgPyBidWYubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKHJlc3BvbnNlQnl0ZXNMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCBwcm9wYWdhdGUgdGhyb3VnaCBlcnJvciBldmVudFxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdNYXhpbXVtIHJlc3BvbnNlIHNpemUgcmVhY2hlZCcpO1xuICAgICAgICAgIGVycm9yLmNvZGUgPSAnRVRPT0xBUkdFJztcbiAgICAgICAgICAvLyBQYXJzZXJzIGFyZW4ndCByZXF1aXJlZCB0byBvYnNlcnZlIGVycm9yIGV2ZW50LFxuICAgICAgICAgIC8vIHNvIHdvdWxkIGluY29ycmVjdGx5IHJlcG9ydCBzdWNjZXNzXG4gICAgICAgICAgcGFyc2VySGFuZGxlc0VuZCA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdpbGwgbm90IGVtaXQgZXJyb3IgZXZlbnRcbiAgICAgICAgICByZXMuZGVzdHJveShlcnJvcik7XG4gICAgICAgICAgLy8gc28gd2UgZG8gY2FsbGJhY2sgbm93XG4gICAgICAgICAgdGhpcy5jYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYXJzZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFVuYnVmZmVyZWQgcGFyc2VycyBhcmUgc3VwcG9zZWQgdG8gZW1pdCByZXNwb25zZSBlYXJseSxcbiAgICAgICAgLy8gd2hpY2ggaXMgd2VpcmQgQlRXLCBiZWNhdXNlIHJlc3BvbnNlLmJvZHkgd29uJ3QgYmUgdGhlcmUuXG4gICAgICAgIHBhcnNlckhhbmRsZXNFbmQgPSBidWZmZXI7XG5cbiAgICAgICAgcGFyc2VyKHJlcywgKGVycm9yLCBvYmplY3QsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMudGltZWRvdXQpIHtcbiAgICAgICAgICAgIC8vIFRpbWVvdXQgaGFzIGFscmVhZHkgaGFuZGxlZCBhbGwgY2FsbGJhY2tzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSW50ZW50aW9uYWwgKG5vbi10aW1lb3V0KSBhYm9ydCBpcyBzdXBwb3NlZCB0byBwcmVzZXJ2ZSBwYXJ0aWFsIHJlc3BvbnNlLFxuICAgICAgICAgIC8vIGV2ZW4gaWYgaXQgZG9lc24ndCBwYXJzZS5cbiAgICAgICAgICBpZiAoZXJyb3IgJiYgIXRoaXMuX2Fib3J0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFyc2VySGFuZGxlc0VuZCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgdGhpcy5fZW1pdFJlc3BvbnNlKG9iamVjdCwgZmlsZXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2soZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVzID0gcmVzO1xuXG4gICAgLy8gdW5idWZmZXJlZFxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBkZWJ1ZygndW5idWZmZXJlZCAlcyAlcycsIHRoaXMubWV0aG9kLCB0aGlzLnVybCk7XG4gICAgICB0aGlzLmNhbGxiYWNrKG51bGwsIHRoaXMuX2VtaXRSZXNwb25zZSgpKTtcbiAgICAgIGlmIChtdWx0aXBhcnQpIHJldHVybjsgLy8gYWxsb3cgbXVsdGlwYXJ0IHRvIGhhbmRsZSBlbmQgZXZlbnRcbiAgICAgIHJlcy5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGRlYnVnKCdlbmQgJXMgJXMnLCB0aGlzLm1ldGhvZCwgdGhpcy51cmwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdGVybWluYXRpbmcgZXZlbnRzXG4gICAgcmVzLm9uY2UoJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICBwYXJzZXJIYW5kbGVzRW5kID0gZmFsc2U7XG4gICAgICB0aGlzLmNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICB9KTtcbiAgICBpZiAoIXBhcnNlckhhbmRsZXNFbmQpXG4gICAgICByZXMub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgICBkZWJ1ZygnZW5kICVzICVzJywgdGhpcy5tZXRob2QsIHRoaXMudXJsKTtcbiAgICAgICAgLy8gVE9ETzogdW5sZXNzIGJ1ZmZlcmluZyBlbWl0IGVhcmxpZXIgdG8gc3RyZWFtXG4gICAgICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgdGhpcy5fZW1pdFJlc3BvbnNlKCkpO1xuICAgICAgfSk7XG4gIH0pO1xuXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuXG4gIGNvbnN0IGdldFByb2dyZXNzTW9uaXRvciA9ICgpID0+IHtcbiAgICBjb25zdCBsZW5ndGhDb21wdXRhYmxlID0gdHJ1ZTtcbiAgICBjb25zdCB0b3RhbCA9IHJlcS5nZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJyk7XG4gICAgbGV0IGxvYWRlZCA9IDA7XG5cbiAgICBjb25zdCBwcm9ncmVzcyA9IG5ldyBTdHJlYW0uVHJhbnNmb3JtKCk7XG4gICAgcHJvZ3Jlc3MuX3RyYW5zZm9ybSA9IChjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKSA9PiB7XG4gICAgICBsb2FkZWQgKz0gY2h1bmsubGVuZ3RoO1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIHtcbiAgICAgICAgZGlyZWN0aW9uOiAndXBsb2FkJyxcbiAgICAgICAgbGVuZ3RoQ29tcHV0YWJsZSxcbiAgICAgICAgbG9hZGVkLFxuICAgICAgICB0b3RhbFxuICAgICAgfSk7XG4gICAgICBjYWxsYmFjayhudWxsLCBjaHVuayk7XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9ncmVzcztcbiAgfTtcblxuICBjb25zdCBidWZmZXJUb0NodW5rcyA9IChidWZmZXIpID0+IHtcbiAgICBjb25zdCBjaHVua1NpemUgPSAxNiAqIDEwMjQ7IC8vIGRlZmF1bHQgaGlnaFdhdGVyTWFyayB2YWx1ZVxuICAgIGNvbnN0IGNodW5raW5nID0gbmV3IFN0cmVhbS5SZWFkYWJsZSgpO1xuICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICBjb25zdCByZW1haW5kZXIgPSB0b3RhbExlbmd0aCAlIGNodW5rU2l6ZTtcbiAgICBjb25zdCBjdXRvZmYgPSB0b3RhbExlbmd0aCAtIHJlbWFpbmRlcjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0b2ZmOyBpICs9IGNodW5rU2l6ZSkge1xuICAgICAgY29uc3QgY2h1bmsgPSBidWZmZXIuc2xpY2UoaSwgaSArIGNodW5rU2l6ZSk7XG4gICAgICBjaHVua2luZy5wdXNoKGNodW5rKTtcbiAgICB9XG5cbiAgICBpZiAocmVtYWluZGVyID4gMCkge1xuICAgICAgY29uc3QgcmVtYWluZGVyQnVmZmVyID0gYnVmZmVyLnNsaWNlKC1yZW1haW5kZXIpO1xuICAgICAgY2h1bmtpbmcucHVzaChyZW1haW5kZXJCdWZmZXIpO1xuICAgIH1cblxuICAgIGNodW5raW5nLnB1c2gobnVsbCk7IC8vIG5vIG1vcmUgZGF0YVxuXG4gICAgcmV0dXJuIGNodW5raW5nO1xuICB9O1xuXG4gIC8vIGlmIGEgRm9ybURhdGEgaW5zdGFuY2UgZ290IGNyZWF0ZWQsIHRoZW4gd2Ugc2VuZCB0aGF0IGFzIHRoZSByZXF1ZXN0IGJvZHlcbiAgY29uc3QgZm9ybURhdGEgPSB0aGlzLl9mb3JtRGF0YTtcbiAgaWYgKGZvcm1EYXRhKSB7XG4gICAgLy8gc2V0IGhlYWRlcnNcbiAgICBjb25zdCBoZWFkZXJzID0gZm9ybURhdGEuZ2V0SGVhZGVycygpO1xuICAgIGZvciAoY29uc3QgaSBpbiBoZWFkZXJzKSB7XG4gICAgICBpZiAoaGFzT3duKGhlYWRlcnMsIGkpKSB7XG4gICAgICAgIGRlYnVnKCdzZXR0aW5nIEZvcm1EYXRhIGhlYWRlcjogXCIlczogJXNcIicsIGksIGhlYWRlcnNbaV0pO1xuICAgICAgICByZXEuc2V0SGVhZGVyKGksIGhlYWRlcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF0dGVtcHQgdG8gZ2V0IFwiQ29udGVudC1MZW5ndGhcIiBoZWFkZXJcbiAgICBmb3JtRGF0YS5nZXRMZW5ndGgoKGVycm9yLCBsZW5ndGgpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBjaHVua2VkIGVuY29kaW5nIHdoZW4gbm8gbGVuZ3RoIChpZiBlcnIpXG4gICAgICBpZiAoZXJyb3IpIGRlYnVnKCdmb3JtRGF0YS5nZXRMZW5ndGggaGFkIGVycm9yJywgZXJyb3IsIGxlbmd0aCk7XG5cbiAgICAgIGRlYnVnKCdnb3QgRm9ybURhdGEgQ29udGVudC1MZW5ndGg6ICVzJywgbGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXEuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGZvcm1EYXRhLnBpcGUoZ2V0UHJvZ3Jlc3NNb25pdG9yKCkpLnBpcGUocmVxKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICBidWZmZXJUb0NodW5rcyhkYXRhKS5waXBlKGdldFByb2dyZXNzTW9uaXRvcigpKS5waXBlKHJlcSk7XG4gIH0gZWxzZSB7XG4gICAgcmVxLmVuZChkYXRhKTtcbiAgfVxufTtcblxuLy8gQ2hlY2sgd2hldGhlciByZXNwb25zZSBoYXMgYSBub24tMC1zaXplZCBnemlwLWVuY29kZWQgYm9keVxuUmVxdWVzdC5wcm90b3R5cGUuX3Nob3VsZFVuemlwID0gKHJlcykgPT4ge1xuICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwNCB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMzA0KSB7XG4gICAgLy8gVGhlc2UgYXJlbid0IHN1cHBvc2VkIHRvIGhhdmUgYW55IGJvZHlcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBoZWFkZXIgY29udGVudCBpcyBhIHN0cmluZywgYW5kIGRpc3RpbmN0aW9uIGJldHdlZW4gMCBhbmQgbm8gaW5mb3JtYXRpb24gaXMgY3J1Y2lhbFxuICBpZiAocmVzLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10gPT09ICcwJykge1xuICAgIC8vIFdlIGtub3cgdGhhdCB0aGUgYm9keSBpcyBlbXB0eSAodW5mb3J0dW5hdGVseSwgdGhpcyBjaGVjayBkb2VzIG5vdCBjb3ZlciBjaHVua2VkIGVuY29kaW5nKVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gIHJldHVybiAvXlxccyooPzpkZWZsYXRlfGd6aXApXFxzKiQvLnRlc3QocmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXSk7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlcyBETlMgZm9yIHNlbGVjdGVkIGhvc3RuYW1lcy4gVGFrZXMgb2JqZWN0IG1hcHBpbmcgaG9zdG5hbWVzIHRvIElQIGFkZHJlc3Nlcy5cbiAqXG4gKiBXaGVuIG1ha2luZyBhIHJlcXVlc3QgdG8gYSBVUkwgd2l0aCBhIGhvc3RuYW1lIGV4YWN0bHkgbWF0Y2hpbmcgYSBrZXkgaW4gdGhlIG9iamVjdCxcbiAqIHVzZSB0aGUgZ2l2ZW4gSVAgYWRkcmVzcyB0byBjb25uZWN0LCBpbnN0ZWFkIG9mIHVzaW5nIEROUyB0byByZXNvbHZlIHRoZSBob3N0bmFtZS5cbiAqXG4gKiBBIHNwZWNpYWwgaG9zdCBgKmAgbWF0Y2hlcyBldmVyeSBob3N0bmFtZSAoa2VlcCByZWRpcmVjdHMgaW4gbWluZCEpXG4gKlxuICogICAgICByZXF1ZXN0LmNvbm5lY3Qoe1xuICogICAgICAgICd0ZXN0LmV4YW1wbGUuY29tJzogJzEyNy4wLjAuMScsXG4gKiAgICAgICAgJ2lwdjYuZXhhbXBsZS5jb20nOiAnOjoxJyxcbiAqICAgICAgfSlcbiAqL1xuUmVxdWVzdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uIChjb25uZWN0T3ZlcnJpZGUpIHtcbiAgaWYgKHR5cGVvZiBjb25uZWN0T3ZlcnJpZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5fY29ubmVjdE92ZXJyaWRlID0geyAnKic6IGNvbm5lY3RPdmVycmlkZSB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBjb25uZWN0T3ZlcnJpZGUgPT09ICdvYmplY3QnKSB7XG4gICAgdGhpcy5fY29ubmVjdE92ZXJyaWRlID0gY29ubmVjdE92ZXJyaWRlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2Nvbm5lY3RPdmVycmlkZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUudHJ1c3RMb2NhbGhvc3QgPSBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gIHRoaXMuX3RydXN0TG9jYWxob3N0ID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdG9nZ2xlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGdlbmVyYXRlIEhUVFAgdmVyYiBtZXRob2RzXG5pZiAoIW1ldGhvZHMuaW5jbHVkZXMoJ2RlbCcpKSB7XG4gIC8vIGNyZWF0ZSBhIGNvcHkgc28gd2UgZG9uJ3QgY2F1c2UgY29uZmxpY3RzIHdpdGhcbiAgLy8gb3RoZXIgcGFja2FnZXMgdXNpbmcgdGhlIG1ldGhvZHMgcGFja2FnZSBhbmRcbiAgLy8gbnBtIDMueFxuICBtZXRob2RzID0gWy4uLm1ldGhvZHNdO1xuICBtZXRob2RzLnB1c2goJ2RlbCcpO1xufVxuXG5mb3IgKGxldCBtZXRob2Qgb2YgbWV0aG9kcykge1xuICBjb25zdCBuYW1lID0gbWV0aG9kO1xuICBtZXRob2QgPSBtZXRob2QgPT09ICdkZWwnID8gJ2RlbGV0ZScgOiBtZXRob2Q7XG5cbiAgbWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gIHJlcXVlc3RbbmFtZV0gPSAodXJsLCBkYXRhLCBmbikgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3RfID0gcmVxdWVzdChtZXRob2QsIHVybCk7XG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbiA9IGRhdGE7XG4gICAgICBkYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgcmVxdWVzdF8ucXVlcnkoZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0Xy5zZW5kKGRhdGEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmbikgcmVxdWVzdF8uZW5kKGZuKTtcbiAgICByZXR1cm4gcmVxdWVzdF87XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG1pbWVgIGlzIHRleHQgYW5kIHNob3VsZCBiZSBidWZmZXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWltZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gaXNUZXh0KG1pbWUpIHtcbiAgY29uc3QgcGFydHMgPSBtaW1lLnNwbGl0KCcvJyk7XG4gIGxldCB0eXBlID0gcGFydHNbMF07XG4gIGlmICh0eXBlKSB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgbGV0IHN1YnR5cGUgPSBwYXJ0c1sxXTtcbiAgaWYgKHN1YnR5cGUpIHN1YnR5cGUgPSBzdWJ0eXBlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gIHJldHVybiB0eXBlID09PSAndGV4dCcgfHwgc3VidHlwZSA9PT0gJ3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc7XG59XG5cbi8vIFRoaXMgaXMgbm90IGEgY2F0Y2hhbGwsIGJ1dCBhIHN0YXJ0LiBJdCBtaWdodCBiZSB1c2VmdWxcbi8vIGluIHRoZSBsb25nIHJ1biB0byBoYXZlIGZpbGUgdGhhdCBpbmNsdWRlcyBhbGwgYmluYXJ5XG4vLyBjb250ZW50IHR5cGVzIGZyb20gaHR0cHM6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvbWVkaWEtdHlwZXMvbWVkaWEtdHlwZXMueGh0bWxcbmZ1bmN0aW9uIGlzQmluYXJ5KG1pbWUpIHtcbiAgbGV0IFtyZWdpc3RyeSwgbmFtZV0gPSBtaW1lLnNwbGl0KCcvJyk7XG4gIGlmIChyZWdpc3RyeSkgcmVnaXN0cnkgPSByZWdpc3RyeS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgaWYgKG5hbWUpIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICByZXR1cm4gKFxuICAgIFsnYXVkaW8nLCAnZm9udCcsICdpbWFnZScsICd2aWRlbyddLmluY2x1ZGVzKHJlZ2lzdHJ5KSB8fFxuICAgIFsnZ3onLCAnZ3ppcCddLmluY2x1ZGVzKG5hbWUpXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG1pbWVgIGlzIGpzb24gb3IgaGFzICtqc29uIHN0cnVjdHVyZWQgc3ludGF4IHN1ZmZpeC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWltZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSlNPTihtaW1lKSB7XG4gIC8vIHNob3VsZCBtYXRjaCAvanNvbiBvciAranNvblxuICAvLyBidXQgbm90IC9qc29uLXNlcVxuICByZXR1cm4gL1svK11qc29uKCR8W14tXFx3XSkvaS50ZXN0KG1pbWUpO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHdlIHNob3VsZCBmb2xsb3cgdGhlIHJlZGlyZWN0IGBjb2RlYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gY29kZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzUmVkaXJlY3QoY29kZSkge1xuICByZXR1cm4gWzMwMSwgMzAyLCAzMDMsIDMwNSwgMzA3LCAzMDhdLmluY2x1ZGVzKGNvZGUpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBbUNBLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFBekNDLEtBQUssWUFBTEEsS0FBSztFQUFFQyxNQUFNLFlBQU5BLE1BQU07RUFBRUMsT0FBTyxZQUFQQSxPQUFPO0FBQzlCLE1BQU1DLE1BQU0sR0FBR0osT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNoQyxNQUFNSyxLQUFLLEdBQUdMLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDOUIsTUFBTU0sSUFBSSxHQUFHTixPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzVCLE1BQU1PLEVBQUUsR0FBR1AsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN4QixNQUFNUSxJQUFJLEdBQUdSLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDNUIsTUFBTVMsSUFBSSxHQUFHVCxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzVCLE1BQU1VLEVBQUUs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

/***/ }),

/***/ 4433:
/***/ ((module) => {

"use strict";


module.exports = (res, fn) => {
  const data = []; // Binary data needs binary storage

  res.on('data', chunk => {
    data.push(chunk);
  });
  res.on('end', () => {
    fn(null, Buffer.concat(data));
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmVzIiwiZm4iLCJkYXRhIiwib24iLCJjaHVuayIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbm9kZS9wYXJzZXJzL2ltYWdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gKHJlcywgZm4pID0+IHtcbiAgY29uc3QgZGF0YSA9IFtdOyAvLyBCaW5hcnkgZGF0YSBuZWVkcyBiaW5hcnkgc3RvcmFnZVxuXG4gIHJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIGRhdGEucHVzaChjaHVuayk7XG4gIH0pO1xuICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICBmbihudWxsLCBCdWZmZXIuY29uY2F0KGRhdGEpKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxNQUFNLENBQUNDLE9BQU8sR0FBRyxDQUFDQyxHQUFHLEVBQUVDLEVBQUUsS0FBSztFQUM1QixNQUFNQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7O0VBRWpCRixHQUFHLENBQUNHLEVBQUUsQ0FBQyxNQUFNLEVBQUdDLEtBQUssSUFBSztJQUN4QkYsSUFBSSxDQUFDRyxJQUFJLENBQUNELEtBQUssQ0FBQztFQUNsQixDQUFDLENBQUM7RUFDRkosR0FBRyxDQUFDRyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU07SUFDbEJGLEVBQUUsQ0FBQyxJQUFJLEVBQUVLLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDTCxJQUFJLENBQUMsQ0FBQztFQUMvQixDQUFDLENBQUM7QUFDSixDQUFDIn0=

/***/ }),

/***/ 913:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


exports["application/x-www-form-urlencoded"] = __nccwpck_require__(9073);
exports["application/json"] = __nccwpck_require__(2075);
exports.text = __nccwpck_require__(1715);
exports["application/json-seq"] = exports.text;
const binary = __nccwpck_require__(4433);
exports["application/octet-stream"] = binary;
exports["application/pdf"] = binary;
exports.image = binary;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJleHBvcnRzIiwicmVxdWlyZSIsInRleHQiLCJiaW5hcnkiLCJpbWFnZSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ub2RlL3BhcnNlcnMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0c1snYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ10gPSByZXF1aXJlKCcuL3VybGVuY29kZWQnKTtcbmV4cG9ydHNbJ2FwcGxpY2F0aW9uL2pzb24nXSA9IHJlcXVpcmUoJy4vanNvbicpO1xuZXhwb3J0cy50ZXh0ID0gcmVxdWlyZSgnLi90ZXh0Jyk7XG5cbmV4cG9ydHNbJ2FwcGxpY2F0aW9uL2pzb24tc2VxJ10gPSBleHBvcnRzLnRleHQ7XG5cbmNvbnN0IGJpbmFyeSA9IHJlcXVpcmUoJy4vaW1hZ2UnKTtcblxuZXhwb3J0c1snYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ10gPSBiaW5hcnk7XG5leHBvcnRzWydhcHBsaWNhdGlvbi9wZGYnXSA9IGJpbmFyeTtcbmV4cG9ydHMuaW1hZ2UgPSBiaW5hcnk7XG4iXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxHQUFHQyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3RFRCxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBR0MsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUMvQ0QsT0FBTyxDQUFDRSxJQUFJLEdBQUdELE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFFaENELE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHQSxPQUFPLENBQUNFLElBQUk7QUFFOUMsTUFBTUMsTUFBTSxHQUFHRixPQUFPLENBQUMsU0FBUyxDQUFDO0FBRWpDRCxPQUFPLENBQUMsMEJBQTBCLENBQUMsR0FBR0csTUFBTTtBQUM1Q0gsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUdHLE1BQU07QUFDbkNILE9BQU8sQ0FBQ0ksS0FBSyxHQUFHRCxNQUFNIn0=

/***/ }),

/***/ 2075:
/***/ ((module) => {

"use strict";


module.exports = function (res, fn) {
  res.text = '';
  res.setEncoding('utf8');
  res.on('data', chunk => {
    res.text += chunk;
  });
  res.on('end', () => {
    let body;
    let error;
    try {
      body = res.text && JSON.parse(res.text);
    } catch (err) {
      error = err;
      // issue #675: return the raw response if the response parsing fails
      error.rawResponse = res.text || null;
      // issue #876: return the http status code if the response parsing fails
      error.statusCode = res.statusCode;
    } finally {
      fn(error, body);
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmVzIiwiZm4iLCJ0ZXh0Iiwic2V0RW5jb2RpbmciLCJvbiIsImNodW5rIiwiYm9keSIsImVycm9yIiwiSlNPTiIsInBhcnNlIiwiZXJyIiwicmF3UmVzcG9uc2UiLCJzdGF0dXNDb2RlIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25vZGUvcGFyc2Vycy9qc29uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlcywgZm4pIHtcbiAgcmVzLnRleHQgPSAnJztcbiAgcmVzLnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIHJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIHJlcy50ZXh0ICs9IGNodW5rO1xuICB9KTtcbiAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgbGV0IGJvZHk7XG4gICAgbGV0IGVycm9yO1xuICAgIHRyeSB7XG4gICAgICBib2R5ID0gcmVzLnRleHQgJiYgSlNPTi5wYXJzZShyZXMudGV4dCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvciA9IGVycjtcbiAgICAgIC8vIGlzc3VlICM2NzU6IHJldHVybiB0aGUgcmF3IHJlc3BvbnNlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBlcnJvci5yYXdSZXNwb25zZSA9IHJlcy50ZXh0IHx8IG51bGw7XG4gICAgICAvLyBpc3N1ZSAjODc2OiByZXR1cm4gdGhlIGh0dHAgc3RhdHVzIGNvZGUgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgIGVycm9yLnN0YXR1c0NvZGUgPSByZXMuc3RhdHVzQ29kZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZm4oZXJyb3IsIGJvZHkpO1xuICAgIH1cbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxNQUFNLENBQUNDLE9BQU8sR0FBRyxVQUFVQyxHQUFHLEVBQUVDLEVBQUUsRUFBRTtFQUNsQ0QsR0FBRyxDQUFDRSxJQUFJLEdBQUcsRUFBRTtFQUNiRixHQUFHLENBQUNHLFdBQVcsQ0FBQyxNQUFNLENBQUM7RUFDdkJILEdBQUcsQ0FBQ0ksRUFBRSxDQUFDLE1BQU0sRUFBR0MsS0FBSyxJQUFLO0lBQ3hCTCxHQUFHLENBQUNFLElBQUksSUFBSUcsS0FBSztFQUNuQixDQUFDLENBQUM7RUFDRkwsR0FBRyxDQUFDSSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU07SUFDbEIsSUFBSUUsSUFBSTtJQUNSLElBQUlDLEtBQUs7SUFDVCxJQUFJO01BQ0ZELElBQUksR0FBR04sR0FBRyxDQUFDRSxJQUFJLElBQUlNLElBQUksQ0FBQ0MsS0FBSyxDQUFDVCxHQUFHLENBQUNFLElBQUksQ0FBQztJQUN6QyxDQUFDLENBQUMsT0FBT1EsR0FBRyxFQUFFO01BQ1pILEtBQUssR0FBR0csR0FBRztNQUNYO01BQ0FILEtBQUssQ0FBQ0ksV0FBVyxHQUFHWCxHQUFHLENBQUNFLElBQUksSUFBSSxJQUFJO01BQ3BDO01BQ0FLLEtBQUssQ0FBQ0ssVUFBVSxHQUFHWixHQUFHLENBQUNZLFVBQVU7SUFDbkMsQ0FBQyxTQUFTO01BQ1JYLEVBQUUsQ0FBQ00sS0FBSyxFQUFFRCxJQUFJLENBQUM7SUFDakI7RUFDRixDQUFDLENBQUM7QUFDSixDQUFDIn0=

/***/ }),

/***/ 1715:
/***/ ((module) => {

"use strict";


module.exports = (res, fn) => {
  res.text = '';
  res.setEncoding('utf8');
  res.on('data', chunk => {
    res.text += chunk;
  });
  res.on('end', fn);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmVzIiwiZm4iLCJ0ZXh0Iiwic2V0RW5jb2RpbmciLCJvbiIsImNodW5rIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25vZGUvcGFyc2Vycy90ZXh0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gKHJlcywgZm4pID0+IHtcbiAgcmVzLnRleHQgPSAnJztcbiAgcmVzLnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIHJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIHJlcy50ZXh0ICs9IGNodW5rO1xuICB9KTtcbiAgcmVzLm9uKCdlbmQnLCBmbik7XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxNQUFNLENBQUNDLE9BQU8sR0FBRyxDQUFDQyxHQUFHLEVBQUVDLEVBQUUsS0FBSztFQUM1QkQsR0FBRyxDQUFDRSxJQUFJLEdBQUcsRUFBRTtFQUNiRixHQUFHLENBQUNHLFdBQVcsQ0FBQyxNQUFNLENBQUM7RUFDdkJILEdBQUcsQ0FBQ0ksRUFBRSxDQUFDLE1BQU0sRUFBR0MsS0FBSyxJQUFLO0lBQ3hCTCxHQUFHLENBQUNFLElBQUksSUFBSUcsS0FBSztFQUNuQixDQUFDLENBQUM7RUFDRkwsR0FBRyxDQUFDSSxFQUFFLENBQUMsS0FBSyxFQUFFSCxFQUFFLENBQUM7QUFDbkIsQ0FBQyJ9

/***/ }),

/***/ 9073:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * Module dependencies.
 */

const qs = __nccwpck_require__(2760);
module.exports = (res, fn) => {
  res.text = '';
  res.setEncoding('ascii');
  res.on('data', chunk => {
    res.text += chunk;
  });
  res.on('end', () => {
    try {
      fn(null, qs.parse(res.text));
    } catch (err) {
      fn(err);
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJxcyIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVzIiwiZm4iLCJ0ZXh0Iiwic2V0RW5jb2RpbmciLCJvbiIsImNodW5rIiwicGFyc2UiLCJlcnIiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbm9kZS9wYXJzZXJzL3VybGVuY29kZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbmNvbnN0IHFzID0gcmVxdWlyZSgncXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAocmVzLCBmbikgPT4ge1xuICByZXMudGV4dCA9ICcnO1xuICByZXMuc2V0RW5jb2RpbmcoJ2FzY2lpJyk7XG4gIHJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIHJlcy50ZXh0ICs9IGNodW5rO1xuICB9KTtcbiAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGZuKG51bGwsIHFzLnBhcnNlKHJlcy50ZXh0KSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBmbihlcnIpO1xuICAgIH1cbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFFeEJDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHLENBQUNDLEdBQUcsRUFBRUMsRUFBRSxLQUFLO0VBQzVCRCxHQUFHLENBQUNFLElBQUksR0FBRyxFQUFFO0VBQ2JGLEdBQUcsQ0FBQ0csV0FBVyxDQUFDLE9BQU8sQ0FBQztFQUN4QkgsR0FBRyxDQUFDSSxFQUFFLENBQUMsTUFBTSxFQUFHQyxLQUFLLElBQUs7SUFDeEJMLEdBQUcsQ0FBQ0UsSUFBSSxJQUFJRyxLQUFLO0VBQ25CLENBQUMsQ0FBQztFQUNGTCxHQUFHLENBQUNJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTTtJQUNsQixJQUFJO01BQ0ZILEVBQUUsQ0FBQyxJQUFJLEVBQUVMLEVBQUUsQ0FBQ1UsS0FBSyxDQUFDTixHQUFHLENBQUNFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxPQUFPSyxHQUFHLEVBQUU7TUFDWk4sRUFBRSxDQUFDTSxHQUFHLENBQUM7SUFDVDtFQUNGLENBQUMsQ0FBQztBQUNKLENBQUMifQ==

/***/ }),

/***/ 9660:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * Module dependencies.
 */

const util = __nccwpck_require__(3837);
const Stream = __nccwpck_require__(2781);
const ResponseBase = __nccwpck_require__(8637);
const _require = __nccwpck_require__(5523),
  mixin = _require.mixin;

/**
 * Expose `Response`.
 */

module.exports = Response;

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * @param {Request} req
 * @param {Object} options
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @api private
 */

function Response(request) {
  Stream.call(this);
  this.res = request.res;
  const res = this.res;
  this.request = request;
  this.req = request.req;
  this.text = res.text;
  this.files = res.files || {};
  this.buffered = request._resBuffered;
  this.headers = res.headers;
  this.header = this.headers;
  this._setStatusProperties(res.statusCode);
  this._setHeaderProperties(this.header);
  this.setEncoding = res.setEncoding.bind(res);
  res.on('data', this.emit.bind(this, 'data'));
  res.on('end', this.emit.bind(this, 'end'));
  res.on('close', this.emit.bind(this, 'close'));
  res.on('error', this.emit.bind(this, 'error'));
}

// Lazy access res.body.
// https://github.com/nodejs/node/pull/39520#issuecomment-889697136
Object.defineProperty(Response.prototype, 'body', {
  get() {
    return this._body !== undefined ? this._body : this.res.body !== undefined ? this.res.body : {};
  },
  set(value) {
    this._body = value;
  }
});

/**
 * Inherit from `Stream`.
 */

util.inherits(Response, Stream);
mixin(Response.prototype, ResponseBase.prototype);

/**
 * Implements methods of a `ReadableStream`
 */

Response.prototype.destroy = function (error) {
  this.res.destroy(error);
};

/**
 * Pause.
 */

Response.prototype.pause = function () {
  this.res.pause();
};

/**
 * Resume.
 */

Response.prototype.resume = function () {
  this.res.resume();
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function () {
  const req = this.req;
  const method = req.method;
  const path = req.path;
  const message = `cannot ${method} ${path} (${this.status})`;
  const error = new Error(message);
  error.status = this.status;
  error.text = this.text;
  error.method = method;
  error.path = path;
  return error;
};
Response.prototype.setStatusProperties = function (status) {
  console.warn('In superagent 2.x setStatusProperties is a private method');
  return this._setStatusProperties(status);
};

/**
 * To json.
 *
 * @return {Object}
 * @api public
 */

Response.prototype.toJSON = function () {
  return {
    req: this.request.toJSON(),
    header: this.header,
    status: this.status,
    text: this.text
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1dGlsIiwicmVxdWlyZSIsIlN0cmVhbSIsIlJlc3BvbnNlQmFzZSIsIm1peGluIiwibW9kdWxlIiwiZXhwb3J0cyIsIlJlc3BvbnNlIiwicmVxdWVzdCIsImNhbGwiLCJyZXMiLCJyZXEiLCJ0ZXh0IiwiZmlsZXMiLCJidWZmZXJlZCIsIl9yZXNCdWZmZXJlZCIsImhlYWRlcnMiLCJoZWFkZXIiLCJfc2V0U3RhdHVzUHJvcGVydGllcyIsInN0YXR1c0NvZGUiLCJfc2V0SGVhZGVyUHJvcGVydGllcyIsInNldEVuY29kaW5nIiwiYmluZCIsIm9uIiwiZW1pdCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwicHJvdG90eXBlIiwiZ2V0IiwiX2JvZHkiLCJ1bmRlZmluZWQiLCJib2R5Iiwic2V0IiwidmFsdWUiLCJpbmhlcml0cyIsImRlc3Ryb3kiLCJlcnJvciIsInBhdXNlIiwicmVzdW1lIiwidG9FcnJvciIsIm1ldGhvZCIsInBhdGgiLCJtZXNzYWdlIiwic3RhdHVzIiwiRXJyb3IiLCJzZXRTdGF0dXNQcm9wZXJ0aWVzIiwiY29uc29sZSIsIndhcm4iLCJ0b0pTT04iXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS9yZXNwb25zZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuY29uc3QgUmVzcG9uc2VCYXNlID0gcmVxdWlyZSgnLi4vcmVzcG9uc2UtYmFzZScpO1xuY29uc3QgeyBtaXhpbiB9ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge1N0cmVhbX1cbiAqIEBpbXBsZW1lbnRzIHtSZWFkYWJsZVN0cmVhbX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcXVlc3QpIHtcbiAgU3RyZWFtLmNhbGwodGhpcyk7XG4gIHRoaXMucmVzID0gcmVxdWVzdC5yZXM7XG4gIGNvbnN0IHsgcmVzIH0gPSB0aGlzO1xuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB0aGlzLnJlcSA9IHJlcXVlc3QucmVxO1xuICB0aGlzLnRleHQgPSByZXMudGV4dDtcbiAgdGhpcy5maWxlcyA9IHJlcy5maWxlcyB8fCB7fTtcbiAgdGhpcy5idWZmZXJlZCA9IHJlcXVlc3QuX3Jlc0J1ZmZlcmVkO1xuICB0aGlzLmhlYWRlcnMgPSByZXMuaGVhZGVycztcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnM7XG4gIHRoaXMuX3NldFN0YXR1c1Byb3BlcnRpZXMocmVzLnN0YXR1c0NvZGUpO1xuICB0aGlzLl9zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcbiAgdGhpcy5zZXRFbmNvZGluZyA9IHJlcy5zZXRFbmNvZGluZy5iaW5kKHJlcyk7XG4gIHJlcy5vbignZGF0YScsIHRoaXMuZW1pdC5iaW5kKHRoaXMsICdkYXRhJykpO1xuICByZXMub24oJ2VuZCcsIHRoaXMuZW1pdC5iaW5kKHRoaXMsICdlbmQnKSk7XG4gIHJlcy5vbignY2xvc2UnLCB0aGlzLmVtaXQuYmluZCh0aGlzLCAnY2xvc2UnKSk7XG4gIHJlcy5vbignZXJyb3InLCB0aGlzLmVtaXQuYmluZCh0aGlzLCAnZXJyb3InKSk7XG59XG5cbi8vIExhenkgYWNjZXNzIHJlcy5ib2R5LlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL3B1bGwvMzk1MjAjaXNzdWVjb21tZW50LTg4OTY5NzEzNlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlc3BvbnNlLnByb3RvdHlwZSwgJ2JvZHknLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYm9keSAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHRoaXMuX2JvZHlcbiAgICAgIDogdGhpcy5yZXMuYm9keSAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHRoaXMucmVzLmJvZHlcbiAgICAgIDoge307XG4gIH0sXG4gIHNldCh2YWx1ZSkge1xuICAgIHRoaXMuX2JvZHkgPSB2YWx1ZTtcbiAgfVxufSk7XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBTdHJlYW1gLlxuICovXG5cbnV0aWwuaW5oZXJpdHMoUmVzcG9uc2UsIFN0cmVhbSk7XG5cbm1peGluKFJlc3BvbnNlLnByb3RvdHlwZSwgUmVzcG9uc2VCYXNlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogSW1wbGVtZW50cyBtZXRob2RzIG9mIGEgYFJlYWRhYmxlU3RyZWFtYFxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gIHRoaXMucmVzLmRlc3Ryb3koZXJyb3IpO1xufTtcblxuLyoqXG4gKiBQYXVzZS5cbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucmVzLnBhdXNlKCk7XG59O1xuXG4vKipcbiAqIFJlc3VtZS5cbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJlcy5yZXN1bWUoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGBFcnJvcmAgcmVwcmVzZW50YXRpdmUgb2YgdGhpcyByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHsgcmVxIH0gPSB0aGlzO1xuICBjb25zdCB7IG1ldGhvZCB9ID0gcmVxO1xuICBjb25zdCB7IHBhdGggfSA9IHJlcTtcblxuICBjb25zdCBtZXNzYWdlID0gYGNhbm5vdCAke21ldGhvZH0gJHtwYXRofSAoJHt0aGlzLnN0YXR1c30pYDtcbiAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIGVycm9yLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnJvci50ZXh0ID0gdGhpcy50ZXh0O1xuICBlcnJvci5tZXRob2QgPSBtZXRob2Q7XG4gIGVycm9yLnBhdGggPSBwYXRoO1xuXG4gIHJldHVybiBlcnJvcjtcbn07XG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHN0YXR1cykge1xuICBjb25zb2xlLndhcm4oJ0luIHN1cGVyYWdlbnQgMi54IHNldFN0YXR1c1Byb3BlcnRpZXMgaXMgYSBwcml2YXRlIG1ldGhvZCcpO1xuICByZXR1cm4gdGhpcy5fc2V0U3RhdHVzUHJvcGVydGllcyhzdGF0dXMpO1xufTtcblxuLyoqXG4gKiBUbyBqc29uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXE6IHRoaXMucmVxdWVzdC50b0pTT04oKSxcbiAgICBoZWFkZXI6IHRoaXMuaGVhZGVyLFxuICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgdGV4dDogdGhpcy50ZXh0XG4gIH07XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDNUIsTUFBTUMsTUFBTSxHQUFHRCxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ2hDLE1BQU1FLFlBQVksR0FB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

/***/ }),

/***/ 7060:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


/**
 * Module dependencies.
 */

const _require = __nccwpck_require__(1576),
  StringDecoder = _require.StringDecoder;
const Stream = __nccwpck_require__(2781);
const zlib = __nccwpck_require__(9796);

/**
 * Buffers response data events and re-emits when they're unzipped.
 *
 * @param {Request} req
 * @param {Response} res
 * @api private
 */

exports.unzip = (request, res) => {
  const unzip = zlib.createUnzip();
  const stream = new Stream();
  let decoder;

  // make node responseOnEnd() happy
  stream.req = request;
  unzip.on('error', error => {
    if (error && error.code === 'Z_BUF_ERROR') {
      // unexpected end of file is ignored by browsers and curl
      stream.emit('end');
      return;
    }
    stream.emit('error', error);
  });

  // pipe to unzip
  res.pipe(unzip);

  // override `setEncoding` to capture encoding
  res.setEncoding = type => {
    decoder = new StringDecoder(type);
  };

  // decode upon decompressing with captured encoding
  unzip.on('data', buf => {
    if (decoder) {
      const string_ = decoder.write(buf);
      if (string_.length > 0) stream.emit('data', string_);
    } else {
      stream.emit('data', buf);
    }
  });
  unzip.on('end', () => {
    stream.emit('end');
  });

  // override `on` to capture data listeners
  const _on = res.on;
  res.on = function (type, fn) {
    if (type === 'data' || type === 'end') {
      stream.on(type, fn.bind(res));
    } else if (type === 'error') {
      stream.on(type, fn.bind(res));
      _on.call(res, type, fn);
    } else {
      _on.call(res, type, fn);
    }
    return this;
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXF1aXJlIiwiU3RyaW5nRGVjb2RlciIsIlN0cmVhbSIsInpsaWIiLCJleHBvcnRzIiwidW56aXAiLCJyZXF1ZXN0IiwicmVzIiwiY3JlYXRlVW56aXAiLCJzdHJlYW0iLCJkZWNvZGVyIiwicmVxIiwib24iLCJlcnJvciIsImNvZGUiLCJlbWl0IiwicGlwZSIsInNldEVuY29kaW5nIiwidHlwZSIsImJ1ZiIsInN0cmluZ18iLCJ3cml0ZSIsImxlbmd0aCIsIl9vbiIsImZuIiwiYmluZCIsImNhbGwiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS91bnppcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgeyBTdHJpbmdEZWNvZGVyIH0gPSByZXF1aXJlKCdzdHJpbmdfZGVjb2RlcicpO1xuY29uc3QgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5jb25zdCB6bGliID0gcmVxdWlyZSgnemxpYicpO1xuXG4vKipcbiAqIEJ1ZmZlcnMgcmVzcG9uc2UgZGF0YSBldmVudHMgYW5kIHJlLWVtaXRzIHdoZW4gdGhleSdyZSB1bnppcHBlZC5cbiAqXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcVxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnVuemlwID0gKHJlcXVlc3QsIHJlcykgPT4ge1xuICBjb25zdCB1bnppcCA9IHpsaWIuY3JlYXRlVW56aXAoKTtcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbSgpO1xuICBsZXQgZGVjb2RlcjtcblxuICAvLyBtYWtlIG5vZGUgcmVzcG9uc2VPbkVuZCgpIGhhcHB5XG4gIHN0cmVhbS5yZXEgPSByZXF1ZXN0O1xuXG4gIHVuemlwLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgIGlmIChlcnJvciAmJiBlcnJvci5jb2RlID09PSAnWl9CVUZfRVJST1InKSB7XG4gICAgICAvLyB1bmV4cGVjdGVkIGVuZCBvZiBmaWxlIGlzIGlnbm9yZWQgYnkgYnJvd3NlcnMgYW5kIGN1cmxcbiAgICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gIH0pO1xuXG4gIC8vIHBpcGUgdG8gdW56aXBcbiAgcmVzLnBpcGUodW56aXApO1xuXG4gIC8vIG92ZXJyaWRlIGBzZXRFbmNvZGluZ2AgdG8gY2FwdHVyZSBlbmNvZGluZ1xuICByZXMuc2V0RW5jb2RpbmcgPSAodHlwZSkgPT4ge1xuICAgIGRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2Rlcih0eXBlKTtcbiAgfTtcblxuICAvLyBkZWNvZGUgdXBvbiBkZWNvbXByZXNzaW5nIHdpdGggY2FwdHVyZWQgZW5jb2RpbmdcbiAgdW56aXAub24oJ2RhdGEnLCAoYnVmKSA9PiB7XG4gICAgaWYgKGRlY29kZXIpIHtcbiAgICAgIGNvbnN0IHN0cmluZ18gPSBkZWNvZGVyLndyaXRlKGJ1Zik7XG4gICAgICBpZiAoc3RyaW5nXy5sZW5ndGggPiAwKSBzdHJlYW0uZW1pdCgnZGF0YScsIHN0cmluZ18pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJlYW0uZW1pdCgnZGF0YScsIGJ1Zik7XG4gICAgfVxuICB9KTtcblxuICB1bnppcC5vbignZW5kJywgKCkgPT4ge1xuICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgfSk7XG5cbiAgLy8gb3ZlcnJpZGUgYG9uYCB0byBjYXB0dXJlIGRhdGEgbGlzdGVuZXJzXG4gIGNvbnN0IF9vbiA9IHJlcy5vbjtcbiAgcmVzLm9uID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgaWYgKHR5cGUgPT09ICdkYXRhJyB8fCB0eXBlID09PSAnZW5kJykge1xuICAgICAgc3RyZWFtLm9uKHR5cGUsIGZuLmJpbmQocmVzKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgICBzdHJlYW0ub24odHlwZSwgZm4uYmluZChyZXMpKTtcbiAgICAgIF9vbi5jYWxsKHJlcywgdHlwZSwgZm4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfb24uY2FsbChyZXMsIHR5cGUsIGZuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn07XG4iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBOztBQUVBLGlCQUEwQkEsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0VBQTNDQyxhQUFhLFlBQWJBLGFBQWE7QUFDckIsTUFBTUMsTUFBTSxHQUFHRixPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ2hDLE1BQU1HLElBQUksR0FBR0gsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFJLE9BQU8sQ0FBQ0MsS0FBSyxHQUFHLENBQUNDLE9BQU8sRUFBRUMsR0FBRyxLQUFLO0VBQ2hDLE1BQU1GLEtBQUssR0FBR0YsSUFBSSxDQUFDSyxXQUFXLEVBQUU7RUFDaEMsTUFBTUMsTUFBTSxHQUFHLElBQUlQLE1BQU0sRUFBRTtFQUMzQixJQUFJUSxPQUFPOztFQUVYO0VBQ0FELE1BQU0sQ0FBQ0UsR0FBRyxHQUFHTCxPQUFPO0VBRXBCRCxLQUFLLENBQUNPLEVBQUUsQ0FBQyxPQUFPLEVBQUdDLEtBQUssSUFBSztJQUMzQixJQUFJQSxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsSUFBSSxLQUFLLGFBQWEsRUFBRTtNQUN6QztNQUNBTCxNQUFNLENBQUNNLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDbEI7SUFDRjtJQUVBTixNQUFNLENBQUNNLElBQUksQ0FBQyxPQUFPLEVBQUVGLEtBQUssQ0FBQztFQUM3QixDQUFDLENBQUM7O0VBRUY7RUFDQU4sR0FBRyxDQUFDUyxJQUFJLENBQUNYLEtBQUssQ0FBQzs7RUFFZjtFQUNBRSxHQUFHLENBQUNVLFdBQVcsR0FBSUMsSUFBSSxJQUFLO0lBQzFCUixPQUFPLEdBQUcsSUFBSVQsYUFBYSxDQUFDaUIsSUFBSSxDQUFDO0VBQ25DLENBQUM7O0VBRUQ7RUFDQWIsS0FBSyxDQUFDTyxFQUFFLENBQUMsTUFBTSxFQUFHTyxHQUFHLElBQUs7SUFDeEIsSUFBSVQsT0FBTyxFQUFFO01BQ1gsTUFBTVUsT0FBTyxHQUFHVixPQUFPLENBQUNXLEtBQUssQ0FBQ0YsR0FBRyxDQUFDO01BQ2xDLElBQUlDLE9BQU8sQ0FBQ0UsTUFBTSxHQUFHLENBQUMsRUFBRWIsTUFBTSxDQUFDTSxJQUFJLENBQUMsTUFBTSxFQUFFSyxPQUFPLENBQUM7SUFDdEQsQ0FBQyxNQUFNO01BQ0xYLE1BQU0sQ0FBQ00sSUFBSSxDQUFDLE1BQU0sRUFBRUksR0FBRyxDQUFDO0lBQzFCO0VBQ0YsQ0FBQyxDQUFDO0VBRUZkLEtBQUssQ0FBQ08sRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNO0lBQ3BCSCxNQUFNLENBQUNNLElBQUksQ0FBQyxLQUFLLENBQUM7RUFDcEIsQ0FBQyxDQUFDOztFQUVGO0VBQ0EsTUFBTVEsR0FBRyxHQUFHaEIsR0FBRyxDQUFDSyxFQUFFO0VBQ2xCTCxHQUFHLENBQUNLLEVBQUUsR0FBRyxVQUFVTSxJQUFJLEVBQUVNLEVBQUUsRUFBRTtJQUMzQixJQUFJTixJQUFJLEtBQUssTUFBTSxJQUFJQSxJQUFJLEtBQUssS0FBSyxFQUFFO01BQ3JDVCxNQUFNLENBQUNHLEVBQUUsQ0FBQ00sSUFBSSxFQUFFTSxFQUFFLENBQUNDLElBQUksQ0FBQ2xCLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUMsTUFBTSxJQUFJVyxJQUFJLEtBQUssT0FBTyxFQUFFO01BQzNCVCxNQUFNLENBQUNHLEVBQUUsQ0FBQ00sSUFBSSxFQUFFTSxFQUFFLENBQUNDLElBQUksQ0FBQ2xCLEdBQUcsQ0FBQyxDQUFDO01BQzdCZ0IsR0FBRyxDQUFDRyxJQUFJLENBQUNuQixHQUFHLEVBQUVXLElBQUksRUFBRU0sRUFBRSxDQUFDO0lBQ3pCLENBQUMsTUFBTTtNQUNMRCxHQUFHLENBQUNHLElBQUksQ0FBQ25CLEdBQUcsRUFBRVcsSUFBSSxFQUFFTSxFQUFFLENBQUM7SUFDekI7SUFFQSxPQUFPLElBQUk7RUFDYixDQUFDO0FBQ0gsQ0FBQyJ9

/***/ }),

/***/ 9723:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const semver = __nccwpck_require__(1383);

/**
 * Module of mixed-in functions shared between node and client code
 */
const _require = __nccwpck_require__(5523),
  isObject = _require.isObject,
  hasOwn = _require.hasOwn;

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase() {}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function () {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function (fn) {
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function (value) {
  this._responseType = value;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function (fn) {
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 * - upload is the time  since last bit of data was sent or received. This timeout works only if deadline timeout is off
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function (options) {
  if (!options || typeof options !== 'object') {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }
  for (const option in options) {
    if (hasOwn(options, option)) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;
        case 'response':
          this._responseTimeout = options.response;
          break;
        case 'upload':
          this._uploadTimeout = options.upload;
          break;
        default:
          console.warn('Unknown timeout option', option);
      }
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function (count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

//
// NOTE: we do not include ESOCKETTIMEDOUT because that is from `request` package
//       <https://github.com/sindresorhus/got/pull/537>
//
// NOTE: we do not include EADDRINFO because it was removed from libuv in 2014
//       <https://github.com/libuv/libuv/commit/02e1ebd40b807be5af46343ea873331b2ee4e9c1>
//       <https://github.com/request/request/search?q=ESOCKETTIMEDOUT&unscoped_q=ESOCKETTIMEDOUT>
//
//
// TODO: expose these as configurable defaults
//
const ERROR_CODES = new Set(['ETIMEDOUT', 'ECONNRESET', 'EADDRINUSE', 'ECONNREFUSED', 'EPIPE', 'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN']);
const STATUS_CODES = new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);

// TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
// const METHODS = new Set(['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE']);

/**
 * Determine if a request should be retried.
 * (Inspired by https://github.com/sindresorhus/got#retry)
 *
 * @param {Error} err an error
 * @param {Response} [res] response
 * @returns {Boolean} if segment should be retried
 */
RequestBase.prototype._shouldRetry = function (error, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      const override = this._retryCallback(error, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
  /*
  if (
    this.req &&
    this.req.method &&
    !METHODS.has(this.req.method.toUpperCase())
  )
    return false;
  */
  if (res && res.status && STATUS_CODES.has(res.status)) return true;
  if (error) {
    if (error.code && ERROR_CODES.has(error.code)) return true;
    // Superagent timeout
    if (error.timeout && error.code === 'ECONNABORTED') return true;
    if (error.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function () {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }
  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function (resolve, reject) {
  if (!this._fullfilledPromise) {
    const self = this;
    if (this._endCalled) {
      console.warn('Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
    }
    this._fullfilledPromise = new Promise((resolve, reject) => {
      self.on('abort', () => {
        if (this._maxRetries && this._maxRetries > this._retries) {
          return;
        }
        if (this.timedout && this.timedoutError) {
          reject(this.timedoutError);
          return;
        }
        const error = new Error('Aborted');
        error.code = 'ABORTED';
        error.status = this.status;
        error.method = this.method;
        error.url = this.url;
        reject(error);
      });
      self.end((error, res) => {
        if (error) reject(error);else resolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};
RequestBase.prototype.catch = function (callback) {
  return this.then(undefined, callback);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function (fn) {
  fn(this);
  return this;
};
RequestBase.prototype.ok = function (callback) {
  if (typeof callback !== 'function') throw new Error('Callback required');
  this._okCallback = callback;
  return this;
};
RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }
  if (this._okCallback) {
    return this._okCallback(res);
  }
  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, value) {
  if (isObject(field)) {
    for (const key in field) {
      if (hasOwn(field, key)) this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = value;
  this.header[field] = value;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field field name
 */
RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name name of field
 * @param {String|Blob|File|Buffer|fs.ReadStream} val value of field
 * @param {String} options extra options, e.g. 'blob'
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function (name, value, options) {
  // name should be either a string or an object.
  if (name === null || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }
  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject(name)) {
    for (const key in name) {
      if (hasOwn(name, key)) this.field(key, name[key]);
    }
    return this;
  }
  if (Array.isArray(value)) {
    for (const i in value) {
      if (hasOwn(value, i)) this.field(name, value[i]);
    }
    return this;
  }

  // val should be defined now
  if (value === null || undefined === value) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if (typeof value === 'boolean') {
    value = String(value);
  }

  // fix https://github.com/ladjs/superagent/issues/1680
  if (options) this._getFormData().append(name, value, options);else this._getFormData().append(name, value);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request} request
 * @api public
 */
RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  if (this.xhr) this.xhr.abort(); // browser
  if (this.req) {
    // Node v13 has major differences in `abort()`
    // https://github.com/nodejs/node/blob/v12.x/lib/internal/streams/end-of-stream.js
    // https://github.com/nodejs/node/blob/v13.x/lib/internal/streams/end-of-stream.js
    // https://github.com/nodejs/node/blob/v14.x/lib/internal/streams/end-of-stream.js
    // (if you run a diff across these you will see the differences)
    //
    // References:
    // <https://github.com/nodejs/node/issues/31630>
    // <https://github.com/ladjs/superagent/pull/1084/commits/dc18679a7c5ccfc6046d882015e5126888973bc8>
    //
    // Thanks to @shadowgate15 and @niftylettuce
    if (semver.gte(process.version, 'v13.0.0') && semver.lt(process.version, 'v14.0.0')) {
      // Note that the reason this doesn't work is because in v13 as compared to v14
      // there is no `callback = nop` set in end-of-stream.js above
      throw new Error('Superagent does not work in v13 properly with abort() due to Node.js core changes');
    } else if (semver.gte(process.version, 'v14.0.0')) {
      // We have to manually set `destroyed` to `true` in order for this to work
      // (see core internals of end-of-stream.js above in v14 branch as compared to v12)
      this.req.destroyed = true;
    }
    this.req.abort(); // node
  }

  this.clearTimeout();
  this.emit('abort');
  return this;
};
RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', `Basic ${base64Encoder(`${user}:${pass}`)}`);
      break;
    case 'auto':
      this.username = user;
      this.password = pass;
      break;
    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', `Bearer ${user}`);
      break;
    default:
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 * @param {Boolean} [on=true] - Set 'withCredentials' state
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on === undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does nothing in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n number of bytes
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function (n) {
  if (typeof n !== 'number') {
    throw new TypeError('Invalid argument');
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

// eslint-disable-next-line complexity
RequestBase.prototype.send = function (data) {
  const isObject_ = isObject(data);
  let type = this._header['content-type'];
  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject_ && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  }

  // merge
  if (isObject_ && isObject(this._data)) {
    for (const key in data) {
      if (hasOwn(data, key)) this._data[key] = data[key];
    }
  } else if (typeof data === 'string') {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if (type) type = type.toLowerCase().trim();
    if (type === 'application/x-www-form-urlencoded') {
      this._data = this._data ? `${this._data}&${data}` : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }
  if (!isObject_ || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function () {
  const query = this._query.join('&');
  if (query) {
    this.url += (this.url.includes('?') ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    const index = this.url.indexOf('?');
    if (index >= 0) {
      const queryArray = this.url.slice(index + 1).split('&');
      if (typeof this._sort === 'function') {
        queryArray.sort(this._sort);
      } else {
        queryArray.sort();
      }
      this.url = this.url.slice(0, index) + '?' + queryArray.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = () => {
  console.warn('Unsupported');
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  const error = new Error(`${reason + timeout}ms exceeded`);
  error.timeout = timeout;
  error.code = 'ECONNABORTED';
  error.errno = errno;
  this.timedout = true;
  this.timedoutError = error;
  this.abort();
  this.callback(error);
};
RequestBase.prototype._setTimeouts = function () {
  const self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(() => {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }

  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(() => {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzZW12ZXIiLCJyZXF1aXJlIiwiaXNPYmplY3QiLCJoYXNPd24iLCJtb2R1bGUiLCJleHBvcnRzIiwiUmVxdWVzdEJhc2UiLCJwcm90b3R5cGUiLCJjbGVhclRpbWVvdXQiLCJfdGltZXIiLCJfcmVzcG9uc2VUaW1lb3V0VGltZXIiLCJfdXBsb2FkVGltZW91dFRpbWVyIiwicGFyc2UiLCJmbiIsIl9wYXJzZXIiLCJyZXNwb25zZVR5cGUiLCJ2YWx1ZSIsIl9yZXNwb25zZVR5cGUiLCJzZXJpYWxpemUiLCJfc2VyaWFsaXplciIsInRpbWVvdXQiLCJvcHRpb25zIiwiX3RpbWVvdXQiLCJfcmVzcG9uc2VUaW1lb3V0IiwiX3VwbG9hZFRpbWVvdXQiLCJvcHRpb24iLCJkZWFkbGluZSIsInJlc3BvbnNlIiwidXBsb2FkIiwiY29uc29sZSIsIndhcm4iLCJyZXRyeSIsImNvdW50IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiX21heFJldHJpZXMiLCJfcmV0cmllcyIsIl9yZXRyeUNhbGxiYWNrIiwiRVJST1JfQ09ERVMiLCJTZXQiLCJTVEFUVVNfQ09ERVMiLCJfc2hvdWxkUmV0cnkiLCJlcnJvciIsInJlcyIsIm92ZXJyaWRlIiwiZXJyIiwic3RhdHVzIiwiaGFzIiwiY29kZSIsImNyb3NzRG9tYWluIiwiX3JldHJ5IiwicmVxIiwicmVxdWVzdCIsIl9hYm9ydGVkIiwidGltZWRvdXQiLCJ0aW1lZG91dEVycm9yIiwiX2VuZCIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiX2Z1bGxmaWxsZWRQcm9taXNlIiwic2VsZiIsIl9lbmRDYWxsZWQiLCJQcm9taXNlIiwib24iLCJFcnJvciIsIm1ldGhvZCIsInVybCIsImVuZCIsImNhdGNoIiwiY2FsbGJhY2siLCJ1bmRlZmluZWQiLCJ1c2UiLCJvayIsIl9va0NhbGxiYWNrIiwiX2lzUmVzcG9uc2VPSyIsImdldCIsImZpZWxkIiwiX2hlYWRlciIsInRvTG93ZXJDYXNlIiwiZ2V0SGVhZGVyIiwic2V0Iiwia2V5IiwiaGVhZGVyIiwidW5zZXQiLCJuYW1lIiwiX2RhdGEiLCJBcnJheSIsImlzQXJyYXkiLCJpIiwiU3RyaW5nIiwiX2dldEZvcm1EYXRhIiwiYXBwZW5kIiwiYWJvcnQiLCJ4aHIiLCJndGUiLCJwcm9jZXNzIiwidmVyc2lvbiIsImx0IiwiZGVzdHJveWVkIiwiZW1pdCIsIl9hdXRoIiwidXNlciIsInBhc3MiLCJiYXNlNjRFbmNvZGVyIiwidHlwZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJ3aXRoQ3JlZGVudGlhbHMiLCJfd2l0aENyZWRlbnRpYWxzIiwicmVkaXJlY3RzIiwibiIsIl9tYXhSZWRpcmVjdHMiLCJtYXhSZXNwb25zZVNpemUiLCJUeXBlRXJyb3IiLCJfbWF4UmVzcG9uc2VTaXplIiwidG9KU09OIiwiZGF0YSIsImhlYWRlcnMiLCJzZW5kIiwiaXNPYmplY3RfIiwiX2Zvcm1EYXRhIiwiX2lzSG9zdCIsInRyaW0iLCJzb3J0UXVlcnkiLCJzb3J0IiwiX3NvcnQiLCJfZmluYWxpemVRdWVyeVN0cmluZyIsInF1ZXJ5IiwiX3F1ZXJ5Iiwiam9pbiIsImluY2x1ZGVzIiwiaW5kZXgiLCJpbmRleE9mIiwicXVlcnlBcnJheSIsInNsaWNlIiwic3BsaXQiLCJfYXBwZW5kUXVlcnlTdHJpbmciLCJfdGltZW91dEVycm9yIiwicmVhc29uIiwiZXJybm8iLCJfc2V0VGltZW91dHMiLCJzZXRUaW1lb3V0Il0sInNvdXJjZXMiOlsiLi4vc3JjL3JlcXVlc3QtYmFzZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKTtcblxuLyoqXG4gKiBNb2R1bGUgb2YgbWl4ZWQtaW4gZnVuY3Rpb25zIHNoYXJlZCBiZXR3ZWVuIG5vZGUgYW5kIGNsaWVudCBjb2RlXG4gKi9cbmNvbnN0IHsgaXNPYmplY3QsIGhhc093biB9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdEJhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdEJhc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdEJhc2VgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdEJhc2UoKSB7fVxuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIGNsZWFyVGltZW91dCh0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcik7XG4gIGNsZWFyVGltZW91dCh0aGlzLl91cGxvYWRUaW1lb3V0VGltZXIpO1xuICBkZWxldGUgdGhpcy5fdGltZXI7XG4gIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcjtcbiAgZGVsZXRlIHRoaXMuX3VwbG9hZFRpbWVvdXRUaW1lcjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgcmVzcG9uc2UgYm9keSBwYXJzZXJcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHRvIGNvbnZlcnQgaW5jb21pbmcgZGF0YSBpbnRvIHJlcXVlc3QuYm9keVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChmbikge1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBmb3JtYXQgb2YgYmluYXJ5IHJlc3BvbnNlIGJvZHkuXG4gKiBJbiBicm93c2VyIHZhbGlkIGZvcm1hdHMgYXJlICdibG9iJyBhbmQgJ2FycmF5YnVmZmVyJyxcbiAqIHdoaWNoIHJldHVybiBCbG9iIGFuZCBBcnJheUJ1ZmZlciwgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIEluIE5vZGUgYWxsIHZhbHVlcyByZXN1bHQgaW4gQnVmZmVyLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnJlc3BvbnNlVHlwZSgnYmxvYicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZXNwb25zZVR5cGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdGhpcy5fcmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlcXVlc3QgYm9keSBzZXJpYWxpemVyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGRhdGEgc2V0IHZpYSAuc2VuZCBvciAuYXR0YWNoIGludG8gcGF5bG9hZCB0byBzZW5kXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIChmbikge1xuICB0aGlzLl9zZXJpYWxpemVyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGltZW91dHMuXG4gKlxuICogLSByZXNwb25zZSB0aW1lb3V0IGlzIHRpbWUgYmV0d2VlbiBzZW5kaW5nIHJlcXVlc3QgYW5kIHJlY2VpdmluZyB0aGUgZmlyc3QgYnl0ZSBvZiB0aGUgcmVzcG9uc2UuIEluY2x1ZGVzIEROUyBhbmQgY29ubmVjdGlvbiB0aW1lLlxuICogLSBkZWFkbGluZSBpcyB0aGUgdGltZSBmcm9tIHN0YXJ0IG9mIHRoZSByZXF1ZXN0IHRvIHJlY2VpdmluZyByZXNwb25zZSBib2R5IGluIGZ1bGwuIElmIHRoZSBkZWFkbGluZSBpcyB0b28gc2hvcnQgbGFyZ2UgZmlsZXMgbWF5IG5vdCBsb2FkIGF0IGFsbCBvbiBzbG93IGNvbm5lY3Rpb25zLlxuICogLSB1cGxvYWQgaXMgdGhlIHRpbWUgIHNpbmNlIGxhc3QgYml0IG9mIGRhdGEgd2FzIHNlbnQgb3IgcmVjZWl2ZWQuIFRoaXMgdGltZW91dCB3b3JrcyBvbmx5IGlmIGRlYWRsaW5lIHRpbWVvdXQgaXMgb2ZmXG4gKlxuICogVmFsdWUgb2YgMCBvciBmYWxzZSBtZWFucyBubyB0aW1lb3V0LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gbXMgb3Ige3Jlc3BvbnNlLCBkZWFkbGluZX1cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLl90aW1lb3V0ID0gb3B0aW9ucztcbiAgICB0aGlzLl9yZXNwb25zZVRpbWVvdXQgPSAwO1xuICAgIHRoaXMuX3VwbG9hZFRpbWVvdXQgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9yIChjb25zdCBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgIGlmIChoYXNPd24ob3B0aW9ucywgb3B0aW9uKSkge1xuICAgICAgc3dpdGNoIChvcHRpb24pIHtcbiAgICAgICAgY2FzZSAnZGVhZGxpbmUnOlxuICAgICAgICAgIHRoaXMuX3RpbWVvdXQgPSBvcHRpb25zLmRlYWRsaW5lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZXNwb25zZSc6XG4gICAgICAgICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0ID0gb3B0aW9ucy5yZXNwb25zZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBsb2FkJzpcbiAgICAgICAgICB0aGlzLl91cGxvYWRUaW1lb3V0ID0gb3B0aW9ucy51cGxvYWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS53YXJuKCdVbmtub3duIHRpbWVvdXQgb3B0aW9uJywgb3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IG51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBvbiBlcnJvci5cbiAqXG4gKiBGYWlsZWQgcmVxdWVzdHMgd2lsbCBiZSByZXRyaWVkICdjb3VudCcgdGltZXMgaWYgdGltZW91dCBvciBlcnIuY29kZSA+PSA1MDAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnJldHJ5ID0gZnVuY3Rpb24gKGNvdW50LCBmbikge1xuICAvLyBEZWZhdWx0IHRvIDEgaWYgbm8gY291bnQgcGFzc2VkIG9yIHRydWVcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgY291bnQgPT09IHRydWUpIGNvdW50ID0gMTtcbiAgaWYgKGNvdW50IDw9IDApIGNvdW50ID0gMDtcbiAgdGhpcy5fbWF4UmV0cmllcyA9IGNvdW50O1xuICB0aGlzLl9yZXRyaWVzID0gMDtcbiAgdGhpcy5fcmV0cnlDYWxsYmFjayA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBOT1RFOiB3ZSBkbyBub3QgaW5jbHVkZSBFU09DS0VUVElNRURPVVQgYmVjYXVzZSB0aGF0IGlzIGZyb20gYHJlcXVlc3RgIHBhY2thZ2Vcbi8vICAgICAgIDxodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2dvdC9wdWxsLzUzNz5cbi8vXG4vLyBOT1RFOiB3ZSBkbyBub3QgaW5jbHVkZSBFQUREUklORk8gYmVjYXVzZSBpdCB3YXMgcmVtb3ZlZCBmcm9tIGxpYnV2IGluIDIwMTRcbi8vICAgICAgIDxodHRwczovL2dpdGh1Yi5jb20vbGlidXYvbGlidXYvY29tbWl0LzAyZTFlYmQ0MGI4MDdiZTVhZjQ2MzQzZWE4NzMzMzFiMmVlNGU5YzE+XG4vLyAgICAgICA8aHR0cHM6Ly9naXRodWIuY29tL3JlcXVlc3QvcmVxdWVzdC9zZWFyY2g/cT1FU09DS0VUVElNRURPVVQmdW5zY29wZWRfcT1FU09DS0VUVElNRURPVVQ+XG4vL1xuLy9cbi8vIFRPRE86IGV4cG9zZSB0aGVzZSBhcyBjb25maWd1cmFibGUgZGVmYXVsdHNcbi8vXG5jb25zdCBFUlJPUl9DT0RFUyA9IG5ldyBTZXQoW1xuICAnRVRJTUVET1VUJyxcbiAgJ0VDT05OUkVTRVQnLFxuICAnRUFERFJJTlVTRScsXG4gICdFQ09OTlJFRlVTRUQnLFxuICAnRVBJUEUnLFxuICAnRU5PVEZPVU5EJyxcbiAgJ0VORVRVTlJFQUNIJyxcbiAgJ0VBSV9BR0FJTidcbl0pO1xuXG5jb25zdCBTVEFUVVNfQ09ERVMgPSBuZXcgU2V0KFtcbiAgNDA4LCA0MTMsIDQyOSwgNTAwLCA1MDIsIDUwMywgNTA0LCA1MjEsIDUyMiwgNTI0XG5dKTtcblxuLy8gVE9ETzogd2Ugd291bGQgbmVlZCB0byBtYWtlIHRoaXMgZWFzaWx5IGNvbmZpZ3VyYWJsZSBiZWZvcmUgYWRkaW5nIGl0IGluIChlLmcuIHNvbWUgbWlnaHQgd2FudCB0byBhZGQgUE9TVClcbi8vIGNvbnN0IE1FVEhPRFMgPSBuZXcgU2V0KFsnR0VUJywgJ1BVVCcsICdIRUFEJywgJ0RFTEVURScsICdPUFRJT05TJywgJ1RSQUNFJ10pO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHJlcXVlc3Qgc2hvdWxkIGJlIHJldHJpZWQuXG4gKiAoSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9nb3QjcmV0cnkpXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyIGFuIGVycm9yXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSBbcmVzXSByZXNwb25zZVxuICogQHJldHVybnMge0Jvb2xlYW59IGlmIHNlZ21lbnQgc2hvdWxkIGJlIHJldHJpZWRcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9zaG91bGRSZXRyeSA9IGZ1bmN0aW9uIChlcnJvciwgcmVzKSB7XG4gIGlmICghdGhpcy5fbWF4UmV0cmllcyB8fCB0aGlzLl9yZXRyaWVzKysgPj0gdGhpcy5fbWF4UmV0cmllcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0aGlzLl9yZXRyeUNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG92ZXJyaWRlID0gdGhpcy5fcmV0cnlDYWxsYmFjayhlcnJvciwgcmVzKTtcbiAgICAgIGlmIChvdmVycmlkZSA9PT0gdHJ1ZSkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAob3ZlcnJpZGUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyB1bmRlZmluZWQgZmFsbHMgYmFjayB0byBkZWZhdWx0c1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE86IHdlIHdvdWxkIG5lZWQgdG8gbWFrZSB0aGlzIGVhc2lseSBjb25maWd1cmFibGUgYmVmb3JlIGFkZGluZyBpdCBpbiAoZS5nLiBzb21lIG1pZ2h0IHdhbnQgdG8gYWRkIFBPU1QpXG4gIC8qXG4gIGlmIChcbiAgICB0aGlzLnJlcSAmJlxuICAgIHRoaXMucmVxLm1ldGhvZCAmJlxuICAgICFNRVRIT0RTLmhhcyh0aGlzLnJlcS5tZXRob2QudG9VcHBlckNhc2UoKSlcbiAgKVxuICAgIHJldHVybiBmYWxzZTtcbiAgKi9cbiAgaWYgKHJlcyAmJiByZXMuc3RhdHVzICYmIFNUQVRVU19DT0RFUy5oYXMocmVzLnN0YXR1cykpIHJldHVybiB0cnVlO1xuICBpZiAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IuY29kZSAmJiBFUlJPUl9DT0RFUy5oYXMoZXJyb3IuY29kZSkpIHJldHVybiB0cnVlO1xuICAgIC8vIFN1cGVyYWdlbnQgdGltZW91dFxuICAgIGlmIChlcnJvci50aW1lb3V0ICYmIGVycm9yLmNvZGUgPT09ICdFQ09OTkFCT1JURUQnKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoZXJyb3IuY3Jvc3NEb21haW4pIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXRyeSByZXF1ZXN0XG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX3JldHJ5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuXG4gIC8vIG5vZGVcbiAgaWYgKHRoaXMucmVxKSB7XG4gICAgdGhpcy5yZXEgPSBudWxsO1xuICAgIHRoaXMucmVxID0gdGhpcy5yZXF1ZXN0KCk7XG4gIH1cblxuICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7XG4gIHRoaXMudGltZWRvdXQgPSBmYWxzZTtcbiAgdGhpcy50aW1lZG91dEVycm9yID0gbnVsbDtcblxuICByZXR1cm4gdGhpcy5fZW5kKCk7XG59O1xuXG4vKipcbiAqIFByb21pc2Ugc3VwcG9ydFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZWplY3RdXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICBpZiAoIXRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnV2FybmluZzogc3VwZXJhZ2VudCByZXF1ZXN0IHdhcyBzZW50IHR3aWNlLCBiZWNhdXNlIGJvdGggLmVuZCgpIGFuZCAudGhlbigpIHdlcmUgY2FsbGVkLiBOZXZlciBjYWxsIC5lbmQoKSBpZiB5b3UgdXNlIHByb21pc2VzJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlbGYub24oJ2Fib3J0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fbWF4UmV0cmllcyAmJiB0aGlzLl9tYXhSZXRyaWVzID4gdGhpcy5fcmV0cmllcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWVkb3V0ICYmIHRoaXMudGltZWRvdXRFcnJvcikge1xuICAgICAgICAgIHJlamVjdCh0aGlzLnRpbWVkb3V0RXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdBYm9ydGVkJyk7XG4gICAgICAgIGVycm9yLmNvZGUgPSAnQUJPUlRFRCc7XG4gICAgICAgIGVycm9yLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICAgICAgICBlcnJvci5tZXRob2QgPSB0aGlzLm1ldGhvZDtcbiAgICAgICAgZXJyb3IudXJsID0gdGhpcy51cmw7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcbiAgICAgIHNlbGYuZW5kKChlcnJvciwgcmVzKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgZWxzZSByZXNvbHZlKHJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAoZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLm9rID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBFcnJvcignQ2FsbGJhY2sgcmVxdWlyZWQnKTtcbiAgdGhpcy5fb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5faXNSZXNwb25zZU9LID0gZnVuY3Rpb24gKHJlcykge1xuICBpZiAoIXJlcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0aGlzLl9va0NhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuX29rQ2FsbGJhY2socmVzKTtcbiAgfVxuXG4gIHJldHVybiByZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwO1xufTtcblxuLyoqXG4gKiBHZXQgcmVxdWVzdCBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZmllbGQpIHtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKiBUaGlzIGlzIGEgZGVwcmVjYXRlZCBpbnRlcm5hbCBBUEkuIFVzZSBgLmdldChmaWVsZClgIGluc3RlYWQuXG4gKlxuICogKGdldEhlYWRlciBpcyBubyBsb25nZXIgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBzdXBlcmFnZW50IGNvZGUgYmFzZSlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZ2V0SGVhZGVyID0gUmVxdWVzdEJhc2UucHJvdG90eXBlLmdldDtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChmaWVsZCwgdmFsdWUpIHtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGZpZWxkKSB7XG4gICAgICBpZiAoaGFzT3duKGZpZWxkLCBrZXkpKSB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsdWU7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnVuc2V0KCdVc2VyLUFnZW50JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGQgZmllbGQgbmFtZVxuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbiAoZmllbGQpIHtcbiAgZGVsZXRlIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbiAgZGVsZXRlIHRoaXMuaGVhZGVyW2ZpZWxkXTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0XG4gKiBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0pXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBuYW1lIG5hbWUgb2YgZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZXxCdWZmZXJ8ZnMuUmVhZFN0cmVhbX0gdmFsIHZhbHVlIG9mIGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucyBleHRyYSBvcHRpb25zLCBlLmcuICdibG9iJ1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgLy8gbmFtZSBzaG91bGQgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGFuIG9iamVjdC5cbiAgaWYgKG5hbWUgPT09IG51bGwgfHwgdW5kZWZpbmVkID09PSBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSBuYW1lIGNhbiBub3QgYmUgZW1wdHknKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9kYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCIuZmllbGQoKSBjYW4ndCBiZSB1c2VkIGlmIC5zZW5kKCkgaXMgdXNlZC4gUGxlYXNlIHVzZSBvbmx5IC5zZW5kKCkgb3Igb25seSAuZmllbGQoKSAmIC5hdHRhY2goKVwiXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChuYW1lKSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG5hbWUpIHtcbiAgICAgIGlmIChoYXNPd24obmFtZSwga2V5KSkgdGhpcy5maWVsZChrZXksIG5hbWVba2V5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gdmFsdWUpIHtcbiAgICAgIGlmIChoYXNPd24odmFsdWUsIGkpKSB0aGlzLmZpZWxkKG5hbWUsIHZhbHVlW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHZhbCBzaG91bGQgYmUgZGVmaW5lZCBub3dcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJy5maWVsZChuYW1lLCB2YWwpIHZhbCBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICAvLyBmaXggaHR0cHM6Ly9naXRodWIuY29tL2xhZGpzL3N1cGVyYWdlbnQvaXNzdWVzLzE2ODBcbiAgaWYgKG9wdGlvbnMpIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKG5hbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgZWxzZSB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gcmVxdWVzdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gIGlmICh0aGlzLnhocikgdGhpcy54aHIuYWJvcnQoKTsgLy8gYnJvd3NlclxuICBpZiAodGhpcy5yZXEpIHtcbiAgICAvLyBOb2RlIHYxMyBoYXMgbWFqb3IgZGlmZmVyZW5jZXMgaW4gYGFib3J0KClgXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvdjEyLngvbGliL2ludGVybmFsL3N0cmVhbXMvZW5kLW9mLXN0cmVhbS5qc1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL3YxMy54L2xpYi9pbnRlcm5hbC9zdHJlYW1zL2VuZC1vZi1zdHJlYW0uanNcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi92MTQueC9saWIvaW50ZXJuYWwvc3RyZWFtcy9lbmQtb2Ytc3RyZWFtLmpzXG4gICAgLy8gKGlmIHlvdSBydW4gYSBkaWZmIGFjcm9zcyB0aGVzZSB5b3Ugd2lsbCBzZWUgdGhlIGRpZmZlcmVuY2VzKVxuICAgIC8vXG4gICAgLy8gUmVmZXJlbmNlczpcbiAgICAvLyA8aHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2lzc3Vlcy8zMTYzMD5cbiAgICAvLyA8aHR0cHM6Ly9naXRodWIuY29tL2xhZGpzL3N1cGVyYWdlbnQvcHVsbC8xMDg0L2NvbW1pdHMvZGMxODY3OWE3YzVjY2ZjNjA0NmQ4ODIwMTVlNTEyNjg4ODk3M2JjOD5cbiAgICAvL1xuICAgIC8vIFRoYW5rcyB0byBAc2hhZG93Z2F0ZTE1IGFuZCBAbmlmdHlsZXR0dWNlXG4gICAgaWYgKFxuICAgICAgc2VtdmVyLmd0ZShwcm9jZXNzLnZlcnNpb24sICd2MTMuMC4wJykgJiZcbiAgICAgIHNlbXZlci5sdChwcm9jZXNzLnZlcnNpb24sICd2MTQuMC4wJylcbiAgICApIHtcbiAgICAgIC8vIE5vdGUgdGhhdCB0aGUgcmVhc29uIHRoaXMgZG9lc24ndCB3b3JrIGlzIGJlY2F1c2UgaW4gdjEzIGFzIGNvbXBhcmVkIHRvIHYxNFxuICAgICAgLy8gdGhlcmUgaXMgbm8gYGNhbGxiYWNrID0gbm9wYCBzZXQgaW4gZW5kLW9mLXN0cmVhbS5qcyBhYm92ZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnU3VwZXJhZ2VudCBkb2VzIG5vdCB3b3JrIGluIHYxMyBwcm9wZXJseSB3aXRoIGFib3J0KCkgZHVlIHRvIE5vZGUuanMgY29yZSBjaGFuZ2VzJ1xuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHNlbXZlci5ndGUocHJvY2Vzcy52ZXJzaW9uLCAndjE0LjAuMCcpKSB7XG4gICAgICAvLyBXZSBoYXZlIHRvIG1hbnVhbGx5IHNldCBgZGVzdHJveWVkYCB0byBgdHJ1ZWAgaW4gb3JkZXIgZm9yIHRoaXMgdG8gd29ya1xuICAgICAgLy8gKHNlZSBjb3JlIGludGVybmFscyBvZiBlbmQtb2Ytc3RyZWFtLmpzIGFib3ZlIGluIHYxNCBicmFuY2ggYXMgY29tcGFyZWQgdG8gdjEyKVxuICAgICAgdGhpcy5yZXEuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcS5hYm9ydCgpOyAvLyBub2RlXG4gIH1cblxuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9hdXRoID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIG9wdGlvbnMsIGJhc2U2NEVuY29kZXIpIHtcbiAgc3dpdGNoIChvcHRpb25zLnR5cGUpIHtcbiAgICBjYXNlICdiYXNpYyc6XG4gICAgICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsIGBCYXNpYyAke2Jhc2U2NEVuY29kZXIoYCR7dXNlcn06JHtwYXNzfWApfWApO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhdXRvJzpcbiAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VyO1xuICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3M7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JlYXJlcic6IC8vIHVzYWdlIHdvdWxkIGJlIC5hdXRoKGFjY2Vzc1Rva2VuLCB7IHR5cGU6ICdiZWFyZXInIH0pXG4gICAgICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt1c2VyfWApO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uPXRydWVdIC0gU2V0ICd3aXRoQ3JlZGVudGlhbHMnIHN0YXRlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uIChvbikge1xuICAvLyBUaGlzIGlzIGJyb3dzZXItb25seSBmdW5jdGlvbmFsaXR5LiBOb2RlIHNpZGUgaXMgbm8tb3AuXG4gIGlmIChvbiA9PT0gdW5kZWZpbmVkKSBvbiA9IHRydWU7XG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IG9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBtYXggcmVkaXJlY3RzIHRvIGBuYC4gRG9lcyBub3RoaW5nIGluIGJyb3dzZXIgWEhSIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnJlZGlyZWN0cyA9IGZ1bmN0aW9uIChuKSB7XG4gIHRoaXMuX21heFJlZGlyZWN0cyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNYXhpbXVtIHNpemUgb2YgYnVmZmVyZWQgcmVzcG9uc2UgYm9keSwgaW4gYnl0ZXMuIENvdW50cyB1bmNvbXByZXNzZWQgc2l6ZS5cbiAqIERlZmF1bHQgMjAwTUIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG4gbnVtYmVyIG9mIGJ5dGVzXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLm1heFJlc3BvbnNlU2l6ZSA9IGZ1bmN0aW9uIChuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50Jyk7XG4gIH1cblxuICB0aGlzLl9tYXhSZXNwb25zZVNpemUgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29udmVydCB0byBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IChub3QgSlNPTiBzdHJpbmcpIG9mIHNjYWxhciBwcm9wZXJ0aWVzLlxuICogTm90ZSBhcyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byByZXR1cm4gYSB1c2VmdWwgbm9uLXRoaXMgdmFsdWUsXG4gKiBpdCBjYW5ub3QgYmUgY2hhaW5lZC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGRlc2NyaWJpbmcgbWV0aG9kLCB1cmwsIGFuZCBkYXRhIG9mIHRoaXMgcmVxdWVzdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgdXJsOiB0aGlzLnVybCxcbiAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgIGhlYWRlcnM6IHRoaXMuX2hlYWRlclxuICB9O1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCBhcyB0aGUgcmVxdWVzdCBib2R5LCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0nKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICBjb25zdCBpc09iamVjdF8gPSBpc09iamVjdChkYXRhKTtcbiAgbGV0IHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuXG4gIGlmICh0aGlzLl9mb3JtRGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiLnNlbmQoKSBjYW4ndCBiZSB1c2VkIGlmIC5hdHRhY2goKSBvciAuZmllbGQoKSBpcyB1c2VkLiBQbGVhc2UgdXNlIG9ubHkgLnNlbmQoKSBvciBvbmx5IC5maWVsZCgpICYgLmF0dGFjaCgpXCJcbiAgICApO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0XyAmJiAhdGhpcy5fZGF0YSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgfSBlbHNlIGlmICghdGhpcy5faXNIb3N0KGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuICB9IGVsc2UgaWYgKGRhdGEgJiYgdGhpcy5fZGF0YSAmJiB0aGlzLl9pc0hvc3QodGhpcy5fZGF0YSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBtZXJnZSB0aGVzZSBzZW5kIGNhbGxzXCIpO1xuICB9XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKGlzT2JqZWN0XyAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgIGlmIChoYXNPd24oZGF0YSwga2V5KSkgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBkZWZhdWx0IHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgaWYgKHR5cGUpIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGlmICh0eXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEgPyBgJHt0aGlzLl9kYXRhfSYke2RhdGF9YCA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghaXNPYmplY3RfIHx8IHRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZGVmYXVsdCB0byBqc29uXG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTb3J0IGBxdWVyeXN0cmluZ2AgYnkgdGhlIHNvcnQgZnVuY3Rpb25cbiAqXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gZGVmYXVsdCBvcmRlclxuICogICAgICAgcmVxdWVzdC5nZXQoJy91c2VyJylcbiAqICAgICAgICAgLnF1ZXJ5KCduYW1lPU5pY2snKVxuICogICAgICAgICAucXVlcnkoJ3NlYXJjaD1NYW5ueScpXG4gKiAgICAgICAgIC5zb3J0UXVlcnkoKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGN1c3RvbWl6ZWQgc29ydCBmdW5jdGlvblxuICogICAgICAgcmVxdWVzdC5nZXQoJy91c2VyJylcbiAqICAgICAgICAgLnF1ZXJ5KCduYW1lPU5pY2snKVxuICogICAgICAgICAucXVlcnkoJ3NlYXJjaD1NYW5ueScpXG4gKiAgICAgICAgIC5zb3J0UXVlcnkoZnVuY3Rpb24oYSwgYil7XG4gKiAgICAgICAgICAgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGg7XG4gKiAgICAgICAgIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHNvcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuc29ydFF1ZXJ5ID0gZnVuY3Rpb24gKHNvcnQpIHtcbiAgLy8gX3NvcnQgZGVmYXVsdCB0byB0cnVlIGJ1dCBvdGhlcndpc2UgY2FuIGJlIGEgZnVuY3Rpb24gb3IgYm9vbGVhblxuICB0aGlzLl9zb3J0ID0gdHlwZW9mIHNvcnQgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IHNvcnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb21wb3NlIHF1ZXJ5c3RyaW5nIHRvIGFwcGVuZCB0byByZXEudXJsXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fZmluYWxpemVRdWVyeVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgcXVlcnkgPSB0aGlzLl9xdWVyeS5qb2luKCcmJyk7XG4gIGlmIChxdWVyeSkge1xuICAgIHRoaXMudXJsICs9ICh0aGlzLnVybC5pbmNsdWRlcygnPycpID8gJyYnIDogJz8nKSArIHF1ZXJ5O1xuICB9XG5cbiAgdGhpcy5fcXVlcnkubGVuZ3RoID0gMDsgLy8gTWFrZXMgdGhlIGNhbGwgaWRlbXBvdGVudFxuXG4gIGlmICh0aGlzLl9zb3J0KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IHF1ZXJ5QXJyYXkgPSB0aGlzLnVybC5zbGljZShpbmRleCArIDEpLnNwbGl0KCcmJyk7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3NvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcXVlcnlBcnJheS5zb3J0KHRoaXMuX3NvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlBcnJheS5zb3J0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuc2xpY2UoMCwgaW5kZXgpICsgJz8nICsgcXVlcnlBcnJheS5qb2luKCcmJyk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBGb3IgYmFja3dhcmRzIGNvbXBhdCBvbmx5XG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2FwcGVuZFF1ZXJ5U3RyaW5nID0gKCkgPT4ge1xuICBjb25zb2xlLndhcm4oJ1Vuc3VwcG9ydGVkJyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl90aW1lb3V0RXJyb3IgPSBmdW5jdGlvbiAocmVhc29uLCB0aW1lb3V0LCBlcnJubykge1xuICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGAke3JlYXNvbiArIHRpbWVvdXR9bXMgZXhjZWVkZWRgKTtcbiAgZXJyb3IudGltZW91dCA9IHRpbWVvdXQ7XG4gIGVycm9yLmNvZGUgPSAnRUNPTk5BQk9SVEVEJztcbiAgZXJyb3IuZXJybm8gPSBlcnJubztcbiAgdGhpcy50aW1lZG91dCA9IHRydWU7XG4gIHRoaXMudGltZWRvdXRFcnJvciA9IGVycm9yO1xuICB0aGlzLmFib3J0KCk7XG4gIHRoaXMuY2FsbGJhY2soZXJyb3IpO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9zZXRUaW1lb3V0cyA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgLy8gZGVhZGxpbmVcbiAgaWYgKHRoaXMuX3RpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNlbGYuX3RpbWVvdXRFcnJvcignVGltZW91dCBvZiAnLCBzZWxmLl90aW1lb3V0LCAnRVRJTUUnKTtcbiAgICB9LCB0aGlzLl90aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHJlc3BvbnNlIHRpbWVvdXRcbiAgaWYgKHRoaXMuX3Jlc3BvbnNlVGltZW91dCAmJiAhdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIpIHtcbiAgICB0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2VsZi5fdGltZW91dEVycm9yKFxuICAgICAgICAnUmVzcG9uc2UgdGltZW91dCBvZiAnLFxuICAgICAgICBzZWxmLl9yZXNwb25zZVRpbWVvdXQsXG4gICAgICAgICdFVElNRURPVVQnXG4gICAgICApO1xuICAgIH0sIHRoaXMuX3Jlc3BvbnNlVGltZW91dCk7XG4gIH1cbn07XG4iXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsUUFBUSxDQUFDOztBQUVoQztBQUNBO0FBQ0E7QUFDQSxpQkFBNkJBLE9BQU8sQ0FBQyxTQUFTLENBQUM7RUFBdkNDLFFBQVEsWUFBUkEsUUFBUTtFQUFFQyxNQUFNLFlBQU5BLE1BQU07O0FBRXhCO0FBQ0E7QUFDQTs7QUFFQUMsTUFBTSxDQUFDQyxPQUFPLEdBQUdDLFdBQVc7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0EsV0FBVyxHQUFHLENBQUM7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsV0FBVyxDQUFDQyxTQUFTLENBQUNDLFlBQVksR0FBRyxZQUFZO0VBQy9DQSxZQUFZLENBQUMsSUFBSSxDQUFDQyxNQUFNLENBQUM7RUFDekJELFlBQVksQ0FBQyxJQUFJLENBQUNFLHFCQUFxQixDQUFDO0VBQ3hDRixZQUFZLENBQUMsSUFBSSxDQUFDRyxtQkFBbUIsQ0FBQztFQUN0QyxPQUFPLElBQUksQ0FBQ0YsTUFBTTtFQUNsQixPQUFPLElBQUksQ0FBQ0MscUJBQXFCO0VBQ2pDLE9BQU8sSUFBSSxDQUFDQyxtQkFBbUI7RUFDL0IsT0FBTyxJQUFJO0FBQ2IsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBTCxXQUFX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

/***/ }),

/***/ 8637:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * Module dependencies.
 */

const utils = __nccwpck_require__(5523);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase() {}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util

  // content-type
  const ct = header['content-type'] || '';
  this.type = utils.type(ct);

  // params
  const parameters = utils.params(ct);
  for (const key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) this[key] = parameters[key];
  }
  this.links = {};

  // links
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {
    // ignore
  }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function (status) {
  const type = Math.trunc(status / 100);

  // status / class
  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type;

  // basics
  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false;

  // sugar
  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1dGlscyIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiUmVzcG9uc2VCYXNlIiwicHJvdG90eXBlIiwiZ2V0IiwiZmllbGQiLCJoZWFkZXIiLCJ0b0xvd2VyQ2FzZSIsIl9zZXRIZWFkZXJQcm9wZXJ0aWVzIiwiY3QiLCJ0eXBlIiwicGFyYW1ldGVycyIsInBhcmFtcyIsImtleSIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImxpbmtzIiwibGluayIsInBhcnNlTGlua3MiLCJlcnIiLCJfc2V0U3RhdHVzUHJvcGVydGllcyIsInN0YXR1cyIsIk1hdGgiLCJ0cnVuYyIsInN0YXR1c0NvZGUiLCJzdGF0dXNUeXBlIiwiaW5mbyIsIm9rIiwicmVkaXJlY3QiLCJjbGllbnRFcnJvciIsInNlcnZlckVycm9yIiwiZXJyb3IiLCJ0b0Vycm9yIiwiY3JlYXRlZCIsImFjY2VwdGVkIiwibm9Db250ZW50IiwiYmFkUmVxdWVzdCIsInVuYXV0aG9yaXplZCIsIm5vdEFjY2VwdGFibGUiLCJmb3JiaWRkZW4iLCJub3RGb3VuZCIsInVucHJvY2Vzc2FibGVFbnRpdHkiXSwic291cmNlcyI6WyIuLi9zcmMvcmVzcG9uc2UtYmFzZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZUJhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VCYXNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlQmFzZWAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZUJhc2UoKSB7fVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlQmFzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLl9zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGhlYWRlcikge1xuICAvLyBUT0RPOiBtb2FyIVxuICAvLyBUT0RPOiBtYWtlIHRoaXMgYSB1dGlsXG5cbiAgLy8gY29udGVudC10eXBlXG4gIGNvbnN0IGN0ID0gaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdXRpbHMudHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB1dGlscy5wYXJhbXMoY3QpO1xuICBmb3IgKGNvbnN0IGtleSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbWV0ZXJzLCBrZXkpKVxuICAgICAgdGhpc1trZXldID0gcGFyYW1ldGVyc1trZXldO1xuICB9XG5cbiAgdGhpcy5saW5rcyA9IHt9O1xuXG4gIC8vIGxpbmtzXG4gIHRyeSB7XG4gICAgaWYgKGhlYWRlci5saW5rKSB7XG4gICAgICB0aGlzLmxpbmtzID0gdXRpbHMucGFyc2VMaW5rcyhoZWFkZXIubGluayk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBpZ25vcmVcbiAgfVxufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLl9zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHN0YXR1cykge1xuICBjb25zdCB0eXBlID0gTWF0aC50cnVuYyhzdGF0dXMgLyAxMDApO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXMgPSB0aGlzLnN0YXR1c0NvZGU7XG4gIHRoaXMuc3RhdHVzVHlwZSA9IHR5cGU7XG5cbiAgLy8gYmFzaWNzXG4gIHRoaXMuaW5mbyA9IHR5cGUgPT09IDE7XG4gIHRoaXMub2sgPSB0eXBlID09PSAyO1xuICB0aGlzLnJlZGlyZWN0ID0gdHlwZSA9PT0gMztcbiAgdGhpcy5jbGllbnRFcnJvciA9IHR5cGUgPT09IDQ7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSB0eXBlID09PSA1O1xuICB0aGlzLmVycm9yID0gdHlwZSA9PT0gNCB8fCB0eXBlID09PSA1ID8gdGhpcy50b0Vycm9yKCkgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmNyZWF0ZWQgPSBzdGF0dXMgPT09IDIwMTtcbiAgdGhpcy5hY2NlcHRlZCA9IHN0YXR1cyA9PT0gMjAyO1xuICB0aGlzLm5vQ29udGVudCA9IHN0YXR1cyA9PT0gMjA0O1xuICB0aGlzLmJhZFJlcXVlc3QgPSBzdGF0dXMgPT09IDQwMDtcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSBzdGF0dXMgPT09IDQwMTtcbiAgdGhpcy5ub3RBY2NlcHRhYmxlID0gc3RhdHVzID09PSA0MDY7XG4gIHRoaXMuZm9yYmlkZGVuID0gc3RhdHVzID09PSA0MDM7XG4gIHRoaXMubm90Rm91bmQgPSBzdGF0dXMgPT09IDQwNDtcbiAgdGhpcy51bnByb2Nlc3NhYmxlRW50aXR5ID0gc3RhdHVzID09PSA0MjI7XG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxTQUFTLENBQUM7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQUMsTUFBTSxDQUFDQyxPQUFPLEdBQUdDLFlBQVk7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0EsWUFBWSxHQUFHLENBQUM7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxZQUFZLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxHQUFHLFVBQVVDLEtBQUssRUFBRTtFQUM1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

/***/ }),

/***/ 5523:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = string_ => string_.split(/ *; */).shift();

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = value => {
  const object = {};
  var _iterator = _createForOfIteratorHelper(value.split(/ *; */)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const string_ = _step.value;
      const parts = string_.split(/ *= */);
      const key = parts.shift();
      const value = parts.shift();
      if (key && value) object[key] = value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return object;
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = value => {
  const object = {};
  var _iterator2 = _createForOfIteratorHelper(value.split(/ *, */)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      const string_ = _step2.value;
      const parts = string_.split(/ *; */);
      const url = parts[0].slice(1, -1);
      const rel = parts[1].split(/ *= */)[1].slice(1, -1);
      object[rel] = url;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return object;
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = (header, changesOrigin) => {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host;
  // secuirty
  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }
  return header;
};

/**
 * Check if `obj` is an object.
 *
 * @param {Object} object
 * @return {Boolean}
 * @api private
 */
exports.isObject = object => {
  return object !== null && typeof object === 'object';
};

/**
 * Object.hasOwn fallback/polyfill.
 *
 * @type {(object: object, property: string) => boolean} object
 * @api private
 */
exports.hasOwn = Object.hasOwn || function (object, property) {
  if (object == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return Object.prototype.hasOwnProperty.call(new Object(object), property);
};
exports.mixin = (target, source) => {
  for (const key in source) {
    if (exports.hasOwn(source, key)) {
      target[key] = source[key];
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJleHBvcnRzIiwidHlwZSIsInN0cmluZ18iLCJzcGxpdCIsInNoaWZ0IiwicGFyYW1zIiwidmFsdWUiLCJvYmplY3QiLCJwYXJ0cyIsImtleSIsInBhcnNlTGlua3MiLCJ1cmwiLCJzbGljZSIsInJlbCIsImNsZWFuSGVhZGVyIiwiaGVhZGVyIiwiY2hhbmdlc09yaWdpbiIsImhvc3QiLCJhdXRob3JpemF0aW9uIiwiY29va2llIiwiaXNPYmplY3QiLCJoYXNPd24iLCJPYmplY3QiLCJwcm9wZXJ0eSIsIlR5cGVFcnJvciIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIm1peGluIiwidGFyZ2V0Iiwic291cmNlIl0sInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnR5cGUgPSAoc3RyaW5nXykgPT4gc3RyaW5nXy5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnBhcmFtcyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBvYmplY3QgPSB7fTtcbiAgZm9yIChjb25zdCBzdHJpbmdfIG9mIHZhbHVlLnNwbGl0KC8gKjsgKi8pKSB7XG4gICAgY29uc3QgcGFydHMgPSBzdHJpbmdfLnNwbGl0KC8gKj0gKi8pO1xuICAgIGNvbnN0IGtleSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWx1ZSkgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59O1xuXG4vKipcbiAqIFBhcnNlIExpbmsgaGVhZGVyIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnBhcnNlTGlua3MgPSAodmFsdWUpID0+IHtcbiAgY29uc3Qgb2JqZWN0ID0ge307XG4gIGZvciAoY29uc3Qgc3RyaW5nXyBvZiB2YWx1ZS5zcGxpdCgvICosICovKSkge1xuICAgIGNvbnN0IHBhcnRzID0gc3RyaW5nXy5zcGxpdCgvICo7ICovKTtcbiAgICBjb25zdCB1cmwgPSBwYXJ0c1swXS5zbGljZSgxLCAtMSk7XG4gICAgY29uc3QgcmVsID0gcGFydHNbMV0uc3BsaXQoLyAqPSAqLylbMV0uc2xpY2UoMSwgLTEpO1xuICAgIG9iamVjdFtyZWxdID0gdXJsO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG5cbi8qKlxuICogU3RyaXAgY29udGVudCByZWxhdGVkIGZpZWxkcyBmcm9tIGBoZWFkZXJgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEByZXR1cm4ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmNsZWFuSGVhZGVyID0gKGhlYWRlciwgY2hhbmdlc09yaWdpbikgPT4ge1xuICBkZWxldGUgaGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgZGVsZXRlIGhlYWRlclsnY29udGVudC1sZW5ndGgnXTtcbiAgZGVsZXRlIGhlYWRlclsndHJhbnNmZXItZW5jb2RpbmcnXTtcbiAgZGVsZXRlIGhlYWRlci5ob3N0O1xuICAvLyBzZWN1aXJ0eVxuICBpZiAoY2hhbmdlc09yaWdpbikge1xuICAgIGRlbGV0ZSBoZWFkZXIuYXV0aG9yaXphdGlvbjtcbiAgICBkZWxldGUgaGVhZGVyLmNvb2tpZTtcbiAgfVxuXG4gIHJldHVybiBoZWFkZXI7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmV4cG9ydHMuaXNPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIHJldHVybiBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG59O1xuXG4vKipcbiAqIE9iamVjdC5oYXNPd24gZmFsbGJhY2svcG9seWZpbGwuXG4gKlxuICogQHR5cGUgeyhvYmplY3Q6IG9iamVjdCwgcHJvcGVydHk6IHN0cmluZykgPT4gYm9vbGVhbn0gb2JqZWN0XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZXhwb3J0cy5oYXNPd24gPVxuICBPYmplY3QuaGFzT3duIHx8XG4gIGZ1bmN0aW9uIChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5ldyBPYmplY3Qob2JqZWN0KSwgcHJvcGVydHkpO1xuICB9O1xuXG5leHBvcnRzLm1peGluID0gKHRhcmdldCwgc291cmNlKSA9PiB7XG4gIGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChleHBvcnRzLmhhc093bihzb3VyY2UsIGtleSkpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxPQUFPLENBQUNDLElBQUksR0FBSUMsT0FBTyxJQUFLQSxPQUFPLENBQUND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

/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 4091:
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 665:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(4091)(Yallist)
} catch (er) {}


/***/ }),

/***/ 132:
/***/ ((module) => {

module.exports = eval("require")("supports-color");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 3639:
/***/ ((module) => {

"use strict";
module.exports = require("domain");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5158:
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 3477:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 3765:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const request = __nccwpck_require__(1524);

(async () => {
  const url = core.getInput('url', { required: true });
  let json = core.getInput('json');

  let obj;
  try {
    obj = JSON.parse(json);
  } catch (err) {
    core.setFailed(`Invalid json:`, err);
    return;
  }

  try {
    const res = await request.post(url).send(obj);
    console.log('Response body:', res.body);
    if (res.status < 200 || res.status > 299) {
      core.setFailed(`Status code was not 2xx. Was: ${res.status}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();

})();

module.exports = __webpack_exports__;
/******/ })()
;