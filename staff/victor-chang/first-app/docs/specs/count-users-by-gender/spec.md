# Count users by gender

## What

Count the saved users by the gender of their name. The local AI `llama3.2` decides the gender, at no cost. The result is only shown.

## Who

Whoever wants to know how many women, men and undefined there are among the users.

## Input

Nothing. Every saved user is counted.

## Output

One result with three numbers, in this order: women, men, undefined.

- Each name counts as woman, man or undefined.
- Undefined: the name is not clearly of one gender, or the AI picks neither woman nor man.
- No users: the three numbers are 0, and the AI is not called.
- Only the name decides the gender.

Example: users Elena, Mateo and Alex → `{ women: 1, men: 1, genderUndefined: 1 }`.

## Failures

- The AI sends no message → every name sent with it counts as undefined.
- The AI's answer cannot be read → every name sent with it counts as undefined.
- The AI's answer does not give one gender per name → every name sent with it counts as undefined.
- The AI does not respond → `Could not classify the users`.

## Out of scope

- Saving the gender or any other new data.
- Changing the other user features.
- Classifying when a user is created or renamed.
- Using the email.
- Returning the list of users or the gender of each user.
- Using a paid AI.
