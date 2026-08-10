# Contributing to NEXA 2030

We love your input! We want to make contributing to this project as easy and transparent as possible.

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Pull Request Process

1. Update the README.md with details of changes
2. Update the CHANGELOG.md
3. Ensure tests pass and code is linted
4. Request review from maintainers

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add Google OAuth support

Implemented Google OAuth authentication flow
with proper error handling and user creation.

Closes #123
```

## Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run tests before submitting PR

```bash
npm test
```

## Reporting Bugs

Use GitHub Issues with template:
- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs

## Feature Requests

Use GitHub Discussions or Issues with:
- Use case
- Proposed solution
- Alternative approaches

## License

By contributing, you agree that your contributions will be licensed under MIT License.
