// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import PropTypes from "prop-types"
import React from "react"

// Context types for forms. See formContext.d.ts for details
export let selectEntity = PropTypes.func

export let editEntity = PropTypes.func
export let renderEntitySummaryView = PropTypes.func.isRequired
export let renderEntityListItemView = PropTypes.func.isRequired
export let canEditEntity = PropTypes.func
export let getEntityById = PropTypes.func
export let getEntityByCode = PropTypes.func
export let locationFinder = PropTypes.object
export let displayMap = PropTypes.func
export let stickyStorage = PropTypes.object
export let scanBarcode = PropTypes.func
export let imageManager = PropTypes.object.isRequired
export let imageAcquirer = PropTypes.object
export let getCustomTableRows = PropTypes.func.isRequired
export let getCustomTableRow = PropTypes.func.isRequired
