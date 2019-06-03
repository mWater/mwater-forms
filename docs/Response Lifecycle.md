# Response Lifecycle

## Basics

All responses start in `draft` state.

When they are submitted, they go to `final` if there are no approval stages, otherwise they go to `pending`.

When `final` or `pending`, they may be rejected, in which case they go to `rejected` until deleted or resubmitted to `pending` or `final`.

