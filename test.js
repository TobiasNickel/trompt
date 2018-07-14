var {prompt} = require('./index.js');

;(async function() {

    const name = await prompt('name');
    const mail = (await prompt('mail')).toLowerCase();
    const job = await prompt('job');
    const age = parseInt(await prompt('age'));
    const height = await prompt('hight');
    const eyeColor = await prompt('eye color');
    const [ hairColor, hairLength] = await Promise.all([
        prompt('hair color'),
        prompt('hair length'),
    ]);


    var user = {
        name, mail, job, age, height, eyeColor,
        hair: { color: hairColor, length: hairLength }
    };

    console.log(user);
    
    process.exit();
    
})();