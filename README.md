inquirer with follow up questions.

![trompt](https://unpkg.com/trompt@0.0.4/trompt_v1.gif)

# API
```js
const { prompt } = require('trompt');
prompt('question').then(answer=>console.log(answer));
```
# Roadmap
    - simple prompt (done)
    - stramline prompts, ensure only one at a time (done)
    - architecture to support more prompt types (done)
    - password
    - number, integer (done)
    - list/select (done)
    - rawList
    - checkbox
    - validation (done)
    - slider
    - scolling list/checkbox
