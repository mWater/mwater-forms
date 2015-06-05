# Response Lifecycle

## Basics

All responses start in `draft` state.

When they are submitted, they go to `final` if there are no approval stages, otherwise they go to `pending`.

When `final` or `pending`, they may be rejected, in which case they go to `rejected` until deleted or resubmitted to `pending` or `final`.

## Entity Creation

Some forms have entity questions with property links set to save data. These trigger entity updates.

Entity updates are stored in `pendingEntityUpdates` in the response until resolved (usually immediately before being sent to server).

If an entity question is flagged as `createEntity` = true, then it will create instead of update an entity if left blank. In this case, it goes to `pendingEntityCreates`.

If the entity has not been created (is still in `pendingEntityCreates`) and the state is moved from `final` to `rejected`, then the entity question is blanked and the pending op is cancelled.