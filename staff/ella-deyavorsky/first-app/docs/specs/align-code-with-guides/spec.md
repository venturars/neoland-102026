# Align the code with the guides

Issue: #536.

Whoever builds the app sees in the code the same shape as in the
guides. The app works the same way.

It is used by whoever writes a new feature and by whoever checks that
the code fits the guides.

The input is the code as it is now. No new data comes in.

The output is the same result for everything the app already does.
Creating, updating, deleting, listing, finding and counting by gender
return the same thing and fail with the same sentences, in the same
order, for every input. That includes an input with two problems at
once. Each line leaves one action in one name. A call and a check do
not share a line. A failure from the list is checked with a condition,
and the error goes on its own line.

Example: a user is created with the name " Ana " and the email
" ANA@Example.com ". The same user comes back as now: "Ana" and
"ana@example.com". The code that does it does not trim the email and
turn it to lower case on the same line.

Example: someone sends an update with only spaces in the name, for an
id that nobody has. The error is "No user was found.", as now.

There is no new failure from the "Errors" list, and no new
`TypeError`. If a result changes, if an error sentence changes, if a
check moves, or if a line still has two actions, the work is not done.

Out of scope: a new feature, a new error sentence, changing the SQL, a
new package, and changing the guides, except an example in the
constitution that shows two actions on one line. These are left for
future issues:

- Fixed values as constants in capital letters.
- Named imports instead of default imports.
- Removing the helper function from the gender count.
- Checking the input in the order the constitution gives.
- Returning a new object instead of the SQLite row.
- Comments in Spanish in the terminal files.
