# Jupyter client, one notebook per feature

The CEO opens the app in the browser to understand what it does, try each feature, and decide if it covers today's needs. The CEO does not program and does not need to learn. Ella, who runs the app on her machine, starts it. Only people on that machine have access.

The notebooks open in Jupyter Notebook, not JupyterLab, on `127.0.0.1`, port 8888 when it is free. They open in the browser, not inside Cursor. The Jupyter belongs to the app: it does not use any Jupyter already installed on the machine.

There is one notebook for each feature that already exists in the terminal client, and one welcome notebook with an index that links to all of them. The features are: prepare the users table, create a user, list users, find a user by id, find a user by email, update a user, delete a user, and count users by gender. Preparing the table is a technical step, not something a user does, and its notebook says so.

Each notebook is short: two cells. A text cell says, in Spanish, what the feature does, which data it needs, what it changes, how to tell it worked, and which errors can appear and how to fix them. Errors are only described in the text, not shown. Then one code cell runs the feature, with the input values at the top marked to be changed. The result appears as a table with colored headers. There is no helper code between the notebook and the app.

The notebooks work on the real database, `db/users.sqlite`, the same one as the terminal client. Creating, updating, and deleting change the real users, and every notebook says so before the code cell. Nothing is reset or restored by the notebooks. The notebooks that change data start with a safe value, so pressing Run without changing it does not change any real user.

Example: the CEO opens "Create a user", changes the name and email, presses Run, and sees the new user with its id and dates. Then the CEO opens "List users" and sees that user too. Repeating the creation with the same email shows "This email is already used.", and the text of the notebook explains how to fix it.

Counting users by gender needs Ollama running on the machine with the `llama3.2` model. Its text cell says so. The result comes from a model, so it can change between runs.

What goes wrong: Jupyter port 8888 is busy (the README says to use the port Jupyter shows), Ollama is not running (the count shows "The classifier failed."), or a notebook is run with an invalid input (it shows the app's own message).

Out of scope: changing how any feature behaves, adding features the terminal client does not have, JupyterLab, a demo or temporary database, and a way to reset the data.
