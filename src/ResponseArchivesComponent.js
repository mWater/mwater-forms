let ResponseArchivesComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;
import ResponseAnswersComponent from './ResponseAnswersComponent';
import moment from 'moment';

// Show complete change history of response
export default ResponseArchivesComponent = (function() {
  ResponseArchivesComponent = class ResponseArchivesComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.renderRecord = this.renderRecord.bind(this);
    }

    static initClass() {
      this.propTypes = {
        formDesign: PropTypes.object.isRequired,
        response: PropTypes.object.isRequired,
        schema: PropTypes.object.isRequired,  // Schema of the 
        locale: PropTypes.string, // Defaults to english
        T: PropTypes.func.isRequired,  // Localizer to use
        formCtx: PropTypes.object.isRequired,    // Form context to use
  
        history: PropTypes.array.isRequired, // The archives
        eventsUsernames: PropTypes.object.isRequired
      };
       // The usernames
    }

    renderRecord(record, previousRecord) {
      return R('div', {key: record._rev , style: {marginTop: 10}},
        R('p', {key: 'summary'},
          "Changes made by ",
          R('b', null, record.modified.by ? this.props.eventsUsernames[record.modified.by]?.username : "Anonymous"),
          " on ",
          moment(record.modified.on).format('lll')),

        R('div', {key: 'detail'},
          R(ResponseAnswersComponent, {
            formDesign: this.props.formDesign,
            data: record.data,
            schema: this.props.schema,
            locale: this.props.locale,
            T: this.props.T,
            formCtx: this.props.formCtx,
            prevData: previousRecord,
            showPrevAnswers: true,
            showChangedLink: false,
            highlightChanges: true,
            hideUnchangedAnswers: true,
            deployment: record.deployment
          }
          )
        )
      );
    }


    render() {
      if (this.props.history.length === 0) {
        return R('div', null, 
          R('i', null, "No changes made since submission"));
      }
      return R('div', null,
        _.map(this.props.history, (record, index) => { 
          if (index === 0) {
            return this.renderRecord(this.props.response, record);
          } else {
            return this.renderRecord(this.props.history[index - 1], record);
          }
        })
      );
    }
  };
  ResponseArchivesComponent.initClass();
  return ResponseArchivesComponent;
})();