#!/bin/bash
# Launch / health check for the Fresca website.
#   ./check-launch.sh https://frescapremierfresh.com          full check of the live site
#   ./check-launch.sh http://127.0.0.1:8098 --local            same, for a local test server (skips the HTTPS test)
#   ./check-launch.sh https://sharlmon.github.io/fresca-premier-fresh --preview   preview mode (no PHP, no redirects)
BASE="${1:?usage: check-launch.sh <base-url> [--local|--preview]}"; BASE="${BASE%/}"; MODE="$2"
pass=0; fail=0; warn=0
ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
note() { printf '  \033[33mWARN\033[0m  %s\n' "$1"; warn=$((warn+1)); }
code() { curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$@"; }

echo "== Pages (expect 200)"
for p in "" about/ products/ quality/ sustainability/ team/ contact/ privacy/ accessibility/; do
  c=$(code "$BASE/$p"); [ "$c" = 200 ] && ok "/$p" || bad "/$p -> $c"
done

echo "== Digital business cards (printed QR codes point here – must never break)"
for p in card/lucas/ card/judy/ card/lucas/Lucas-Omollo.vcf card/judy/Judy-Ogolla.vcf; do
  c=$(code "$BASE/$p"); [ "$c" = 200 ] && ok "/$p" || bad "/$p -> $c   (the /card folder must be uploaded to the site root)"
done

echo "== Search files"
curl -s "$BASE/sitemap.xml" | grep -q '<urlset' && ok "sitemap.xml" || bad "sitemap.xml missing"
R=$(curl -s "$BASE/robots.txt")
if [ "$MODE" = "--preview" ]; then echo "$R" | grep -q 'Disallow: /' && ok "robots.txt blocks search engines (preview)" || bad "preview should block search engines"
else echo "$R" | grep -q 'Allow: /' && echo "$R" | grep -q 'Sitemap:' && ok "robots.txt allows search + lists sitemap" || bad "robots.txt wrong (is the PREVIEW build live by mistake?)"
  echo "$R" | grep -q 'Disallow: /$' && bad "robots.txt blocks everything"; fi
curl -s "$BASE/" | grep -q 'name="robots" content="noindex' && { [ "$MODE" = "--preview" ] && ok "home has noindex (preview)" || bad "home page says noindex – search engines will ignore the site"; } || { [ "$MODE" = "--preview" ] && bad "preview should say noindex" || ok "home page is indexable"; }

echo "== Missing pages show the custom 404"
c=$(code "$BASE/this-page-does-not-exist/"); [ "$c" = 404 ] && ok "unknown address -> 404" || bad "unknown address -> $c (want 404)"

if [ "$MODE" != "--preview" ]; then
  echo "== Old WordPress addresses redirect to the new pages (301)"
  chk() { local from="$1" to="$2" out; out=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 20 "$BASE$from")
    case "$out" in "301 $BASE$to"|"301 $to") ok "$from -> $to";; *) bad "$from -> got '$out' (want 301 $to)";; esac; }
  chk /about-us/ /about/;  chk /contact-us/ /contact/;  chk /team-at-fresca-premier-fresh/ /team/;  chk /packages/ /products/
  chk /sample-page/ /;  chk /2026/07/03/hello-world/ /;  chk /feed/ /;  chk /category/uncategorized/ /;  chk /author/admin/ /
  echo "== Contact form script"
  b=$(curl -s --max-time 20 "$BASE/contact.php")
  if echo "$b" | grep -q '"ok":false'; then ok "contact.php is running PHP (answers JSON)"
  elif echo "$b" | grep -q '<?php'; then bad "contact.php is being shown as text – PHP is not running for this folder"
  else bad "contact.php gave an unexpected answer: ${b:0:80}"; fi
  echo "== Security + speed headers"
  H=$(curl -sI --max-time 20 "$BASE/")
  echo "$H" | grep -qi 'x-content-type-options: nosniff' && ok "X-Content-Type-Options" || note "X-Content-Type-Options missing (mod_headers off?)"
  echo "$H" | grep -qi 'referrer-policy' && ok "Referrer-Policy" || note "Referrer-Policy missing"
  curl -sI --max-time 20 -H 'Accept-Encoding: gzip' "$BASE/_nuxt/$(curl -s "$BASE/" | grep -o '_nuxt/[^"]*\.js' | head -1 | sed 's#_nuxt/##')" | grep -qi 'content-encoding: gzip\|content-encoding: br' && ok "compression on" || note "compression not detected"
fi
if [ "$MODE" != "--local" ] && [ "$MODE" != "--preview" ]; then
  echo "== HTTPS"
  h=${BASE#https://}; c=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 20 "http://$h/")
  case "$c" in 301*https://*|302*https://*|308*https://*) ok "http:// redirects to https://";; *) note "http:// did not redirect to https:// ($c) – turn on 'Force HTTPS' in cPanel > Domains";; esac
fi
echo; echo "Result: $pass passed, $fail failed, $warn warnings"; [ "$fail" = 0 ]
