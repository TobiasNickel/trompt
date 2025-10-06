#!/usr/bin/env tsx

import { prompt, inquirer, type InquirerQuestion } from './index.js';

/**
 * TypeScript example demonstrating type-safe usage of trompt
 */

interface UserProfile {
  name: string;
  email: string;
  age: number;
  favoriteColor: string;
  skills: string[];
  isAdmin: boolean;
}

async function collectUserProfile(): Promise<UserProfile> {
  console.log('🎯 TypeScript Example - Creating User Profile\n');

  // String input with type inference
  const name: string = await prompt('Enter your name:');

  // Input with validation and proper typing
  const email: string = await prompt({
    type: 'input',
    question: 'Enter your email:',
    validate: (value: string): boolean | string => {
      if (!value.includes('@')) {
        return 'Please enter a valid email address';
      }
      return true;
    }
  });

  // Number input with constraints
  const age: number = await prompt({
    type: 'number',
    question: 'Enter your age:',
    min: 13,
    max: 120,
    validate: (value: number): boolean | string => {
      if (value < 13) return 'Must be at least 13 years old';
      if (value > 120) return 'Must be a reasonable age';
      return true;
    }
  });

  // Select with type-safe choices
  const favoriteColor: string = await prompt({
    type: 'select',
    question: 'Choose your favorite color:',
    choices: ['Red', 'Green', 'Blue', 'Purple', 'Orange'],
    default: 2 // Blue
  });

  // Checkbox with typed array return
  const skills: string[] = await prompt({
    type: 'checkbox',
    question: 'Select your programming skills:',
    choices: [
      { text: 'JavaScript', value: 'js' },
      { text: 'TypeScript', value: 'ts', selected: true },
      { text: 'Python', value: 'python' },
      { text: 'React', value: 'react' },
      { text: 'Node.js', value: 'nodejs' },
      { text: 'Docker', value: 'docker' }
    ]
  });

  // Select with boolean return type
  const isAdmin: boolean = await prompt({
    type: 'select',
    question: 'Are you an administrator?',
    choices: [
      { text: 'Yes', value: true },
      { text: 'No', value: false }
    ]
  }) as boolean;

  return {
    name,
    email,
    age,
    favoriteColor,
    skills,
    isAdmin
  };
}

async function inquirerStyleExample(): Promise<void> {
  console.log('\n📝 Inquirer-Style API Example\n');

  // Define questions with proper typing
  const questions: InquirerQuestion[] = [
    {
      name: 'projectName',
      type: 'input',
      question: 'Project name:',
      validate: (value: string) => value.length > 0 ? true : 'Project name is required'
    },
    {
      name: 'framework',
      type: 'select',
      question: 'Choose a framework:',
      choices: ['React', 'Vue', 'Angular', 'Svelte', 'None']
    },
    {
      name: 'features',
      type: 'checkbox',
      question: 'Select features:',
      choices: [
        'TypeScript',
        'ESLint', 
        'Prettier',
        'Testing (Jest)',
        'Storybook',
        'CI/CD'
      ]
    },
    {
      name: 'port',
      type: 'number',
      question: 'Development server port:',
      default: 3000,
      min: 1000,
      max: 65535
    }
  ];

  // Get answers with full type safety
  const answers = await inquirer.prompt(questions);
  
  // TypeScript knows the structure of answers
  console.log('\n📊 Project Configuration:');
  console.log(`Name: ${answers.projectName}`);
  console.log(`Framework: ${answers.framework}`);
  console.log(`Features: ${answers.features.join(', ')}`);
  console.log(`Port: ${answers.port}`);
}

async function advancedTypingExample(): Promise<void> {
  console.log('\n🔧 Advanced Typing Example\n');

  // Union type for environment selection
  type Environment = 'development' | 'staging' | 'production';
  
  const environment: Environment = await prompt({
    type: 'select',
    question: 'Select deployment environment:',
    choices: [
      { text: 'Development', value: 'development' as Environment },
      { text: 'Staging', value: 'staging' as Environment },
      { text: 'Production', value: 'production' as Environment }
    ]
  }) as Environment;

  // Custom validation with proper typing
  const apiKey: string = await prompt({
    type: 'password',
    question: 'Enter API key:',
    validate: (value: string): boolean | string => {
      if (value.length < 32) {
        return 'API key must be at least 32 characters long';
      }
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return 'API key must contain only alphanumeric characters';
      }
      return true;
    }
  });

  console.log(`Environment: ${environment}`);
  console.log(`API Key length: ${apiKey.length} characters`);
}

// Main execution
async function main(): Promise<void> {
  try {
    const profile = await collectUserProfile();
    console.log('\n✅ User Profile Created:');
    console.log(JSON.stringify(profile, null, 2));

    await inquirerStyleExample();
    await advancedTypingExample();

    console.log('\n🎉 TypeScript integration working perfectly!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}