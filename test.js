var {prompt} = require('./index.js');

;(async function() {

    var name = await prompt('name');
    var mail = (await prompt('mail')).toLowerCase();
    var job = await prompt('job');
    var age = parseInt(await prompt('age'));
    var height = await prompt('hight');
    var eyeColor = await prompt('eye color');
    var hairColor = await prompt('hair color');
    var hairLength = await prompt('hair length');


    var user = {
        name, mail, age, height, eyeColor,
        hair: { color: hairColor, length: hairLength }
    };

    console.log(user);
    
    process.exit();
    
})();