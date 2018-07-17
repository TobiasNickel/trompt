const ansi = require('ansi-escapes');
const chalk = require('chalk').default;
const tmitter = require('tmitter');
var rl = require('readline');
var Stream = require('stream');

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
        if(typeof(promptTypes[config.type])!=='function'){
            throw new Error(`${config.type} is not a valid type`);
        }
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

    //aliases;
    if(question.type==='list') question.type=='select';
    if(question.message) question.question = question.message;
    question.type = question.type.toLowerCase().trim();
    return question;
}

const promptTypes = {
    input(config) {
        const validate = config.validate || ((v) => typeof(v)==='string');
        const promise = getDefer();
        const question = config.question||':';
        var word = config.default || '';

        if(!validate(word)){
            throw new Error('default value '+(word)+' is invalid');
        }

        write(chalk.bold(question) + ' ');

        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                return process.exit();
            }

            if (key.name === 'return' || key.name === 'tab') {
                var value = word;
                if(!validate(value)) return;
                write(ansi.cursorMove(-word.length, 0) + chalk.cyan(word) + '\n');
                return promise.resolve(word)
            }

            if (key.name === 'backspace') {
                if (word.length) {
                    word = word.substr(0, word.length - 1);
                    write(ansi.cursorMove(-1, 0) + ' ' + ansi.cursorMove(-1, 0));
                }
                return;
            }

            if(['up','down','left','right'].includes(key.name)){
                return;
            }

            word += key.sequence
            write(key.sequence)
        });
        return promise;
    },
    password(config) {
        const validate = config.validate || ((v) => typeof(v)==='string');
        const promise = getDefer();
        const question = config.question||':';
        var word = config.default || '';

        if(!validate(word)){
            throw new Error('default value '+(word)+' is invalid');
        }

        write(chalk.bold(question) + ' ');

        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                return process.exit();
            }

            if (key.name === 'return' || key.name === 'tab') {
                var value = word;
                if(!validate(value)) return;
                write(ansi.cursorMove(-word.length, 0)+ ansi.eraseEndLine + chalk.cyan('********') + '\n');
                return promise.resolve(word)
            }

            if (key.name === 'backspace') {
                if (word.length) {
                    word = word.substr(0, word.length - 1);
                    write(ansi.cursorMove(-1, 0) + ' ' + ansi.cursorMove(-1, 0));
                }
                return;
            }

            if(['up','down','left','right'].includes(key.name)){
                return;
            }

            word += key.sequence
            write('*')
        });
        return promise;
    },
    integer(config){
        config.integer = true;
        return promptTypes.number(config);
    },
    int(config){
        return promptTypes.integer(config);
    },
    number(config) {
        const integer = !!config.integer;
        const validate = config.validate || (() => true);
        const promise = getDefer();
        const question = config.question||':';
        const suffix = ' '+(config.suffix||'');
        var word = config.default || '';
        if(!validate(parseFloat(word||0))){
            throw new Error('default value '+parseFloat(config.default)+' is invalid');
        }

        function print(){
            write(ansi.eraseLine
                + ansi.cursorLeft
                + chalk.bold(question)
                + ' '
                + word
                + chalk.gray(suffix)
                + ansi.cursorMove(-1,0).repeat(suffix.length)
            );
        }
        print();
        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                return process.exit();
            }

            if (key.name === 'return' || key.name === 'tab') {
                var value = parseFloat(word)
                if(!validate(value))return;
                if(Number.isNaN(value))return;
                if(typeof(config.max)==='number' && value>config.max)return;
                if(typeof(config.min)==='number' && value<config.min)return;
                write(ansi.cursorMove(-word.length, 0) + chalk.cyan(word+suffix) + '\n');
                return promise.resolve(parseFloat(word))
            }

            if (key.name === 'backspace') {
                if (word.length) {
                    word = word.substr(0, word.length - 1);
                    print();
                }
                return;
            }

            if(['up','down','left','right'].includes(key.name)){
                return;
            }

            if('0123456789'.includes(key.sequence)){
                word += key.sequence
                print();
            }

            if(key.sequence=='.' && !word.includes('.')){
                word += '.';
                print();
            }
        });
        return promise;
    },
    select(config) {
        const promise = getDefer();
        const question = config.question||':';
        const choices = normalizeSelectChoices(config.choices)
        var index = 0;
        function print(){
            var print = '';
            print+=(ansi.eraseLine+chalk.bold(question) +' '+ choices[index].text +'\n');
            choices.forEach((choice,i)=>{
                print+=(ansi.eraseLine)
                if(i==index){
                    print+=(chalk.cyan('> '+choice.text+'\n'));
                }else{
                    print+=('  '+choice.text+'\n');
                }
            });
            write(print);
        }

        print();

        var word = '';
        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                return process.exit();
            }

            if (key.name === 'return' || key.name === 'tab') {
                write(ansi.cursorUp(choices.length+1)
                    + ansi.eraseLine
                    + chalk.bold(question) +' '+ chalk.cyan(choices[index].text)
                    +'\n'
                    + (ansi.eraseLine+'\n').repeat(choices.length)
                    +ansi.cursorUp(choices.length)
                );
                return promise.resolve(choices[index].value)
            }

            if(key.name==='up'){
                if(index)index--;
            }
            if(key.name==='down'){
                if(index<=(choices.length-1)) index++;
            }

            if(['left','right'].includes(key.name)){
                return;
            }

            write(ansi.cursorUp(choices.length+1));
            print();
        });
        return promise;
    },
    checkbox(config) {
        const promise = getDefer();
        const question = config.question||':';
        const choices = normalizeSelectChoices(config.choices)
        const unselectedBox = '[ ]';
        const selectedBox = '[x]';
        var index = 0;
        var writtenLines = 0;
        function print(){
            var print = ansi.eraseLines(writtenLines);
            print += (ansi.eraseLine+chalk.bold(question) +' '+ selections() +'\n');
            choices.forEach((choice,i)=>{
                print+=(ansi.eraseLine)
                if(i==index){
                    if(choice.selected){
                        print+=(chalk.cyan('> '+ selectedBox+' '+choice.text+'\n'));
                    }else {
                        print+=(chalk.cyan('> '+ unselectedBox+' '+choice.text+'\n'));
                    }
                }else{
                    if(choice.selected){
                        print+=('  '+selectedBox+' '+choice.text+'\n');
                    }else {
                        print+=('  '+unselectedBox+' '+choice.text+'\n');
                    }
                }
            });
            write(print);
            writtenLines = print.split('\n').length+Math.floor((question+' '+selections()).length/process.stdout.columns);
        }

        function selections(){
            return choices.filter(c=>c.selected).map(c=>c.text).join(', ');
        }

        print();

        emitter.on('keypress', key => {
            if (key.ctrl && key.name === 'c') {
                return process.exit();
            }

            if (key.name === 'return' || key.name === 'tab') {
                var selectionValues = choices.filter(c=>c.selected).map(c=>c.value);
                write(ansi.eraseLines(writtenLines)
                    + ansi.eraseLine
                    + chalk.bold(question) +' '+ chalk.cyan(selections())
                    +'\n'
                    + (ansi.eraseLine+'\n').repeat(choices.length)
                    +ansi.cursorUp(choices.length)
                );
                return promise.resolve(selectionValues)
            }

            if(key.name==='up'){
                if(index)index--;
            }
            if(key.name==='down'){
                if(index<(choices.length-1)) index++;
            }
            if(key.name==='space'){
                choices[index].selected = choices[index].selected?false:true;
            }

            if(['left','right'].includes(key.name)){
                return;
            }


            //write(ansi.cursorUp(choices.length+Math.ceil((question+' '+selections()).length/process.stdout.columns)));
            print()
        });
        return promise;
    }
}
/**
 *
 * @param {{}[]} choices
 */
function normalizeSelectChoices(choices){
    return choices.map((choice)=>{
        if(!choice) throw new Error(JSON.stringify(choice)+' is not a choice');
        if(typeof(choice)==='string') return {value:choice, text:choice};
        if(typeof(choice=='number')) return {value:choice, text:choice.toString()};
        if(!choice.hasOwnProperty('text')) throw new Error('text property missing');
        if(!choice.hasOwnProperty(value)) return {value: choice.text, text: choice.text};
        return {...choice};
    })
}
