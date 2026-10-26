# Use pnpm

The person who works on this app on their machine installs what the app needs, and runs its scripts, with pnpm. Only that person has access. npm and yarn are not used for this app.

The same pnpm version is used every time. That version is pnpm 12.14.0.

Example: installing what the app needs is one pnpm command. Running the test script is one pnpm command. The test script still only says that no test is specified, then stops. There is still no command that starts the whole app.

If pnpm is not available on the machine, the install does not run. The guide that says which command to type must name pnpm. A guide that names npm is wrong for this app.
