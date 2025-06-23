This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

To learn more about supabase, take a look at the following resources:

- [Supabase Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Security Audit Summary

A security audit was performed on this project. Here is a summary of the findings:

- **Automated Scans:**
  - `bun audit` and `npm audit` commands failed to run due to project configuration and environment issues. This prevented an automated scan of all dependencies.

- **Manual Review of Key Dependencies:**
  - `next@15.3.2`: No critical vulnerabilities found for this version. The project is not affected by CVE-2025-29927 or CVE-2025-32421.
  - `@supabase/ssr@0.6.1`: No critical vulnerabilities found for this version.
  - `@supabase/supabase-js@2.49.8`: The check was interrupted and could not be completed.

- **Recommendations:**
  - **Resolve Dependency Issues:** It is recommended to fix the dependency conflicts in the project so that `npm audit` or `bun audit` can be run successfully. This will provide a comprehensive and automated way to check for vulnerabilities in all dependencies.
  - **Complete Manual Review:** The manual review of `@supabase/supabase-js` should be completed.
  - **Regular Audits:** Regular security audits should be performed on the project to identify and mitigate any new vulnerabilities that may be discovered.
  - **Low Severity Vulnerability:** There is a low severity vulnerability in the `brace-expansion` package, which is a dependency of a dependency. The automated tools were not able to fix this issue. The user can either wait for the dependencies to be updated or try to resolve the dependency conflict manually. The vulnerability details can be found at: https://github.com/advisories/GHSA-v6h2-p8h4-qcjw

## Package Manager

This project uses `bun` as the package manager.

To install the dependencies, run:
```
bun install
```

To run the application in development mode, run:
```
bun dev
```

