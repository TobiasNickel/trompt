// Test TypeScript IntelliSense for trompt
import { prompt } from './index.js';

async function testIntelliSense() {
  // This should provide IntelliSense for the 'type' property
  const test1 = await prompt({
    type: 'input', // Should autocomplete: 'input', 'password', 'number', 'integer', 'int', 'select', 'list', 'checkbox'
    question: 'Test'
  });

  // This should provide IntelliSense specific to checkbox type
  const test2 = await prompt({
    type: 'checkbox',
    question: 'Test',
    choices: ['a', 'b', 'c'], // Should be required for checkbox
    default: [] // Should accept array for checkbox
  });

  // This should provide IntelliSense specific to number type
  const test3 = await prompt({
    type: 'number',
    question: 'Test',
    min: 0, // Should be available for number type
    max: 100, // Should be available for number type
    suffix: 'px' // Should be available for number type
  });
}