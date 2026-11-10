#!/usr/bin/env bash
# Run against your local Docker Compose stack after applying database migration.
set -euo pipefail
BASE="${BASE:-http://localhost/api}"
TMPDIR_TEST="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_TEST"' EXIT
COOKIE="$TMPDIR_TEST/cookies.txt"
EMAIL="test-$(date +%s)-$$@example.com"

echo "Checking health..."
curl -fsS "$BASE/health" | python3 -c "import json,sys; assert json.load(sys.stdin)['database']=='connected'"
echo "Registering a customer..."
curl -fsS -c "$COOKIE" -b "$COOKIE" -H 'Content-Type: application/json' \
  -d "{\"first_name\":\"Integration\",\"last_name\":\"Test\",\"email\":\"$EMAIL\",\"password\":\"TestPassword123!\"}" \
  "$BASE/auth/register" | python3 -c "import json,sys; assert json.load(sys.stdin)['user']['role']=='customer'"
curl -fsS -b "$COOKIE" "$BASE/auth/me" | python3 -c "import json,sys; assert json.load(sys.stdin)['user']['role']=='customer'"
status="$(curl -s -o /dev/null -w '%{http_code}' -b "$COOKIE" "$BASE/admin/users")"
test "$status" = 403
echo "Confirmed customer cannot access administrator routes."

echo "Creating a book with a database-promoted admin (local integration test)..."
# Direct database promotion is allowed only for trusted team members in a development database.
docker compose exec -T db psql -U postgres -d database -v ON_ERROR_STOP=1 -c \
  "UPDATE users SET role='admin' WHERE email='$EMAIL';" >/dev/null
curl -fsS -b "$COOKIE" "$BASE/admin/users" | python3 -c "import json,sys; assert 'users' in json.load(sys.stdin)"
BOOK="$(curl -fsS -b "$COOKIE" -H 'Content-Type: application/json' \
  -d '{"title":"Integration Test Book","author":"Team","price":"10.00","quantity":4}' \
  "$BASE/admin/books")"
BOOK_ID="$(printf '%s' "$BOOK" | python3 -c "import json,sys; print(json.load(sys.stdin)['book_id'])")"
echo "Created book #$BOOK_ID"
curl -fsS "$BASE/books/$BOOK_ID" | python3 -c "import json,sys; assert json.load(sys.stdin)['book']['title']=='Integration Test Book'"
curl -fsS -b "$COOKIE" -H 'Content-Type: application/json' \
  -d "{\"book_id\":$BOOK_ID,\"quantity\":2}" "$BASE/cart/items" \
  | python3 -c "import json,sys; assert len(json.load(sys.stdin)['items'])==1"
curl -fsS -b "$COOKIE" -H 'Content-Type: application/json' -d '{}' "$BASE/orders" \
  | python3 -c "import json,sys; assert json.load(sys.stdin)['order']['total']=='20.00'"
curl -fsS -b "$COOKIE" "$BASE/cart" | python3 -c "import json,sys; assert not json.load(sys.stdin)['items']"
curl -fsS -b "$COOKIE" "$BASE/orders" | python3 -c "import json,sys; assert len(json.load(sys.stdin)['orders'])>=1"
curl -fsS -b "$COOKIE" -X POST "$BASE/auth/logout" | python3 -c "import json,sys; assert json.load(sys.stdin)['message']=='Logged out'"
status="$(curl -s -o /dev/null -w '%{http_code}' -b "$COOKIE" "$BASE/auth/me")"
test "$status" = 401
echo "Smoke test passed. Test data remains in the database."
