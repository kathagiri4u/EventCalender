# Contributing to EventCalendar

---

## SOLID Design Principles

All new and modified code must follow SOLID principles:

- **Single Responsibility (SRP)**: Each module/function/component should have one reason to change. Keep UI components focused on rendering; move business logic to `lib/` or custom hooks (e.g., `useMajorEvents()`).
- **Open/Closed (OCP)**: Design modules (e.g., event flagging, data adapters) to be extendable via new modules or configuration without modifying existing tested code. Prefer composition over modification.
- **Liskov Substitution (LSP)**: Use `Team`, `SportEvent`, and other interfaces consistently so alternate implementations can substitute without changing behavior.
- **Interface Segregation (ISP)**: Keep interfaces small and focused. Prefer multiple small interfaces over one large interface.
- **Dependency Inversion (DIP)**: Depend on abstractions (interfaces) for external systems (API clients, data stores). Inject dependencies via constructor arguments, hook params, or React context providers so tests can supply fakes.

---

## File & Module Guidelines

- Keep components lean: render + minimal props. Place data transformations and business rules in `lib/` functions with unit tests.
- API clients: export an interface (e.g., `EspnClient`) and a default implementation. Tests provide a fake implementation for determinism.
- Avoid long parameter lists — prefer small config objects or domain-specific types.

---

## Testing Strategy

- **Coverage requirement**: All production code (`app/`, `components/`, `lib/`, `store/`, `types/`) must hit **100%** statements, branches, functions, and lines.
- **Unit tests**: `vitest` or `jest` + `@testing-library/react` for components; `vitest` for pure functions in `lib/`.
- **Integration tests**: `@testing-library/react` + React Testing Library for component integration and hooks.
- **End-to-end tests**: `Playwright` for critical user flows (calendar navigation, event details, search, filters).
- **Mocking**: Mock external APIs at the network boundary using `msw`. Wrap HTTP clients in `lib/espn.ts` and `lib/sportsdb.ts` so mocks can be injected.
- **Typesafety**: All tests and source must compile under `tsc --noEmit`.

### Test Conventions

- File naming: `ComponentName.test.tsx` for components, `libFunction.test.ts` for utilities.
- Scripts in `package.json`: `test:unit`, `test:integration`, `test:e2e`.

```bash
pnpm test:unit --watch
pnpm test --coverage
pnpm playwright test
```

---

## CI Enforcement

`.github/workflows/ci.yml` runs:
1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm build`
4. `pnpm test --coverage`
5. `pnpm coverage:check` — fails if any metric < 100%

Coverage thresholds in `vitest.config.ts`:
```ts
coverage: { statements: 100, branches: 100, functions: 100, lines: 100 }
```

`husky` pre-commit hook runs `pnpm test:unit:changed` for fast local feedback.

---

## PR Checklist

Before merging, confirm all of the following:

- [ ] Tests added for new behavior and edge cases
- [ ] Coverage is 100% (include coverage report in PR)
- [ ] Code follows SOLID guidelines and keeps components small
- [ ] `tsc --noEmit` passes
- [ ] `pnpm lint` and `prettier` formatting passes
- [ ] CI is green and coverage badge is updated if needed

---

## Exceptions

100% coverage is required to prevent regressions. Exceptions must be documented in the PR and approved by a maintainer. Generated files, vendor assets, and large third-party libraries should be excluded via `.nycrc` or the coverage config.
