var {prompt} = require('./index.js');

;(async function() {

    const name = await prompt('name');
    const mail = (await prompt('mail')).toLowerCase();
    const job = await prompt('job');

    const age = await prompt({type:'integer', question:'age'});
    const eyeColor = await prompt({
        type:'select',
        question:'eye color',
        choices:['blue','brown','black','yellow','green']
    });
    const height = await prompt({type:'number',question:'hight',suffix:'cm'});
    const [ hairColor, hairLength] = await Promise.all([
        prompt('hair color'),
        prompt({type:'number',question:'hair length',suffix:'cm'}),
    ]);


    var user = {
        name, mail, job, age, height, eyeColor,
        hair: { color: hairColor, length: hairLength }
    };

    console.log(user);
    
    process.exit();
    
})();