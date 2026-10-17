# Review and verification / October 17, 2026

Actual source recovered from the existing private Site; the GitHub repository previously held only a README. No paid inference or resource creation. Existing Site audience is preserved.

## Corrected behavior
Approvals now include a SHA-256 binding to the exact action, review and Node test-file contents; expire after 15 minutes; reject mismatched hashes; revalidate test contents before execution; and serialize approval against an already running task. A cancellation observed before dispatch prevents execution. Child processes receive a forced termination after the existing timeout if graceful termination is ignored. Node file arguments follow an option terminator.

Actual tests cover authenticated access, real failing/passing Node tests, reviewed file writes, wrong approvals, changed tests, changed patch targets, path/symlink boundaries and browser sample checks. Commands: npm test; npm run build. This is a trusted-workspace local runner, not an OS sandbox or unrestricted autonomous coding agent. Hosted interactions are explicitly browser demonstrations. Pairing uses local HTTP on a trusted network and expires on runner restart.
