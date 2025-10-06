import ansi from 'ansi-escapes';
import chalk from 'chalk';
import tmitter from 'tmitter';
import readline from 'readline';

const write = (s) => process.stdout.write(s);

/**
 * Creates a deferred promise with external resolve/reject
 * @returns {Promise & {resolve: Function, reject: Function}}
 */
function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}

readline.emitKeypressEvents(process.stdin);

const emitter = {};
tmitter(emitter);

process.stdin.on('keypress', (_, key) => emitter.trigger('keypress', key));

let previousPrompts = Promise.resolve();

/**
 * Main prompt function that handles different types of CLI prompts
 * @param {string|Object|Array} question - The question configuration
 * @returns {Promise<any>} Promise resolving to the user's answer
 */
function prompt(question) {
  const config = normalize(question);
  if (Array.isArray(config)) {
    return Promise.all(config.map(prompt));
  }
  
  const promise = previousPrompts
    .then(() => {
      if (typeof promptTypes[config.type] !== 'function') {
        throw new Error(`${config.type} is not a valid prompt type`);
      }
      process.stdin.setRawMode(true);
      return promptTypes[config.type](config);
    })
    .then((result) => {
      process.stdin.setRawMode(false);
      emitter.off('keypress');
      return result;
    })
    .catch((error) => {
      process.stdin.setRawMode(false);
      emitter.off('keypress');
      throw error;
    });
    
  previousPrompts = promise.catch(() => {}); // Don't let errors break the chain
  return promise;
}

/**
 * Inquirer-style API for handling multiple questions
 */
export const inquirer = {
  /**
   * Prompt multiple questions and return an object with named answers
   * @param {Array<Object>} questions - Array of question objects with 'name' property
   * @returns {Promise<Object>} Object mapping question names to answers
   */
  async prompt(questions) {
    for (const question of questions) {
      if (typeof question.name !== 'string') {
        throw new Error('Each question needs a name property');
      }
    }
    
    const answers = await Promise.all(questions.map(prompt));
    const result = {};
    
    questions.forEach((question, index) => {
      result[question.name] = answers[index];
    });
    
    return result;
  }
};

export { prompt };
export default prompt;

/**
 * Normalizes question input to a standard format
 * @param {string|number|Object|Array} question - The question to normalize
 * @returns {Object|Array} Normalized question configuration
 */
function normalize(question) {
  if (!question) return { type: 'input', question: ':' };
  if (Array.isArray(question)) return question.map(normalize);
  if (typeof question === 'string') return { type: 'input', question };
  if (typeof question === 'number') {
    return { type: 'input', question: question.toString() };
  }
  
  if (!question.type) {
    throw new Error('Question must have a type property');
  }

  // Create a copy to avoid mutating the original
  const config = { ...question };
  
  // Handle aliases
  if (config.type === 'list') config.type = 'select';
  if (config.message && !config.question) config.question = config.message;
  
  config.type = config.type.toLowerCase().trim();
  return config;
}

const promptTypes = {
  /**
   * Text input prompt
   * @param {Object} config - Configuration object
   * @returns {Promise<string>} User input
   */
  input(config) {
    const validate = config.validate || ((v) => typeof v === 'string');
    const promise = createDeferred();
    const question = config.question || ':';
    let word = config.default || '';

    if (!validate(word)) {
      throw new Error(`Default value "${word}" is invalid`);
    }

    write(`${chalk.bold(question)} `);

    const handleKeypress = (key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
      }

      if (key.name === 'return' || key.name === 'tab') {
        if (!validate(word)) return;
        write(`${ansi.cursorMove(-word.length, 0)}${chalk.cyan(word)}\n`);
        emitter.off('keypress', handleKeypress);
        return promise.resolve(word);
      }

      if (key.name === 'backspace') {
        if (word.length > 0) {
          word = word.substring(0, word.length - 1);
          write(`${ansi.cursorMove(-1, 0)} ${ansi.cursorMove(-1, 0)}`);
        }
        return;
      }

      if (['up', 'down', 'left', 'right'].includes(key.name)) {
        return;
      }

      if (key.sequence) {
        word += key.sequence;
        write(key.sequence);
      }
    };

    emitter.on('keypress', handleKeypress);
    return promise;
  },
  /**
   * Password input prompt (hidden input)
   * @param {Object} config - Configuration object
   * @returns {Promise<string>} User input
   */
  password(config) {
    const validate = config.validate || ((v) => typeof v === 'string');
    const promise = createDeferred();
    const question = config.question || ':';
    let word = config.default || '';

    if (!validate(word)) {
      throw new Error(`Default value "${word}" is invalid`);
    }

    write(`${chalk.bold(question)} `);

    const handleKeypress = (key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
      }

      if (key.name === 'return' || key.name === 'tab') {
        if (!validate(word)) return;
        write(
          `${ansi.cursorMove(-word.length, 0)}${ansi.eraseEndLine}${chalk.cyan('********')}\n`
        );
        emitter.off('keypress', handleKeypress);
        return promise.resolve(word);
      }

      if (key.name === 'backspace') {
        if (word.length > 0) {
          word = word.substring(0, word.length - 1);
          write(`${ansi.cursorMove(-1, 0)} ${ansi.cursorMove(-1, 0)}`);
        }
        return;
      }

      if (['up', 'down', 'left', 'right'].includes(key.name)) {
        return;
      }

      if (key.sequence) {
        word += key.sequence;
        write('*');
      }
    };

    emitter.on('keypress', handleKeypress);
    return promise;
  },
  /**
   * Integer input prompt
   * @param {Object} config - Configuration object
   * @returns {Promise<number>} User input as integer
   */
  integer(config) {
    return promptTypes.number({ ...config, integer: true });
  },

  /**
   * Alias for integer input
   * @param {Object} config - Configuration object
   * @returns {Promise<number>} User input as integer
   */
  int(config) {
    return promptTypes.integer(config);
  },

  /**
   * Number input prompt
   * @param {Object} config - Configuration object
   * @returns {Promise<number>} User input as number
   */
  number(config) {
    const isInteger = !!config.integer;
    const validate = config.validate || (() => true);
    const promise = createDeferred();
    const question = config.question || ':';
    const suffix = ` ${config.suffix || ''}`;
    let word = config.default?.toString() || '';

    const defaultValue = parseFloat(word || '0');
    if (!validate(defaultValue)) {
      throw new Error(`Default value ${defaultValue} is invalid`);
    }

    const print = () => {
      write(
        `${ansi.eraseLine}${ansi.cursorLeft}${chalk.bold(question)} ${word}${chalk.gray(suffix)}${ansi.cursorMove(-1, 0).repeat(suffix.length)}`
      );
    };

    print();

    const handleKeypress = (key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
      }

      if (key.name === 'return' || key.name === 'tab') {
        const value = isInteger ? parseInt(word, 10) : parseFloat(word);
        
        if (!validate(value) || Number.isNaN(value)) return;
        if (typeof config.max === 'number' && value > config.max) return;
        if (typeof config.min === 'number' && value < config.min) return;
        
        write(`${ansi.cursorMove(-word.length, 0)}${chalk.cyan(word + suffix)}\n`);
        emitter.off('keypress', handleKeypress);
        return promise.resolve(value);
      }

      if (key.name === 'backspace') {
        if (word.length > 0) {
          word = word.substring(0, word.length - 1);
          print();
        }
        return;
      }

      if (['up', 'down', 'left', 'right'].includes(key.name)) {
        return;
      }

      if (/[0-9]/.test(key.sequence)) {
        word += key.sequence;
        print();
      }

      if (key.sequence === '.' && !isInteger && !word.includes('.')) {
        word += '.';
        print();
      }

      if (key.sequence === '-' && word.length === 0) {
        word += '-';
        print();
      }
    };

    emitter.on('keypress', handleKeypress);
    return promise;
  },
  /**
   * Select/list prompt for choosing one option
   * @param {Object} config - Configuration object with choices array
   * @returns {Promise<any>} Selected choice value
   */
  select(config) {
    const promise = createDeferred();
    const question = config.question || ':';
    const choices = normalizeSelectChoices(config.choices);
    let index = config.default || 0;

    // Ensure index is within bounds
    if (index < 0 || index >= choices.length) {
      index = 0;
    }

    const print = () => {
      let output = '';
      output += `${ansi.eraseLine}${chalk.bold(question)} ${choices[index].text}\n`;
      
      choices.forEach((choice, i) => {
        output += ansi.eraseLine;
        if (i === index) {
          output += `${chalk.cyan(`> ${choice.text}`)}\n`;
        } else {
          output += `  ${choice.text}\n`;
        }
      });
      write(output);
    };

    print();

    const handleKeypress = (key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
      }

      if (key.name === 'return' || key.name === 'tab') {
        write(
          `${ansi.cursorUp(choices.length + 1)}${ansi.eraseLine}${chalk.bold(question)} ${chalk.cyan(choices[index].text)}\n${(ansi.eraseLine + '\n').repeat(choices.length)}${ansi.cursorUp(choices.length)}`
        );
        emitter.off('keypress', handleKeypress);
        return promise.resolve(choices[index].value);
      }

      if (key.name === 'up') {
        if (index > 0) index--;
      }
      
      if (key.name === 'down') {
        if (index < choices.length - 1) index++;
      }

      if (['left', 'right'].includes(key.name)) {
        return;
      }

      write(ansi.cursorUp(choices.length + 1));
      print();
    };

    emitter.on('keypress', handleKeypress);
    return promise;
  },
  /**
   * Checkbox prompt for selecting multiple options
   * @param {Object} config - Configuration object with choices array
   * @returns {Promise<Array>} Array of selected choice values
   */
  checkbox(config) {
    const promise = createDeferred();
    const question = config.question || ':';
    const choices = normalizeSelectChoices(config.choices);
    const unselectedBox = '[ ]';
    const selectedBox = '[x]';
    let index = 0;
    let writtenLines = 0;

    // Initialize selected state from defaults
    if (config.default && Array.isArray(config.default)) {
      choices.forEach((choice) => {
        choice.selected = config.default.includes(choice.value);
      });
    }

    const getSelections = () => {
      return choices
        .filter((c) => c.selected)
        .map((c) => c.text)
        .join(', ');
    };

    const print = () => {
      let output = ansi.eraseLines(writtenLines);
      output += `${ansi.eraseLine}${chalk.bold(question)} ${getSelections()}\n`;
      
      choices.forEach((choice, i) => {
        output += ansi.eraseLine;
        const box = choice.selected ? selectedBox : unselectedBox;
        
        if (i === index) {
          output += `${chalk.cyan(`> ${box} ${choice.text}`)}\n`;
        } else {
          output += `  ${box} ${choice.text}\n`;
        }
      });
      
      write(output);
      writtenLines = output.split('\n').length + 
        Math.floor((question + ' ' + getSelections()).length / process.stdout.columns);
    };

    print();

    const handleKeypress = (key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
      }

      if (key.name === 'return' || key.name === 'tab') {
        const selectionValues = choices
          .filter((c) => c.selected)
          .map((c) => c.value);
          
        write(
          `${ansi.eraseLines(writtenLines)}${ansi.eraseLine}${chalk.bold(question)} ${chalk.cyan(getSelections())}\n${(ansi.eraseLine + '\n').repeat(choices.length)}${ansi.cursorUp(choices.length)}`
        );
        emitter.off('keypress', handleKeypress);
        return promise.resolve(selectionValues);
      }

      if (key.name === 'up') {
        if (index > 0) index--;
      }
      
      if (key.name === 'down') {
        if (index < choices.length - 1) index++;
      }
      
      if (key.name === 'space') {
        choices[index].selected = !choices[index].selected;
      }

      if (['left', 'right'].includes(key.name)) {
        return;
      }

      print();
    };

    emitter.on('keypress', handleKeypress);
    return promise;
  }
};


/**
 * Normalizes choice options for select and checkbox prompts
 * @param {Array<string|number|Object>} choices - Array of choices to normalize
 * @returns {Array<Object>} Array of normalized choice objects
 */
function normalizeSelectChoices(choices) {
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error('Choices must be a non-empty array');
  }

  return choices.map((choice) => {
    if (choice === null || choice === undefined) {
      throw new Error(`Invalid choice: ${JSON.stringify(choice)}`);
    }
    
    if (typeof choice === 'string') {
      return { value: choice, text: choice, selected: false };
    }
    
    if (typeof choice === 'number') {
      return { value: choice, text: choice.toString(), selected: false };
    }
    
    if (typeof choice === 'object') {
      if (!choice.hasOwnProperty('text')) {
        throw new Error('Choice object must have a "text" property');
      }
      
      return {
        value: choice.hasOwnProperty('value') ? choice.value : choice.text,
        text: choice.text,
        selected: !!choice.selected
      };
    }
    
    throw new Error(`Unsupported choice type: ${typeof choice}`);
  });
}