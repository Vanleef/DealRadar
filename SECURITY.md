# Security Policy

## Supported version

The actively deployed `main` branch is the supported version of DealRadar.

## Reporting a vulnerability

Please do not disclose suspected vulnerabilities in a public issue. Contact the repository owner privately through the contact information on the GitHub profile and include:

- the affected route or component;
- reproducible steps;
- expected and observed impact;
- any suggested mitigation.

Do not include real credentials, access tokens, personal data, or destructive proof-of-concept payloads.

## Security principles

- External account passwords are never collected by DealRadar.
- OAuth, OpenID and API credentials must remain in server-side secret storage.
- User-owned records require server-side identity and ownership checks.
- Mutating API requests require JSON, a same-origin context and bounded payloads.
- Personal API responses are marked `no-store`.
- Production responses include CSP, anti-clickjacking, transport and browser-permission controls.
- Dependencies are reviewed before each production release.
