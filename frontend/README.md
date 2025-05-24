# Starmango Frontend (React + TypeScript + Vite)

This is the frontend application for the Starmango project, built with React, TypeScript, and Vite.

## Integration with Django Backend

This frontend has been integrated with the Starmango Django backend. The API connections have been configured to connect to the Django API at `http://localhost:8000/api` by default (configurable in the `.env` file).

Key integration points:
- Authentication flows connect to Django's authentication endpoints
- API services in `src/services/api.ts` are configured for the Django backend
- Multi-tenant support is implemented through the TenantContext

## Development Setup

The application uses:
- React + TypeScript
- Vite for fast development and building
- Radix UI components with Tailwind CSS for styling
- React Router for navigation

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
