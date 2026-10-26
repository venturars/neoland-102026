# Tasks — classify users by name, six at a time

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the constitution

- [ ] Nothing to change: no new file, no new error. Result: the constitution already covers this feature.

## Task 2 — Get the model ready

- [ ] Run `ollama list`. Result: `llama3.2:latest` is listed.
- [ ] Make sure Ollama is running. Result: the model answers on `http://127.0.0.1:11434`.

## Task 3 — Change the logic file

- [ ] Change the URL to `http://127.0.0.1:11434/v1/chat/completions`. Result: the call goes to the endpoint that accepts `strict`.
- [ ] Add a `batchSize` of 6. Result: the group size has one place.
- [ ] Add the JSON schema for `{ genders: [...] }`. Result: the answer shape is written down.
- [ ] Change the prompt to ask for one label per name, in order. Result: the model knows to answer a list.
- [ ] Replace `askGender(name)` with `askGenders(names)`, sending `response_format` with `strict: true`. Result: one request covers a group.
- [ ] Read `choices[0].message.content` and parse it, throwing "The classifier failed." on error. Result: the labels are read.
- [ ] Throw "The classifier failed." if the number of labels is not the number of names. Result: no partial count.
- [ ] Loop over the users in groups of six, adding one per label. Result: the three counts are filled.
- [ ] Remove `labelFromReply`. Result: no unused code.

## Task 4 — Run it

- [ ] Paste `clients/terminal/count-users-by-gender.txt` in the terminal with `first-app` as the current folder. Result: the three counts print.
- [ ] Stop. Result: the one-pass cycle is done.
