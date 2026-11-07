# Pomodoro (learning project)

The owner is an experienced Angular developer learning React. Spec: `docs/MVP.md`.

- Who writes what is defined in "Division of work" below. For the owner's tasks, explain, review and give hints instead of writing the code.
- Spec tests (`*.test.ts` next to the reducer, selectors, stats, formatDuration) are the source of truth. Do not change them to make an implementation pass.
- Keep the FSD import direction and public `index.ts` APIs.
- Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Learning approach

- Just-in-time: before each MVP stage, give a short reading list covering only that stage's React topics. Do not front-load material from later stages.
- Every stage and every task within it comes with direct links to the docs needed to implement it (react.dev first, then Vite, TypeScript, MDN, Testing Library). Full URLs, each with a one-line note on what to look for there.
- Read with an Angular lens: point out what differs from Angular, not the basics.
- After reading, offer a few check questions or go straight to code and review.
- The owner records Angular → React differences per stage in `docs/angular-to-react.md`.
- Each task ends with the owner wiring the result into the running app and checking it locally in `npm run dev`. Every task description says where to integrate it (temporary place if the final one does not exist yet) and what to check in the browser.

## Division of work

- The owner writes code only where a task brings a fundamental React concept that differs from Angular and is not yet covered (rendering model, keys and reconciliation, state, reducer, effects, refs, context, external stores, derived state, etc.).
- Routine work with nothing new for the owner — components built from already covered concepts, wiring, mocks — Claude implements fully, including styles. Keep it idiomatic, since the owner learns from reading it too.
- At the start of each stage, say which tasks are the owner's (and which concept each teaches) and which Claude does. The owner can override.
- Claude writes all styling: CSS Modules next to components, `app/styles/global.css`, design tokens. On the owner's components Claude may only add `className` attributes, CSS module imports and purely presentational wrappers or attributes; anything beyond that, suggest it to the owner.

### Concepts the owner has covered

Update this list as tasks close.

- Stage 1: function components, props typing via `ComponentPropsWithoutRef`, destructuring with defaults, `...rest` spread and attribute order, `children`, named exports, CSS Modules, list rendering with `map` and `key` (incl. what duplicate keys break), callback props instead of `@Output`, arrow vs direct call in `onClick`, boolean ARIA attributes in JSX, basic `useState` (a plain variable does not trigger a re-render).
- Stage 2: `useReducer` and `dispatch` (component reports events, the reducer holds the rules), reducer purity (`now` in the action), immutable updates, bail-out by returning the same reference, lazy init via the third argument, state as a per-render snapshot (hook storage vs closures), render vs commit (re-render is not a DOM update) and what triggers a re-render.
- Stage 3: `useEffect` as synchronization with an external system, cleanup (runs before every re-run, not only on unmount), dependency arrays (everything the effect reads; stable `dispatch`/`setState`; destructuring inside the effect), stale closures in intervals, StrictMode double effects and idempotent actions, render purity (no `Date.now()`/`dispatch` in render), computing values during render instead of storing them, why synchronous `setState` in an effect is a smell, custom hooks (shared logic, not shared state).
- Stage 4: derived values during render without `useMemo` (and when `useMemo` is worth it), custom hooks without state, an effect with cleanup that restores the previous external value.
- Stage 5: `useRef` (a box that survives renders without re-rendering; DOM refs as the `@ViewChild` analog, `null` until commit, stable ref object), placing side effects next to their cause instead of an effect on the consequence, module-level helpers to avoid effect dependencies, Fast Refresh preserving state.
- Stage 6: `useSyncExternalStore` (`subscribe` outside the hook, string snapshots, same-tab notification, updater reading the store), Context as the DI analog (React 19 provider syntax, throwing hook outside the provider), lazy init as a one-time snapshot and explicit `APPLY_SETTINGS`, controlled forms (`value`/`checked` + `onChange`, string drafts, domain `onSave` instead of the DOM event, `SubmitEvent`/`ChangeEvent`), resetting state via `key`.
- Stage 7: derived data from a list (no stored aggregates, `useMemo` only when it pays off), `useNow` with a long interval for date-based values, a shared Context between sibling widgets (`useContext` vs `inject`), siblings not re-rendering each other.
- Stage 8: window listeners in an effect (same function reference in `removeEventListener`, native `KeyboardEvent` vs React's, `event.code`), declaring a handler inside the effect to keep deps honest, new objects/functions from render as deps causing resubscription, `useEffectEvent` (reactive vs non-reactive code, the `untracked` analog, deps `[]`), Rules of Hooks (call order, top level only, the `inject()` analog).
