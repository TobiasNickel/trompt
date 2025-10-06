// Testing trompt IntelliSense as an external consumer
import { prompt } from 'trompt';

async function testAsConsumer() {
  // This should show IntelliSense for type property
  const result = await prompt({
    type: 'input' // <-- This should autocomplete with all available types
  });

  // Test different types
  const passwordResult = await prompt({
    type: 'password',
    question: 'Enter password:'
  });

  const numberResult = await prompt({
    type: 'number',
    question: 'Enter number:',
    min: 0,
    max: 100
  });

  const selectResult = await prompt({
    type: 'select',
    question: 'Choose:',
    choices: ['a', 'b', 'c']
  });

  const checkboxResult = await prompt({
    type: 'checkbox', 
    question: 'Select multiple:',
    choices: ['x', 'y', 'z']
  });
  
}

testAsConsumer();