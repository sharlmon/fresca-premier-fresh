<?php
/**
 * Contact form handler for the static Fresca site (runs on the cPanel/PHP host).
 * Receives the form from /contact, emails it to TO, and answers with JSON.
 *
 * Protections: same-origin check, honeypot field, minimum fill time,
 * per-IP rate limit, strict validation, header-injection stripping.
 */
declare(strict_types=1);

const TO   = 'info@frescapremierfresh.com';
const FROM = 'noreply@frescapremierfresh.com';   // must be an address on this domain so SPF passes

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out(int $code, array $data): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $key, int $max, bool $multiline = false): string
{
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $v) ?? '';
    if (!$multiline) {
        $v = str_replace(["\r", "\n"], ' ', $v);
    }
    return mb_substr(trim($v), 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    out(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

// Same-origin only (ignores a leading "www.").
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $norm = static fn (string $h): string => strtolower(preg_replace('/^www\./i', '', preg_replace('/:\d+$/', '', $h)) ?? '');
    $originHost = parse_url($origin, PHP_URL_HOST);
    if (!is_string($originHost) || $norm($originHost) !== $norm($_SERVER['HTTP_HOST'] ?? '')) {
        out(403, ['ok' => false, 'error' => 'Request not allowed.']);
    }
}

// Honeypot: bots fill the hidden field. Pretend success so they move on.
if (field('website', 200) !== '') {
    out(200, ['ok' => true]);
}

// Humans take more than ~1.2 s to fill a form.
if ((int) ($_POST['elapsed'] ?? 0) < 1200) {
    out(429, ['ok' => false, 'error' => 'Please wait a moment and try again.']);
}

// One message per visitor every 30 seconds.
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lock = sys_get_temp_dir() . '/fresca_contact_' . sha1($ip);
if (is_file($lock) && time() - (int) @filemtime($lock) < 30) {
    out(429, ['ok' => false, 'error' => 'Please wait a little before sending another message.']);
}

$name    = field('name', 100);
$company = field('company', 120);
$email   = field('email', 150);
$phone   = field('phone', 40);
$product = field('product', 80);
$message = field('message', 3000, true);

if ($name === '' || $message === '' || mb_strlen($message) < 5) {
    out(422, ['ok' => false, 'error' => 'Please fill in your name and a short message.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
}

$subject = 'Website enquiry from ' . $name . ($company !== '' ? ' (' . $company . ')' : '');
$body = "New enquiry from the Fresca Premier Fresh website\n"
      . "------------------------------------------------\n"
      . "Name:    $name\n"
      . "Company: $company\n"
      . "Email:   $email\n"
      . "Phone:   $phone\n"
      . "Product: $product\n\n"
      . "Message:\n$message\n\n"
      . "------------------------------------------------\n"
      . 'Sent ' . gmdate('Y-m-d H:i') . " UTC from IP $ip\n";

$headers = [
    'From: Fresca Website <' . FROM . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];
// The visitor's name is part of a header, so strip anything that could break out of it.
$headers[1] = 'Reply-To: ' . preg_replace('/[^\p{L}\p{N} .\'-]/u', '', $name) . ' <' . $email . '>';

$sent = mail(TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . FROM);

if (!$sent) {
    out(500, ['ok' => false, 'error' => 'We could not send your message. Please email info@frescapremierfresh.com directly.']);
}

@touch($lock);
out(200, ['ok' => true]);
