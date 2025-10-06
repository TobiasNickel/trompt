#!/usr/bin/env tsx

/**
 * Simple TypeScript demo for trompt library
 * This demonstrates basic type safety and IntelliSense features
 */

import { prompt } from './index.js';

async function simpleDemo() {
  console.log('🎯 Simple TypeScript Demo\n');

  // Basic string input - TypeScript infers return type as Promise<string>
  const name = await prompt('What is your name?');
  console.log(`Hello, ${name}!`);

  // Number input with type safety
  const age: number = await prompt({
    type: 'number',
    question: 'How old are you?',
    min: 0,
    max: 150
  });

  // Select with typed choices
  const language: string = await prompt({
    type: 'select',
    question: 'Favorite programming language?',
    choices: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go']
  });

  // Checkbox returns string array
  const hobbies: string[] = await prompt({
    type: 'checkbox',
    question: 'Select your hobbies:',
    choices: ['Reading', 'Gaming', 'Cooking', 'Sports', 'Music']
  });

  console.log('\n📊 Summary:');
  console.log(`Name: ${name}`);
  console.log(`Age: ${age}`);
  console.log(`Language: ${language}`);
  console.log(`Hobbies: ${hobbies.join(', ')}`);
}

simpleDemo().catch(console.error);