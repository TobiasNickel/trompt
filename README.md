Trompt
========
[![NPM version][npm-image]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![PR Welcome][pr-image]][pr-url]

CLI questions ala inquirer, allowing follow up questions.

![trompt](https://unpkg.com/trompt@0.0.10/trompt_v2.gif)

# API
```js
const { prompt } = require('trompt');
prompt('question').then(answer=>console.log(answer));
```
# Roadmap
    - simple prompt (done)
    - streamline prompts, ensure only one at a time (done)
    - architecture to support more prompt types (done)
    - password (done)
    - number, integer (done)
    - list/select (done)
    - rawList
    - checkbox
    - validation (done)
    - slider
    - scrolling list/checkbox
    - export inquirer compatible object (done)

# Example
This code was used also for the video above.
```js
var {prompt} = require('trompt');

;(async function() {
    // ask for name
    const name = await prompt('name');

    // ask for mail and make sure it is lower case
    const mail = (await prompt('mail')).toLowerCase();

    // ask for password, but do not show it
    const password = await prompt({type:'password', question:'password'});

    // ask for the work
    const job = await prompt('job');

    // let the user check some of his skills interesting to us
    const skills = await prompt({
        type:'checkbox',
        message:'skills',
        choices:[
            'javascript',
            'html/css',
            'python',
            'java',
            'mongodb',
            'hadoop',
            'docker',
            'kubernetics',
            'blockchain',
            'machine learning'
        ]
    })

    // let the user select his eye color
    const eyeColor = await prompt({
        type:'select',
        question:'eye color',
        choices:['brown','black','blue','yellow','green']
    });

    // let the user enter his height in centimeter
    const height = await prompt({type:'number',question:'hight',suffix:'cm'});

    // ask for hair color and length and guarantee that both questions
    // are asked directly after each other
    const [ hairColor, hairLength] = await Promise.all([
        prompt('hair color'),
        prompt({type:'number',question:'hair length',suffix:'cm'}),
    ]);


    var user = {
        name, mail, password, job, skills, height, eyeColor,
        hair: { color: hairColor, length: hairLength }
    };

    console.log(user);

    process.exit();
})();
```

[npm-image]: https://badge.fury.io/js/trompt.svg
[npm-url]: https://npmjs.org/package/trompt
[daviddm-image]: https://david-dm.org/TobiasNickel/trompt.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/TobiasNickel/trompt
[license-image]: https://img.shields.io/github/license/TobiasNickel/trompt.svg
[license-url]: https://github.com/TobiasNickel/trompt/blob/master/LICENSE
[pr-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pr-url]: https://github.com/TobiasNickel/trompt