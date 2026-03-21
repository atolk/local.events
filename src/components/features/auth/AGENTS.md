# Auth feature (`components/features/auth`)

## Architecture

- **LoginDialog** — Radix Dialog + trigger «Войти». Содержит OAuth-кнопки и **EmailLoginForm**.
- **OAuthButtons** — клиентские вызовы `signIn("google"|"yandex")` с редиректом на провайдера. Видимость кнопок задаётся пропом `oauth` (сервер читает `AUTH_*` и не раскрывает секреты).
- **EmailLoginForm** — вход через `signIn("credentials", { redirect: false })` + вкладка регистрации через server action `register`.
- **UserMenu** — `useSession` + `DropdownMenu`, выход через `signOut({ redirect: false })` и `router.refresh()`.

Сессия: JWT (`src/lib/auth.ts`). Пользователи и OAuth-аккаунты — SQLite через Prisma.

## Extension points

- Добавить провайдер: в `src/lib/auth.ts` + переменные `AUTH_<PROVIDER>_ID/SECRET`, прокинуть флаг в `oauth` в `header-auth.tsx`.
- Защита маршрутов: `auth()` в Server Components или middleware с `auth` из `src/lib/auth.ts`.

## Gotchas

- **Credentials + adapter**: используется `session: { strategy: "jwt" }`; таблица `Session` в Prisma для JWT не заполняется.
- **OAuth без env**: кнопки скрыты; показывается подсказка в **OAuthButtons**.
- **Диалог и карта**: контент диалога в портале с `z-50`, конфликта с Leaflet обычно нет.
- **Регистрация**: пароль только на сервере (bcrypt); в UI не логировать пароль.
