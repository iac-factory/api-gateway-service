import Client from "inquirer";

import { TTY } from "./system";

const standard = (value: any) => {
    if ( valid( value ) ) return true;
    return "[Error] Input Value Required";
};

const string = (value: any) => {
    if ( !valid( value ) ) {
        return "[Error] Input Value Required (String)";
    } else {
        if ( new RegExp( "^(\\w+)$", "g" ).exec( value ) !== null ) {
            return true;
        }
    }

    return "[Error] Incorrect Input Type - Expected (String)";
};

/***
 * - `^`               // start of line
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s`              // will look for white space between name and surname
 * - `[a-zA-Z]{1,}`    // needs at least 1 Character
 * - `\'?-?`           // possibility of **'** or **-** for double barreled and hyphenated surnames
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s?`             // possibility of another whitespace
 * - `([a-zA-Z]{1,})?` // possibility of a second surname
 *
 * @param value
 *
 * @returns {string | boolean}
 *
 */
const name = (value: any) => {
    if ( !valid( value ) ) {
        return "[Error] Input Value Required (Human Identifiable Name)";
    } else {
        if ( new RegExp( "^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{1,})?)", "g" ).exec( value ) !== null ) {
            return true;
        }
    }

    return "[Error] Incorrect Input Type - Expected (String, Human Identifiable Name)";
};

const digit = (value: any) => {
    if ( !valid( value ) ) {
        return "[Warning] Input Value Required (Digit)";
    }

    return ( new RegExp( "^(\\d+)$", "g" ).exec( value ) !== null ) ? true : "[Error] Incorrect Input Type - Expected (Number)";
};

/***
 * Expression Testing for Empty Input
 * ---
 *
 * Note: the following expression will match empty
 * input in global, multiline mode.
 *
 * @example
 * return new RegExp( "((\\r\\n|\\n|\\r)$)|(^(\\r\\n|\\n|\\r))|^\\s*$", "g" ).test(value)
 *
 * @param value
 * @returns {boolean}
 */
const empty = (value: any) => {
    const expression = new RegExp( "((\\r\\n|\\n|\\r)$)|(^(\\r\\n|\\n|\\r))|^\\s*$", "g" );

    return ( expression.test( value ) );
};

/***
 * Validate that Input Isn't Empty
 * ---
 *
 * See the {@link empty `empty` evaluation function} for
 * additional information.
 *
 * @param value
 * @returns {boolean}
 */
const valid = (value: any) => {
    return ( !empty( value ) || typeof value === "number" );
};

/***
 * Prompt Input Shape for `"message"` Property
 * ---
 *
 * @param {string} value
 * @returns {string}
 */
const message = (value: string) => value;

const Validation = {
    standard,
    string,
    digit,
    name
};
const Normalize = (input: string) => {
    input = ( input !== "" ) ? input : "[N/A]";

    const collection = input.split( " " );

    return collection.map( ($) => {
        const string = $;
        const character = String( string[ 0 ] );
        const body = String( string.slice( 1 ) );
        const transformation = character.toUpperCase();

        return transformation + body;
    } ).join( "-" ).split( "_" ).map( ($) => {
        const string = $;
        const character = String( string[ 0 ] );
        const body = String( string.slice( 1 ) );
        const transformation = character.toUpperCase();

        return transformation + body;
    } ).join( "-" ).split( "--" ).map( ($) => {
        const string = $;
        const character = String( string[ 0 ] );
        const body = String( string.slice( 1 ) );
        const transformation = character.toUpperCase();

        return transformation + body;
    } ).join( "-" ).replace( ".", "" );
};

type Client = typeof Client.prompt | typeof Client.prompts | typeof Client.registerPrompt;

/***
 * An `"Asynchronous"` Callable Function
 * ---
 *
 * Compliance for Prompt Module.
 *
 * Primarily only used for type-checking the validation(s) of
 * a given `"Question"` or otherwise prompt-type.
 *
 */
type Asynchronous = (input: string | number | any) => Promise<true | string>;

declare abstract class Abstract {
    protected abstract name: string;
    protected abstract message: string;

    protected abstract prompt?: Client;
    protected abstract module: Client.PromptModule;
    protected abstract answer?: any | undefined;

    protected abstract validate?: Asynchronous;

    protected readonly abstract default: Function;
    protected readonly abstract defaults?: string | null;

    protected constructor();

    protected constructor(name: string, message: string, defaults?: any, validation?: Function | Asynchronous, prefix?: string, suffix?: string);
    protected constructor(input: { name: string; message: string; defaults?: any; validation?: Function | Asynchronous; prefix?: string; suffix?: string });
    protected constructor(assignment: string, prompt: string, defaults?: string | null, validation?: Function | Asynchronous, prefix?: string, suffix?: string);
    protected constructor(input: { assignment: string; prompt: string; defaults?: string | null; validation?: Function | Asynchronous; prefix?: string; suffix?: string });

    protected constructor(name: string, message: string, defaults?: any, validation?: Function | Asynchronous, prefix?: string, suffix?: string, prompt?: typeof Client.prompt);
    protected constructor(input: { name: string; message: string; defaults?: any; validation?: Function | Asynchronous; prefix?: string; suffix?: string }, prompt?: typeof Client.prompt);
    protected constructor(assignment: string, prompt: string, defaults?: string | null, validation?: Function | Asynchronous, prefix?: string, suffix?: string, handler?: typeof Client.prompt);
    protected constructor(input: { assignment: string; prompt: string; defaults?: string | null; validation?: Function | Asynchronous; prefix?: string; suffix?: string }, prompt?: typeof Client.prompt);
    protected constructor(input: { assignment: string; prompt: string; defaults?: string | null; validation?: Function | Asynchronous; prefix?: string; suffix?: string; handler?: typeof Client.prompt });
}

/***
 * The Input Shape for Standard Prompt Type(s)
 */
interface Shape {
    /*** A string representing the return key-name */
    assignment: string;
    /*** The display text that's presented to the end-user */
    prompt: string;
    /*** Default value(s) that's presented to the end-user and that's assigned to the assignment variable */
    default?: string | number | boolean | null | undefined;
    /*** A synchronous or an asynchronous function that returns either true or a string describing the reason for invalidating the input */
    validation?: Asynchronous | undefined;

    prefix?: string | undefined;
    suffix?: string | undefined;
}

/***
 * The Input Shape for Selectable Prompt Type(s)
 */
interface Choices {
    /*** A string representing the return key-name */
    assignment: string;
    /*** The display text that's presented to the end-user */
    prompt: string;
    /*** Default value(s) that's presented to the end-user and that's assigned to the assignment variable */
    default?: string | number | boolean | null | undefined;
    /*** A synchronous or an asynchronous function that returns either true or a string describing the reason for invalidating the input */
    validation?: Asynchronous | undefined;

    choices: string | string[] | number | number[];

    prefix?: string | undefined;
    suffix?: string | undefined;
}

/***
 * The Default Prompt
 * ---
 *
 * Note that the following class is meant to act only as
 * a meta definition for inheritance; it cannot be used
 * as context for a `Question.prompt` or a
 * `import("inquirer").PromptModule(...)`.
 */

class Prompt {
    protected name: string;
    protected message: string;

    protected validate: Asynchronous;
    protected readonly defaults?: string | null;
    protected prefix: string | undefined;
    protected suffix: string | undefined;
    private readonly default: Function;

    constructor(name: string, message: string, defaults?: any, validation?: Asynchronous, prefix?: string, suffix?: string) {
        this.name = name;
        this.message = message;
        this.defaults = defaults;
        this.prefix = prefix;
        this.suffix = suffix;

        this.validate = ( validation ) ? validation : async ($: any) => {
            const result = await new Promise( (resolve) => {
                setTimeout( () => resolve( $ ), 500 );
            } );

            return standard( result );
        };

        this.default = () => this.defaults;
    }

    public async prompt(condition: boolean = true) {
        await TTY.Cursor.show();
        const answers = await new Promise( (resolve) => Client.prompt(
            [
                {
                    ... this,
                    ... { when: condition }
                }
            ] ).then( (answers) => {
                resolve( answers );
            }
        ) );
        await TTY.Cursor.hide( true );

        return answers;
    }
}

/***
 * For validations, either create an asynchronous function, import
 * the `"Validation"` object, or extend the overall functionality.
 *
 * See {@link Input} for additional information around the
 * `Field` initializer's input shape.
 *
 * @example
 * /// Example of Extension
 * import Question, { Input, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Input.initialize( "name", "Name", "Jacob" );
 * /// const Name = Input.construct( { assignment: "name", prompt: "Name", default: "Jacob" } );
 *
 * const Surname = Field.initialize( "surname", "Last-Name", "Sanders" );
 * /// const Surname = Input.construct( { assignment: "name", prompt: "Name", default: "Jacob" } );
 *
 * const Age = Field.initialize( "age", "Age", null, validation);
 * /// const Age = Input.construct( { assignment: "name", prompt: "Name", default: "Jacob" } );
 *
 * const name = await Name.prompt();
 * const surname = await surname.prompt();
 * const age = await age.prompt();
 *
 */

class Input extends Prompt {
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly type: string = "input";

    private readonly type: string = "input";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Asynchronous, prefix?: string, suffix?: string) {
        super( name, message, defaults, validation, prefix, suffix );
    }

    public static construct(input: Shape): Input {
        return new Input( input.assignment, input.prompt, input.default as string, input.validation );
    }

    public static initialize(name: string, message: string, defaults?: string, validation?: Asynchronous): Input {
        return Input.construct( {
            assignment: name,
            prompt: message,
            default: defaults,
            validation: validation
        } );
    }
}

class Selectable extends Prompt {
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly choices: readonly string[];
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly type: string = "list";

    private choices: readonly string[];
    private readonly type: string = "list";

    constructor(input: Shape, choices: readonly string[]) {
        super( input.assignment, input.prompt, input.default as boolean, input.validation );

        this.choices = choices;
    }

    public static construct(input: Shape, choices: readonly string[]) {
        return new Selectable( input, choices );
    }

    public static initialize(input: Shape, choices: readonly string[]) {
        return new Selectable( input, choices );
    }
}

class Password extends Prompt {
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly type: string = "password";

    private readonly type: string = "password";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Asynchronous, prefix?: string, suffix?: string) {
        super( name, message, defaults, validation, prefix, suffix );
    }

    public static construct(input: Shape): Password {
        return new Password( input.assignment, input.prompt, input.default as string, input.validation );
    }

    public static initialize(name: string, message: string, defaults?: string, validation?: Asynchronous): Password {
        return Password.construct( {
            assignment: name,
            prompt: message,
            default: defaults,
            validation: validation
        } );
    }

    /***
     * Note - The default is strictly, always reset to `null`; never should a password
     * be deterministically configured.
     *
     * See {@link Token} for a masked deterministic prompt.
     *
     * It's additionally extended to prevent the cursor from being displayed on a TTY.
     * While subtle, it's an important detail to hide. Long passwords will cause the
     * cursor to shift right per character.
     *
     * @param {boolean} condition
     *
     */
    public override async prompt(condition: boolean = true) {
        await TTY.Cursor.hide( true );
        return new Promise( (resolve) => Client.prompt(
            [
                {
                    ... this,
                    ... { when: condition },
                    ... { mask: "" },
                    ... { default: null },
                    ... {
                        transformer(input: string) {
                            return new Array( "*".repeat( input.length ) );
                        }
                    }
                }
            ] ).then( (answers) => {
                resolve( answers );
            }
        ) );
    }
}

class Token extends Prompt {
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly type: string = "password";

    private readonly type: string = "password";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Asynchronous, prefix?: string, suffix?: string) {
        super( name, message, defaults, validation, prefix, suffix );
    }

    public static construct(input: Shape): Token {
        return new Token( input.assignment, input.prompt, input.default as string, input.validation );
    }

    public static initialize(name: string, message: string, defaults?: string, validation?: Asynchronous): Token {
        return Token.construct( {
            assignment: name,
            prompt: message,
            default: defaults,
            validation: validation
        } );
    }

    public override async prompt(condition: boolean = true) {
        await TTY.Cursor.show();
        const answers = await new Promise( (resolve) => Client.prompt(
            [
                {
                    ... this,
                    ... { when: condition },
                    ... { mask: "*" },
                    ... {
                        transformer(input: string) {
                            return new Array( "*".repeat( input.length ) );
                        }
                    }
                }
            ] ).then( (answers) => {
                resolve( answers );
            }
        ) );

        await TTY.Cursor.hide( true );

        return answers;
    }
}

class Confirmation extends Prompt {
    /*** Exposed for Optional Extension(s) + Client Usage */
    public static readonly type: string = "confirm";

    private readonly type: string = "confirm";

    public value: { [ string: string ]: string | null };

    private constructor(name: string, message: string, defaults?: boolean, validation?: Asynchronous, prefix?: string, suffix?: string) {
        super( name, message, defaults, validation, prefix, suffix );

        this.value = { [name]: null };
    }

    public static construct(input: Shape): Confirmation {
        return new Confirmation( input.assignment, input.prompt, input.default as boolean, input.validation, input.prefix, input.suffix );
    }

    public static initialize(name: string, message: string, defaults?: boolean, validation?: Asynchronous, prefix?: string, suffix?: string): Confirmation {
        return Confirmation.construct( {
            assignment: name,
            prompt: message,
            default: defaults,
            validation: validation,
            prefix: prefix,
            suffix: suffix
        } );
    }
}

export {
    Input,
    Password,
    Token,
    Selectable,
    Confirmation,
    Prompt,
    Validation,
    Client,
    Normalize
};

export default Client;

export type { Abstract, Shape, Choices, Asynchronous };