import { prompt } from './index.js';

async function runTest() {
  try {
    // Ask for name
    const name = await prompt('What is your name?');

    // Ask for email and make sure it is lower case
    const mail = (await prompt('What is your email?')).toLowerCase();

    // Ask for password, but do not show it
    const password = await prompt({ 
      type: 'password', 
      question: 'Enter your password:' 
    });

    // Ask for the work
    const job = await prompt('What is your job?');

    // Let the user check some of their skills interesting to us
    const skills = await prompt({
      type: 'checkbox',
      question: 'Select your skills:',
      choices: [
        'JavaScript',
        'HTML/CSS',
        'Python',
        'Java',
        'MongoDB',
        'Hadoop',
        'Docker',
        'Kubernetes',
        'Blockchain',
        'Machine Learning'
      ]
    });

    // Let the user select their eye color
    const eyeColor = await prompt({
      type: 'select',
      question: 'What is your eye color?',
      choices: ['brown', 'black', 'blue', 'yellow', 'green']
    });

    // Let the user enter their height in centimeters
    const height = await prompt({
      type: 'number',
      question: 'What is your height?',
      suffix: 'cm',
      min: 50,
      max: 250
    });

    // Ask for hair color and length
    // Note: Using Promise.all is not recommended for interactive prompts
    // as they should be sequential for better UX
    const hairColor = await prompt('What is your hair color?');
    const hairLength = await prompt({ 
      type: 'number', 
      question: 'What is your hair length?', 
      suffix: 'cm',
      min: 0,
      max: 100
    });

    const user = {
      name,
      mail,
      password,
      job,
      skills,
      height,
      eyeColor,
      hair: { color: hairColor, length: hairLength }
    };

    console.log('\nUser profile:');
    console.log(JSON.stringify(user, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runTest();
