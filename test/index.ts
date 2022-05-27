// @ts-nocheck
const context = require.context(
  /*directory*/ "mocha-loader!.",
  /*recursive*/ true,
  /*match files*/ /Tests.(coffee|ts|tsx)$/
)
context.keys().forEach(context)
