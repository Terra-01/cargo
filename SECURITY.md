# Security Policy

## Scope

Cargo is a fully static site. It has no backend, no database, no accounts, no
cookies, and it collects nothing. Every tool runs entirely in your browser, and
nothing you type, upload, or generate leaves the page.

That keeps the attack surface small, but not zero. Reports are welcome for:

- Cross-site scripting in any tool that renders user input (the Shader Gradient
  Lab text overlay, the Mockup Wrapper image upload, any search field).
- Malicious output from an export — a copied snippet, downloaded HTML, or
  generated PNG that does something it should not when used.
- Dependency vulnerabilities that are actually reachable from the built site.
- Anything that would let a page break out of its intended sandbox.

## Reporting

Please **do not open a public issue** for a security problem.

Use [GitHub's private vulnerability reporting](https://github.com/Terra-01/cargo/security/advisories/new)
on this repository. That opens a private channel with the maintainer.

Include what you did, what happened, what you expected, and the browser and
version. A proof of concept helps a lot.

## What to expect

Cargo is a side project maintained in spare time, so please calibrate:

- Acknowledgement within about a week.
- An assessment and a plan, or an explanation of why it is not an issue, within
  about a month.
- Credit in the release notes when a report leads to a fix, unless you would
  rather stay anonymous.

There is no bug bounty.

## Supported versions

Only the current `main` branch and the deployed site are supported. There are no
backports.
