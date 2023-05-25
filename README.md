## Development

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

Primarily want to look under app. Important Directories are components, models, routes, services, types. You can ignore the other files in this directory if you aren't familiar with remix.

### Connecting to your database

It's a local sqlite db. The setup should initialize this for you. Should only need to run the app.