# Classify users by name, six at a time

The person who runs the app on their machine can still ask how the saved users split by gender. Only that person has access.

The answer is still three numbers: how many users are male, how many are female, and how many are undefined. The numbers are counted when asked. They are not saved.

Today Llama 3 is asked about one name at a time. That is slow when there are many users. Now the names are sent to Llama 3 in groups of six. The last group can have fewer than six names.

Llama 3 must answer in a fixed shape: one label for each name, in the same order, and each label is only male, female, or undefined. The shape is checked strictly, so Llama 3 cannot answer with free text.

Example: seven users give two questions to Llama 3, one with six names and one with one name. Three users, one clear male name, one clear female name, and one name that is not clear, give male 1, female 1, undefined 1. If there are no users, the three numbers are 0 and Llama 3 is not asked.

If Ollama does not answer, or answers with a different number of labels than names, the count fails. A partial count is not returned.
