# Events

Versioned site-to-cloud event schemas belong here. Events are immutable facts and must be idempotently consumable.

`site-event.schema.json` is the canonical envelope. Producers use `schemaVersion: 1`, globally unique UUID event IDs and UTC timestamps. Consumers reject unsupported versions and deduplicate on `id`.
