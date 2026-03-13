# Certificates and keys

Place your Apple Push Notifications (APNs) P8 key here for EAS credentials.

## P8 file path for push notifications

1. Download your `.p8` key from [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list) (e.g. `AuthKey_XXXXXXXXXX.p8`).
2. Put the file in this folder, e.g. `certs/AuthKey_XXXXXXXXXX.p8`.
3. When `eas credentials` prompts **"Path to P8 file:"**, enter:
   ```text
   ./certs/AuthKey_XXXXXXXXXX.p8
   ```
   (Use the actual filename of your key.)

**Note:** P8 and other credential files in this directory are ignored by git (see project `.gitignore`). Do not commit them.
