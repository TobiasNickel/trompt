#!/usr/bin/env node

import { prompt, inquirer } from './index.js';

async function basicDemo() {
  console.log('🚀 Testing modernized trompt library\n');

  try {
    // Test basic input
    const name = await prompt('Enter your name:');
    console.log(`Hello, ${name}!\n`);

    // Test number input
    const age = await prompt({
      type: 'number',
      question: 'Enter your age:',
      min: 0,
      max: 150,
      validate: (value) => value > 0 && value < 150
    });
    console.log(`You are ${age} years old.\n`);

    // Test select
    const color = await prompt({
      type: 'select',
      question: 'Choose your favorite color:',
      choices: ['Red', 'Green', 'Blue', 'Yellow', 'Purple']
    });
    console.log(`Your favorite color is ${color}.\n`);

    // Test checkbox
    const hobbies = await prompt({
      type: 'checkbox',
      question: 'Select your hobbies:',
      choices: [
        'Reading',
        'Gaming', 
        'Cooking',
        'Sports',
        'Music',
        'Programming'
      ]
    });
    console.log(`Your hobbies: ${hobbies.join(', ')}\n`);

    console.log('✅ All tests passed! The modernized trompt library is working correctly.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function inquirerDemo() {
  console.log('\n🔧 Testing inquirer-style API\n');
  
  try {
    const answers = await inquirer.prompt([
      {
        name: 'username',
        question: 'Username:',
        type: 'input'
      },
      {
        name: 'framework',
        question: 'Preferred framework:',
        type: 'select',
        choices: ['React', 'Vue', 'Angular', 'Svelte']
      }
    ]);
    
    console.log('Inquirer results:', answers);
    console.log('✅ Inquirer-style API working correctly.');
    
  } catch (error) {
    console.error('❌ Inquirer Error:', error.message);
  }
}

// Choose which demo to run
const demoType = process.argv[2];

if (demoType === 'inquirer') {
  inquirerDemo();
} else {
  basicDemo();
}