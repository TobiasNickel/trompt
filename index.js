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

function getDefer(){
    var resolve;
    var reject;
    const promise = new Promise((_resolve,_reject)=>{
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}

// function streamline(fn){
//     var previouse = Promise.resolve();
//     return function(){
//         var args = arguments;
//         previouse = previouse.then(()=> fn.apply(this, args));
//         return previouse;
//     }
// }

rl.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (_,key)=>emitter.trigger('keypress',key));

var emitter = {};
tmitter(emitter);

var previousePrompts = Promise.resolve();

/**
 * 
 * @param {String} question 
 * @return {Promise<String>}
 */
function prompt(question) {
    const config = normalize(question);
    if(Array.isArray(config)){
        return Promise.all(config.map(prompt));
    }
    var promise = previousePrompts.then(() => {
        process.stdin.setRawMode(true);
        return promptTypes[config.type](config);
    }).then(result=>{
        process.stdin.setRawMode(false);
        emitter.off('keypress');
        return result;
    });
    previousePrompts = promise;
    return promise;
}


module.exports = prompt;
module.exports.prompt = prompt;

function normalize(question){
    if(!question) return {type:'input',question:":"};
    if(Array.isArray(question))return question.map(normalize);
    if(typeof(question)==='string') return {type:'input', question};
    if(typeof(question)==='number') return {type:'input', question: question.toString()};
    if(!question.type) throw new Error('missing type for question');
    return question;
}

const promptTypes = {
    input(config) {
        const promise = getDefer();
        const question = config.question||':';
        write(chalk.bold(question) + ' ');

        var word = '';
        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else {
                if (key.name === 'return' || key.name === 'tab') {
                    write(ansi.cursorMove(-word.length, 0) + chalk.cyan(word) + '\n');
                    promise.resolve(word)
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
            }
        });
        return promise;
    }
}