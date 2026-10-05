# Launch plan – replacing the WordPress site with the new Nuxt site

Hosting: Truehost cPanel, **WebHosting Starter**. The Fresca site lives in `/home/xfluoqgh/frescapremierfresh` (NOT `public_html`, which belongs to freiticglobal.com).
Everything below can be done from cPanel File Manager and Terminal. Nothing needs SSH.

## 0. Decide first
- [ ] Team page: which people to show (client answer pending).
- [ ] Confirm +254 700 752 341 is on WhatsApp (floating button uses it).
- [ ] Client reviews the Privacy Policy (and decides if the company must register with the Data Protection Commissioner).
- [ ] Client OKs the product list (11 products shown) and the "GLOBALG.A.P. / SMETA" wording.

## 1. Build
```
cd 05_website/site
nvm use 22                        # Node 22 is required
npm ci
npm run generate                  # production build -> .output/public (includes .htaccess and contact.php)
cd .output/public && zip -r ../../fresca-site.zip . && cd ../..
```
`.htaccess` is a hidden file: `zip -r … .` includes it. In cPanel File Manager turn on **Settings > Show Hidden Files**.

## 2. Email first (do before the site goes live)
The contact form sends from `noreply@frescapremierfresh.com`. Truehost already publishes SPF and a DMARC record (`p=quarantine`, strict SPF alignment), so **mail that fails both SPF and DKIM goes to spam**.
1. cPanel > **Email Deliverability** > Manage `frescapremierfresh.com`. If DKIM shows a problem, click **Install the suggested record** (or add the TXT record shown at the DNS host).
2. Create the mailboxes the website and brochure show: **info@**, **lucas@**, **judy@** (and **finance@** if Team keeps Jackson). cPanel > **Email Accounts**.
3. After launch, submit the form once and open the email in Gmail > **Show original**: want `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.
4. If the form's email never arrives or lands in spam: tell me. The fallback is to send through a real mailbox over SMTP instead of PHP `mail()`.

## 3. Rehearse on a staging address (recommended)
1. cPanel > **Domains > Create A New Domain** > `new.frescapremierfresh.com`, document root `/frescapremierfresh_staging`. Wait for AutoSSL.
2. Build with `PREVIEW=1 NUXT_PUBLIC_SITE_URL=https://new.frescapremierfresh.com npm run generate` (marks it noindex), upload, extract.
3. Copy the `card` folder in too, then run `04_tools/check-launch.sh https://new.frescapremierfresh.com`. Fix anything that fails.
4. Send a test enquiry through the form (see step 2.3).

## 4. Go live
1. **Back up WordPress**: cPanel > **WordPress Manager by Softaculous** > Backup, then **download** the backup. Also download the database from **phpMyAdmin > Export**.
2. In File Manager, open `/frescapremierfresh`. **Keep** the `card` folder (printed QR codes depend on it), `.well-known` and `cgi-bin`.
3. Create `/frescapremierfresh_wp_backup` (outside the web folder) and **move** (don't delete) all WordPress files into it: `wp-admin`, `wp-content`, `wp-includes`, `wp-*.php`, `index.php`, `xmlrpc.php`, `license.txt`, `readme.html`, the old `.htaccess`, etc. Leave the database alone.
4. Upload `fresca-site.zip` to `/frescapremierfresh`, **Extract**, delete the zip. Confirm `.htaccess` and `contact.php` are there.
5. Run: `04_tools/check-launch.sh https://frescapremierfresh.com` and fix any FAIL. Also open the site on a phone and test dark mode, WhatsApp, the accessibility button and the QR codes.
6. **Rollback** if something is wrong: move the WordPress files back from `/frescapremierfresh_wp_backup` and delete the new files. The old site returns in minutes.

## 5. Search engines
1. Google **Search Console** > Add property > Domain `frescapremierfresh.com` (verify with the DNS TXT record Truehost's zone editor lets you add).
2. **Sitemaps** > submit `https://frescapremierfresh.com/sitemap.xml`. In **URL inspection**, request indexing for the home page.
3. Claim / update the **Google Business Profile** (website = https://frescapremierfresh.com).
4. Old addresses (`/about-us/`, `/contact-us/`, `/packages/`, …) are redirected by `.htaccess`; the check script verifies this.
5. Update links the client controls: email signatures, LinkedIn, brochures, invoices.

## 6. After launch
- Uptime: `.github/workflows/uptime.yml` checks the site and the `/card/` pages every 30 minutes and emails the repository owner on failure. Once live, add `https://frescapremierfresh.com/contact/` to its list. (GitHub pauses scheduled jobs after 60 days with no repository activity.)
- Backups: the website source is in git; take a cPanel **Backup** (Full) monthly and keep the last 3.
- Keep `/frescapremierfresh_wp_backup` for ~30 days, then remove it (and the unused WordPress database).
- Calendar reminders: **domain expires 14 April 2027**; renew the Truehost plan before it lapses.
