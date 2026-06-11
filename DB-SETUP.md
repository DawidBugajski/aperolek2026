# 🗄️ Baza danych (Supabase) — jak postawić

Strona działa też **bez bazy** (checklisty wtedy lecą per przeglądarka). Poniższe kroki
włączają **wspólne, synchronizowane** listy i budżet. Zajmuje ~5 minut.

## 1. Załóż projekt Supabase
1. Wejdź na [supabase.com](https://supabase.com) → **Sign in** (najlepiej „Continue with GitHub" na prywatnym koncie).
2. **New project** → nazwa np. `aperolek2026`, ustaw hasło do bazy (zapisz je), region np. Frankfurt.
3. Poczekaj ~1 min, aż projekt się postawi.

## 2. Utwórz tabele
1. W projekcie: **SQL Editor** → **New query**.
2. Wklej **całą** zawartość pliku [supabase/schema.sql](supabase/schema.sql) i kliknij **Run**.
3. Powinno przejść bez błędów (tworzy tabele `checks`, `expenses`, `settlements` + reguły).

## 3. Skopiuj klucze
W projekcie: **Project Settings** (koło zębate) → **API** oraz **API Keys**. Potrzebujesz trzech wartości:

| W Supabase | Do której zmiennej |
|------------|--------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **publishable key** (`sb_publishable_...`) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| **secret key** (`sb_secret_...`, sekret!) | `SUPABASE_SECRET_KEY` |

> Klucz **secret** jest w **API Keys → Secret keys** (trzeba go odsłonić „Reveal" lub utworzyć).
> To odpowiednik dawnego „service_role" - daje pełny dostęp, więc trzymaj go tylko w env.

## 4. Wklej klucze lokalnie
1. Skopiuj `.env.local.example` jako **`.env.local`**.
2. Wklej trzy wartości. Plik `.env.local` **nie trafia do gita** (jest w `.gitignore`).
3. Zrestartuj dev server (`npm run dev`), żeby załapał zmienne.

## 5. Wklej klucze na Vercelu (po deployu)
W projekcie na Vercel: **Settings → Environment Variables** → dodaj te same trzy zmienne
(dla środowiska Production i Preview). Po dodaniu zrób **Redeploy**.

> ⚠️ `SUPABASE_SECRET_KEY` to sekret z pełnym dostępem do bazy — trzymaj go tylko
> w `.env.local` i w zmiennych Vercela. Nigdy w kodzie ani w gicie.

---

Gdy masz klucze w `.env.local` — daj znać, sprawdzimy, czy listy i budżet zapisują się
do bazy i synchronizują między urządzeniami.
