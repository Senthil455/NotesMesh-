# NoteMesh Open-Source Ethics & Principles

NoteMesh is developed under a clear set of ethical principles designed to protect users, respect contributors, and build long-term trust.

---

## 1. Local-First & Data Sovereignty

Knowledge work is intensely personal and private. NoteMesh is designed from the ground up around the following rules:

- **Zero Cloud Lock-In**: The application must function completely offline and without requiring user accounts or third-party cloud authentication.
- **Zero Telemetry or Spyware**: NoteMesh core does not bundle tracking scripts, behavior analytics, device fingerprinting, or hidden telemetry.
- **Data Portability**: Notes are stored in standard Markdown (`.md`) format. Visual diagrams are stored in transparent JSON and can be exported as SVG/PNG. Users can back up, transfer, and delete their data at any time without restriction.

---

## 2. Security & Plugin Sandboxing

As NoteMesh grows its community plugin ecosystem, the integrity of the user's workspace must remain paramount:

- **Explicit Permissions**: Plugins must declare exact permissions (`commands`, `statusbar`, `themes`, `export`, etc.) in their manifest.
- **No Unrestricted Access**: Plugins cannot access external networks or arbitrary filesystem paths without explicit, auditable user approval.
- **Transparent Code**: Community plugins must remain open source and inspectable.

---

## 3. Honest Open-Source Claims

As maintainers and contributors:

- We **never** ship "mock" buttons that pretend to perform cloud sync or AI features while silently doing nothing. Every control must either work reliably or be marked as `[Planned]`.
- We celebrate real contributors and genuine code contributions rather than artificially inflating repository stats.
- We document known limitations, architectural trade-offs, and performance boundaries openly.

---

## 4. Contributor Respect & Maintainer Commitments

For project administrators and maintainers:

- **Welcoming Review Culture**: Every Pull Request and Issue, regardless of the contributor's experience level, deserves constructive, respectful, and prompt review.
- **Clear Guidance**: Issues tagged `good first issue` must include concrete pointers and expected test criteria so new contributors succeed on their first attempt.
- **Credit and Recognition**: All contributors who report bugs, write docs, create themes, or author PRs are credited in our release notes and contributor roster.
