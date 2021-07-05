import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement
import $ from "jquery"
import moment from "moment"
import ezlocalize from "ez-localize"
import ResponseAnswersComponent from "./ResponseAnswersComponent"
import ResponseArchivesComponent from "./ResponseArchivesComponent"
import ModalPopupComponent from "react-library/lib/ModalPopupComponent"
import * as formContextTypes from "./formContextTypes"

interface ResponseDisplayComponentProps {
  form: any
  response: any
  /** Schema including the form */
  schema: any
  formCtx: any
  apiUrl?: string
  /** Defaults to english */
  locale?: string
  /** Current login (contains user, username, groups) */
  login?: any
  /** True to display complete history always */
  forceCompleteHistory?: boolean
}

interface ResponseDisplayComponentState {
  T: any
  eventsUsernames: any
  loadingUsernames: any
  showCompleteHistory: any
  history: any
  showArchive: any
  showPrevAnswers: any
}

// Static view of a response
export default class ResponseDisplayComponent extends React.Component<
  ResponseDisplayComponentProps,
  ResponseDisplayComponentState
> {
  static childContextTypes = _.extend({}, formContextTypes, {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string // e.g. "fr"
  })

  constructor(props: any) {
    super(props)

    this.state = {
      eventsUsernames: null,
      loadingUsernames: false,
      showCompleteHistory: this.props.forceCompleteHistory || false,
      T: this.createLocalizer(this.props.form.design, this.props.formCtx.locale),
      history: null,
      loadingHistory: false,
      showArchive: false,
      showPrevAnswers: false
    }
  }

  componentWillMount() {
    return this.loadEventUsernames(this.props.response.events)
  }

  componentDidMount() {
    return this.loadHistory(this.props)
  }

  loadHistory(props: any) {
    const url = props.apiUrl + "archives/responses/" + props.response._id + "?client=" + (props.login?.client || "")
    this.setState({ loadingHistory: true })
    return $.ajax({ dataType: "json", url })
      .done((history: any) => {
        // Get only ones since first submission
        const index = _.findIndex(history, (rev) => ["pending", "final"].includes(rev.status))
        history = history.slice(0, index + 1)

        // Remove history where there was no change to data
        const compactHistory = []
        for (let i = 0; i < history.length; i++) {
          const entry = history[i]
          const prevEntry = i === 0 ? this.props.response : history[i - 1]
          if (!_.isEqual(entry.data, prevEntry.data)) {
            compactHistory.push(entry)
          }
        }

        return this.setState({ loadingHistory: false, history: compactHistory })
      })
      .fail((xhr: any) => {
        return this.setState({ loadingHistory: false, history: null })
      })
  }

  // Load user names related to events
  loadEventUsernames(events: any) {
    events = this.props.response.events || []

    const byArray = _.compact(_.pluck(events, "by"))
    if (byArray.length > 0 && this.props.apiUrl != null) {
      const filter = { _id: { $in: byArray } }
      const url = this.props.apiUrl + "users_public_data?filter=" + JSON.stringify(filter)
      this.setState({ loadingUsernames: true })
      return $.ajax({ dataType: "json", url })
        .done((rows: any) => {
          // eventsUsernames is an object with a key for each _id value
          return this.setState({ loadingUsernames: false, eventsUsernames: _.indexBy(rows, "_id") })
        })
        .fail((xhr: any) => {
          return this.setState({ loadingUsernames: false, eventsUsernames: null })
        })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    let events
    if (this.props.form.design !== nextProps.form.design || this.props.locale !== nextProps.locale) {
      this.setState({ T: this.createLocalizer(nextProps.form.design, nextProps.locale) })
    }

    if (!_.isEqual(this.props.response.response, nextProps.response.response)) {
      this.loadHistory(nextProps)
    }

    if (!_.isEqual(this.props.response.events, nextProps.response.events)) {
      this.loadEventUsernames(nextProps.response.events)
    }

    return (events = this.props.response.events || [])
  }

  getChildContext() {
    return _.extend({}, this.props.formCtx, {
      T: this.state.T,
      locale: this.props.locale
    })
  }

  // Creates a localizer for the form design
  createLocalizer(design: any, locale: any) {
    // Create localizer
    const localizedStrings = design.localizedStrings || []
    const localizerData = {
      locales: design.locales,
      strings: localizedStrings
    }
    const { T } = new ezlocalize.Localizer(localizerData, locale)
    return T
  }

  handleHideHistory = () => {
    return this.setState({ showCompleteHistory: false })
  }

  handleShowHistory = () => {
    return this.setState({ showCompleteHistory: true })
  }

  renderEvent(ev: any) {
    if (this.state.eventsUsernames == null) {
      return null
    }

    const eventType = (() => {
      switch (ev.type) {
        case "draft":
          return this.state.T("Drafted")
        case "submit":
          return this.state.T("Submitted")
        case "approve":
          return this.state.T("Approved")
        case "reject":
          return this.state.T("Rejected")
        case "edit":
          return this.state.T("Edited")
      }
    })()

    return R(
      "div",
      null,
      eventType,
      " ",
      this.state.T("by"),
      " ",
      ev.by ? this.state.eventsUsernames[ev.by]?.username : "Anonymous",
      " ",
      this.state.T("on"),
      " ",
      moment(ev.on).format("lll"),
      ev.message ? [": ", R("i", null, ev.message)] : undefined,
      ev.override ? R("span", { className: "label label-warning" }, this.state.T("Admin Override")) : undefined
    )
  }

  // History of events
  renderHistory() {
    if (this.state.loadingUsernames) {
      return R("div", { key: "history" }, R("label", null, this.state.T("Loading History...")))
    }

    const contents = []

    const events = this.props.response.events || []

    if (this.state.showCompleteHistory) {
      for (let ev of _.initial(events)) {
        contents.push(this.renderEvent(ev))
      }
    }

    const lastEvent = _.last(events)
    if (lastEvent) {
      contents.push(this.renderEvent(lastEvent))
    }

    if (events.length > 1 && !this.props.forceCompleteHistory) {
      if (this.state.showCompleteHistory) {
        contents.push(
          R(
            "div",
            null,
            R("a", { style: { cursor: "pointer" }, onClick: this.handleHideHistory }, this.state.T("Hide History"))
          )
        )
        contents.push(
          R(
            "div",
            null,
            R(
              "a",
              { style: { cursor: "pointer" }, onClick: () => this.setState({ showArchive: true }) },
              this.state.T("Show Complete History of Changes")
            )
          )
        )
      } else {
        contents.push(
          R(
            "div",
            null,
            R("a", { style: { cursor: "pointer" }, onClick: this.handleShowHistory }, this.state.T("Show History"))
          )
        )
      }
    }

    return R("div", { key: "history" }, contents)
  }

  renderStatus() {
    const status = (() => {
      switch (this.props.response.status) {
        case "draft":
          return this.state.T("Draft")
        case "rejected":
          return this.state.T("Rejected")
        case "pending":
          return this.state.T("Pending")
        case "final":
          return this.state.T("Final")
      }
    })()

    return R("div", { key: "status" }, this.state.T("Status"), ": ", R("b", null, status))
  }

  renderArchives() {
    if (!this.state.history || !this.state.showArchive) {
      return null
    }

    return R(
      ModalPopupComponent,
      {
        header: "Change history",
        size: "large",
        showCloseX: true,
        onClose: () => this.setState({ showArchive: false })
      },
      R(ResponseArchivesComponent, {
        formDesign: this.props.form.design,
        response: this.props.response,
        schema: this.props.schema,
        locale: this.props.locale,
        T: this.state.T,
        formCtx: this.props.formCtx,
        history: this.state.history,
        eventsUsernames: this.state.eventsUsernames
      })
    )
  }

  // Header which includes basics
  renderHeader() {
    return R(
      "div",
      { style: { paddingBottom: 10 } },
      R("div", { key: "user" }, this.state.T("User"), ": ", R("b", null, this.props.response.username || "Anonymous")),
      R("div", { key: "code" }, this.state.T("Response Id"), ": ", R("b", null, this.props.response.code)),
      this.props.response && this.props.response.submittedOn
        ? R(
            "div",
            { key: "submittedOn" },
            this.state.T("Submitted"),
            ": ",
            R("b", null, moment(this.props.response.submittedOn).format("lll"))
          )
        : undefined,
      this.props.response.ipAddress
        ? R("div", { key: "ipAddress" }, this.state.T("IP Address"), ": ", R("b", null, this.props.response.ipAddress))
        : undefined,
      this.renderStatus(),
      this.renderHistory(),
      this.renderArchives()
    )
  }
  render() {
    return R(
      "div",
      null,
      this.renderHeader(),
      React.createElement(ResponseAnswersComponent, {
        formDesign: this.props.form.design,
        data: this.props.response.data,
        deployment: this.props.response.deployment,
        schema: this.props.schema,
        locale: this.props.locale,
        T: this.state.T,
        formCtx: this.props.formCtx,
        prevData: this.state.history ? _.last(this.state.history) : null,
        showPrevAnswers: this.state.history != null && this.state.showPrevAnswers,
        highlightChanges: this.state.showPrevAnswers,
        showChangedLink: this.state.history != null,
        onChangedLinkClick: () => {
          return this.setState({ showPrevAnswers: !this.state.showPrevAnswers })
        },
        onCompleteHistoryLinkClick: () => {
          return this.setState({ showArchive: true })
        }
      })
    )
  }
}
