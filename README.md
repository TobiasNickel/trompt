CLI questions ala inquirer, allowing follow up questions.

![trompt](https://unpkg.com/trompt@0.0.10/trompt_v2.gif)

# API
```js
const { prompt } = require('trompt');
prompt('question').then(answer=>console.log(answer));
```
# Roadmap
    - simple prompt (done)
    - stramline prompts, ensure only one at a time (done)
    - architecture to support more prompt types (done)
    - password (done)
    - number, integer (done)
    - list/select (done)
    - rawList
    - checkbox
    - validation (done)
    - slider
    - scolling list/checkbox


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
    
    // ask for hair color and length and garantie that both questions 
    // are asked directly after eachother
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