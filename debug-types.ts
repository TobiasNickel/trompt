// Debugging TypeScript IntelliSense
import { prompt, type PromptConfig } from './index.js';

// Test 1: Direct object literal (this is what should trigger IntelliSense)
async function test1() {
  const result = await prompt({
    type: 'input', // <-- IntelliSense should appear when typing this
    question: 'Test'
  });
}

// Test 2: Using explicit type annotation
async function test2() {
  const config: PromptConfig = {
    type: 'select', // <-- IntelliSense should definitely appear here
    question: 'Test',
    choices: ['a', 'b']
  };
  const result = await prompt(config);
}

// Test 3: Testing specific types
async function test3() {
  // This should work and provide proper return types
  const input: string = await prompt({
    type: 'input',
    question: 'Test'
  });

  const number: number = await prompt({
    type: 'number',
    question: 'Test',
    min: 0,
    max: 100
  });

  const selection: any = await prompt({
    type: 'select',
    question: 'Test',
    choices: ['a', 'b', 'c']
  });

  const multiple: any[] = await prompt({
    type: 'checkbox',
    question: 'Test', 
    choices: ['a', 'b', 'c']
  });
}