#!/usr/bin/env zsh
# Walks you through deploying Friendsgiving: the API + Postgres on Railway, the web app on EAS Hosting.
# Safe to re-run: each step checks whether it's already done and skips ahead.
#
#   ./scripts/deploy.zsh
#
# Expects the API repo next to this one (override with API_DIR=/path/to/friendsgiving-api).

setopt err_exit pipe_fail no_unset
autoload -U is-at-least

APP_DIR=${0:A:h:h}
API_DIR=${API_DIR:-${APP_DIR:h}/friendsgiving-api}
ADMIN_KEY_FILE=$HOME/.config/friendsgiving/admin-key
PROD_ENV_FILE=.env.production.local
MIN_RAILWAY_CLI=5.42.1

# ─── Talking to you ──────────────────────────────────────────────────────────

step() { print -P "\n%F{208}%B━━ $1 ━━%b%f" }
info() { print -P "%F{180}›%f $1" }
ok()   { print -P "%F{green}✔%f $1" }
warn() { print -P "%F{yellow}!%f $1" }
fail() { print -P "%F{red}✘ $1%f"; exit 1 }

# confirm "Question?" — Enter means yes.
confirm() {
  local reply
  read -r "reply?$(print -P "%F{cyan}?%f $1 [Y/n] ")"
  [[ -z $reply || $reply == [Yy]* ]]
}

# ask VAR "Question" [default]
ask() {
  local reply
  read -r "reply?$(print -P "%F{cyan}?%f $2${3:+ [$3]}: ")"
  typeset -g "$1=${reply:-${3:-}}"
}

# require COMMAND "how to install it"
require() {
  (( $+commands[$1] )) && return 0
  warn "$1 isn't installed."
  confirm "Install it now with \`$2\`?" || fail "Install $1 yourself, then re-run me."
  eval "$2"
  rehash
}

# ─── Steps ───────────────────────────────────────────────────────────────────

check_tools() {
  step "1/6 · Checking your tools"
  [[ -d $API_DIR ]] || fail "Can't find the API repo at $API_DIR. Set API_DIR and re-run."
  require git     "xcode-select --install"
  require brew    'echo "Install Homebrew from https://brew.sh" && false'
  require node    "brew install node"
  require gh      "brew install gh"
  require railway "brew install railway"
  require eas     "npm install --global eas-cli"

  local railway_version=${${(z)$(railway --version)}[2]}
  if ! is-at-least $MIN_RAILWAY_CLI $railway_version; then
    warn "Railway CLI $railway_version is too old for infrastructure as code (needs $MIN_RAILWAY_CLI+)."
    confirm "Upgrade it with brew?" || fail "Upgrade the Railway CLI, then re-run me."
    brew upgrade railway
  fi
  ok "All tools present."
}

log_in_everywhere() {
  step "2/6 · Logging in"
  gh auth status >/dev/null 2>&1 || { info "GitHub first. A browser window will open."; gh auth login; }
  ok "GitHub: $(gh api user -q .login)"
  railway whoami >/dev/null 2>&1 || { info "Now Railway."; railway login; }
  ok "Railway: $(railway whoami)"
  eas whoami >/dev/null 2>&1 || { info "And Expo."; eas login; }
  ok "Expo: $(eas whoami | head -1)"
}

# push_repo DIR DEFAULT_GITHUB_NAME — commits anything pending, creates the GitHub repo if needed, pushes.
push_repo() {
  cd $1
  local repo=${1:t}
  if [[ -n $(git status --porcelain) ]]; then
    info "$repo has uncommitted changes:"
    git status --short | head -20
    confirm "Commit all of them?" || fail "Commit or stash them yourself, then re-run me."
    local message
    ask message "Commit message" "Prepare for deploy"
    git add -A
    git commit -qm "$message"
    ok "Committed."
  fi

  if git remote get-url origin >/dev/null 2>&1; then
    git push -qu origin HEAD
  else
    local name
    ask name "Name for the new private GitHub repo" $2
    gh repo create $name --private --source . --push
  fi
  ok "$repo is on GitHub: $(gh repo view --json url -q .url)"
}

push_to_github() {
  step "3/6 · Getting both repos onto GitHub"
  info "Railway and Expo deploy straight from GitHub, so the code has to live there."
  push_repo $API_DIR friendsgiving-api
  push_repo $APP_DIR friendsgiving-app
}

point_railway_at_repo() {
  cd $API_DIR
  local slug=$(gh repo view --json nameWithOwner -q .nameWithOwner)
  grep -q "API_REPO = '$slug'" .railway/railway.ts && return 0

  sed -i '' "s|^const API_REPO = '.*';|const API_REPO = '$slug';|" .railway/railway.ts
  git commit -qm "Point Railway at $slug" .railway/railway.ts
  git push -q
  ok "Railway will build from github.com/$slug."
}

deploy_api() {
  step "4/6 · Deploying the API and database to Railway"
  cd $API_DIR
  [[ -d .railway/node_modules ]] || (cd .railway && npm install --silent)
  point_railway_at_repo

  if ! railway status >/dev/null 2>&1; then
    if confirm "Create a new Railway project called \"friendsgiving\"? (No = pick an existing one)"; then
      railway init --name friendsgiving
    else
      railway link
    fi
  fi

  info "Here's what Railway will create or change:"
  railway config plan
  if confirm "Apply it?"; then
    info "If Railway says it can't access the repo, open railway.com → Account → Integrations,"
    info "give its GitHub app access to the repo, then re-run me."
    railway config apply
  fi

  set_admin_key
  API_URL=$(api_domain)
  wait_until_healthy
}

set_admin_key() {
  local variables=$(railway variable list --service api --kv 2>/dev/null || true)
  if [[ $variables == *Admin__ApiKey=* ]]; then
    ok "Admin key already set (yours is in $ADMIN_KEY_FILE if this machine made it)."
    return 0
  fi

  local key=$(openssl rand -hex 32)
  print -rn -- $key | railway variable set Admin__ApiKey --service api --stdin
  mkdir -p ${ADMIN_KEY_FILE:h}
  print -r -- $key > $ADMIN_KEY_FILE
  chmod 600 $ADMIN_KEY_FILE
  ok "Generated an admin key and saved it to $ADMIN_KEY_FILE"
  info "You'll paste it into the app's Admin screen once. Keep it secret."
}

api_domain() {
  local find_domain='railway domain list --service api --json 2>/dev/null | grep -oE "[a-z0-9.-]+\.up\.railway\.app" | head -1 || true'
  local domain=$(eval $find_domain)
  if [[ -z $domain ]]; then
    railway domain --service api --port 8080 >&2
    domain=$(eval $find_domain)
  fi
  [[ -n $domain ]] || fail "Couldn't find the API's Railway domain. Check the service's Networking tab."
  print -r -- "https://$domain"
}

wait_until_healthy() {
  info "Waiting for $API_URL/health. The first build takes a few minutes ☕"
  local attempt
  for attempt in {1..60}; do
    [[ $(curl -fsS --max-time 5 $API_URL/health 2>/dev/null) == OK ]] && { ok "API is up at $API_URL"; return 0; }
    sleep 10
  done
  warn "The API still isn't answering after 10 minutes."
  info "Look at the build logs with: (cd $API_DIR && railway logs --service api)"
  confirm "Carry on with the web app anyway?" || exit 1
}

deploy_web() {
  step "5/6 · Deploying the web app to EAS Hosting"
  cd $APP_DIR

  if [[ -z $(node -p "require('./app.json').expo.extra?.eas?.projectId ?? ''") ]]; then
    info "Linking this app to an Expo project (accept the defaults)."
    eas init
  fi

  eas env:pull --environment production --non-interactive --path $PROD_ENV_FILE >/dev/null
  local app_url=$(sed -n 's/^EXPO_PUBLIC_APP_URL=//p' $PROD_ENV_FILE | tr -d "\"'")
  local first_deploy_flags=()
  if [[ -z $app_url ]]; then
    local subdomain
    ask subdomain "Pick your web address: https://<this>.expo.app" friendsgiving
    app_url="https://$subdomain.expo.app"
    first_deploy_flags=(--dev-domain $subdomain)
  fi

  eas env:set --environment production --visibility plaintext --non-interactive \
    --name EXPO_PUBLIC_API_BASE_URL --value $API_URL
  eas env:set --environment production --visibility plaintext --non-interactive \
    --name EXPO_PUBLIC_APP_URL --value $app_url
  ok "Production env vars set (API: $API_URL, app: $app_url)."

  info "Building the web app…"
  eas env:pull --environment production --non-interactive --path $PROD_ENV_FILE >/dev/null
  npx expo export --platform web
  eas deploy --prod $first_deploy_flags

  APP_URL=$app_url
  check_deep_links
}

check_deep_links() {
  local code=$(curl -s -o /dev/null -w '%{http_code}' $APP_URL/friendsgiving/deep-link-check)
  if [[ $code == 200 ]]; then
    ok "Guest invite links work (a deep link loaded fine)."
  else
    warn "A guest link returned HTTP $code, so invite links won't open directly."
    info "Fix: set \"output\": \"static\" under \"web\" in app.json, then re-run me."
  fi
}

finish() {
  step "6/6 · Wrapping up"
  push_repo $APP_DIR friendsgiving-app

  local expo_owner=$(eas whoami | head -1)
  local slug=$(node -p "require('./app.json').expo.slug")
  info "One last click so pushes to master auto-deploy the web app:"
  info "open your Expo project → Settings → GitHub → connect $(gh repo view --json nameWithOwner -q .nameWithOwner)"
  confirm "Open the Expo project page now?" && open "https://expo.dev/accounts/$expo_owner/projects/$slug"

  print -P "\n%F{208}%B🦃 You're live!%b%f"
  print -P "  Web app:    %F{cyan}$APP_URL%f"
  print -P "  Admin:      %F{cyan}$APP_URL/admin%f   (key in $ADMIN_KEY_FILE)"
  print -P "  API:        %F{cyan}$API_URL%f"
  print -P "\n  From now on, pushing to GitHub redeploys both. Re-run me any time to fix things up."
}

check_tools
log_in_everywhere
push_to_github
deploy_api
deploy_web
finish
