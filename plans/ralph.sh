set -e

trap './plans/notify.sh "Ralph errored"' ERR

if [ -z "$1" ]; then
    echo "Usage: $0 <iterations>"
    exit 1
fi

for ((i=1; i<=$1; i++)); do
    echo "=== Iteration $i ==="
    echo "------------------------"
    # docker sandbox run --template claude-with-bun
    result=$(claude --dangerously-skip-permissions -p "@plans/prd.json @plans/progress.txt \

    CRITICAL: This project uses LATEST VERSIONS of libraries. Your training data may be outdated. \
    ALWAYS use Context7 MCP (mcp__context7__resolve-library-id then mcp__context7__query-docs) to look up docs BEFORE implementing features involving: \
    - Next.js 16: searchParams/params are Promises, verify if proxy.ts replaces middleware.ts \
    - Tailwind v4: CSS-first config, no tailwind.config.ts \
    - @trpc/tanstack-react-query: new createTRPCContext patterns \
    - better-auth: drizzle adapter, plugins, client setup \
    - Drizzle ORM: schema patterns, migrations \
    If Context7 returns no results, use WebSearch for official docs. \
    Do NOT assume APIs from training - always verify. \

    1. Find the highest-priority feature to work on and work only on that feature. \
    This should be the one YOU decide has the highest priority - not necessarily the first in the list. \
    2. If you made UI changes, you MUST use the Playwright MCP to visually verify the changes render correctly. \
    Navigate to the relevant page and take a snapshot. If it looks wrong, fix it before proceeding. \
    If Playwright fails to connect, restart the dev server and retry. \
    If you verify a protected page via Playwright and it shows you're not logged in (redirected to /login), you need to run the seed script first (bun run db:seed) to create the test user, then login as test@example.com / password123. \
    3. Run checks and fix any failures before moving on: \
    - bun run typecheck \
    - bun run lint \
    - bun run test \
    - bun run test:e2e \
    4. Update the PRD with the work that was done. \
    IMPORTANT: Only set 'passes': true if ALL steps in the PRD are fully implemented. \
    If some steps are done but others remain, keep 'passes': false and note partial progress in progress.txt. \
    A PRD with 4 steps where only 2 are done is NOT complete - do not mark it as passing. \
    5. After completing each task, append to progress.txt:
    - Task completed and PRD item reference
    - Key decisions made and reasoning
    - Files changed
    - Any blockers or notes for next iteration
    Keep entries concise. Sacrifice grammar for the sake of concision. This file helps future iterations skip exploration.\
    6. Make a git commit of that feature. \
    ONLY WORK ON A SINGLE FEATURE. \
    GENERAL: If you encounter any blocker requiring human intervention (missing API credentials, invalid tokens, environment setup, external service issues), output <human-required>description of what is needed</human-required> and stop working immediately. Be specific about what needs to be set up or fixed. \
    After completing your feature, check if every item in the PRD now has 'passes': true. If so, output <promise>COMPLETE</promise>. If any items still have 'passes': false, do not output that marker. \
    IMPORTANT: Never type <promise>COMPLETE</promise> anywhere in your response unless ALL PRD items have 'passes': true. Do not quote it, reference it, or explain why you are not outputting it.
    ") || true

    echo "$result"

    if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
        echo "PRD complete, exiting."
        ./plans/notify.sh "Ralph is finished"
        exit 0
    fi

    if [[ "$result" =~ \<human-required\>(.*)\</human-required\> ]]; then
        message="${BASH_REMATCH[1]}"
        short_message="${message:0:100}"
        echo "Human intervention required: $message"
        ./plans/notify.sh "Ralph needs help: $short_message"
        exit 1
    fi

    if [[ "$result" == *"You've hit your limit"* ]]; then
        echo "Rate limit hit, waiting 1 hour..."
        ./plans/notify.sh "Ralph hit rate limit, waiting 1 hour"
        sleep 3600
    fi
done

./plans/notify.sh "Ralph ran out of iterations"
