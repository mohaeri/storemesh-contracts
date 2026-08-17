# StoreMesh Contracts

Canonical OpenAPI, AsyncAPI, JSON Schema, error codes, identifiers, and versioning rules shared by StoreMesh applications.

No application may invent an API payload or event outside this repository.

All mutating business operations require a stable `Idempotency-Key`. Site APIs use signed bearer tokens; site-to-cloud synchronization uses separate site credentials and immutable events.
