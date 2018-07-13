const ansi = require('ansi-escapes');
const chalk = require('chalk');
const tmitter = require('tmitter');
var rl = require('readline');
var Stream = require('stream')

function times(n, i) {
    if (typeof (n) === 'number') return n * i;
    return new Array(i).join(n);
}
const write = s => process.stdout.write(s);


rl.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (_,key)=>emitter.trigger('keypress',key));

var emitter = {};
tmitter(emitter);


/**
 * 
 * @param {String} question 
 * @return {Promise<String>}
 */
function prompt(question) {
    var resolve;
    var reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    write(chalk.bold(question) + ' ');

    var word = '';
    const eventHandler = key => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if (key.name === 'return' || key.name === 'tab') {

                write(ansi.cursorMove(-word.length, 0) + chalk.cyan(word) + '\n');
                emitter.off('keypress', eventHandler)
                process.stdin.setRawMode(false);
                resolve(word)
            } else if (key.name === 'backspace') {
                if (word.length) {
                    word = word.substr(0, word.length - 1);
                    write(ansi.cursorMove(-1, 0) + ' ' + ansi.cursorMove(-1, 0));
                }
            }else if(['up','down','left','right'].includes(key.name)){

            } else {
                word += key.sequence
                write(key.sequence)
            };
            //console.log(key)
        }
    }
    emitter.on('keypress', eventHandler);

    return promise;
}


module.exports = prompt;
module.exports.prompt = prompt;