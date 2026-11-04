Issue: #807

# The web client uses the real users

The web page of #785 shows 3 example users that live only in the browser. After this change it shows and changes the real users of the app, the same ones the terminal and the notebooks use. A change made in the page is seen in the terminal, and the other way round.

To make this possible, the database moves to its own small program that stays running. Every other part of the app asks that program for its data. The web page uses the same rules as the terminal. There is no extra layer between the rules and the page.

## Who uses it

- A student who opens the web page to choose who they are, change their name or email, or delete their user.
- A student who uses the terminal or the notebooks, as before.

There is no password, as in #785. Anyone who can reach the page on the machine can see and change every user.

## What is asked

- A command that starts the database program. While it runs, the web page, the terminal and the notebooks all read and write the same users.
- The web page opens from a web address that the program gives, not with a double click.
- The three screens and their text do not change. The list shows the users of the database. Save and Delete change the database.
- The error messages the page shows are the ones the app already has. The page has no rules of its own.
- The terminal and the notebooks keep working, with the database program running.

## Example

A student starts the database program and opens the page. The list shows the users of the database. They choose one, change the name and save. The menu shows the new name. In the terminal, the list of users shows the same new name. They reload the page and the name is still there.

## What goes wrong

- Empty name, email that is not valid or already used: the message of the app is shown and nothing is saved.
- The database program is not running: the page, the terminal and the notebooks say "The database failed.".
- The user was deleted from another place: the page says "No user was found.".

## Out of scope

Creating users from the page, real notes, passwords, the count by gender in the page, access from other computers, and tests of the database program.
