# Classify users by name

The person who runs the app on their machine can ask how the saved users split by gender. Only that person has access.

The answer is three numbers: how many users are male, how many are female, and how many are undefined. The numbers are counted when asked. They are not saved.

Llama 3, through Ollama on that same machine, decides each name. A clear male name adds one to male. A clear female name adds one to female. If Llama 3 is not sure, that user counts as undefined.

Example: three users, one clear male name, one clear female name, and one name that is not clear, give male 1, female 1, undefined 1. If there are no users, the three numbers are 0.

If Ollama does not answer, the count fails. A partial count is not returned.
