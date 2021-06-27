// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import _ from 'lodash';
import React from 'react';
const H = React.DOM;
const R = React.createElement;

import ResponseAnswersComponent from "../src/ResponseAnswersComponent";
import simpleForm from './formDesign';
import sampleForm2 from '../src/sampleForm2';
import answers from './formAnswer';
import * as prevAnswers from './previousAnswers';

function T(str) {
  if (arguments.length > 1) {
    const iterable = Array.from(arguments).slice(1);
    for (let index = 0; index < iterable.length; index++) {
      const subValue = iterable[index];
      const tag = `{${index}}`;
      str = str.replace(tag, subValue);
    }
  }
  return str;
}

const formCtx = {
  locale: "en", 
  getAdminRegionPath(id, callback) {
    if (id === 'manitoba') {
      return callback(null, [canada, manitoba]);
    } else if (id === 'ontario') {
      return callback(null, [canada, ontario]);
    } else if (id === "canada") {
      return callback(null, [canada]);
    } else {
      return callback(null, []);
    }
  },

  getSubAdminRegions(id, level, callback) {
    if ((id == null)) {
      return callback(null, [canada]);
    } else if (id === "canada") {
      return callback(null, [manitoba, ontario]);
    } else {
      return callback(null, []);
    }
  },

  renderEntitySummaryView(entityType, entity) {
    return JSON.stringify(entity);
  },

  renderEntityListItemView(entityType, entity) {
    return JSON.stringify(entity);
  },

  findAdminRegionByLatLng(lat, lng, callback) { return callback("Not implemented"); },

  imageManager: {
    getImageUrl(id, success, error) { return error("Not implemented"); },
    getImageThumbnailUrl(id, success, error) { return error("Not implemented"); }
  },

  stickyStorage: {
    get(questionId) {
      return testStickyStorage[questionId];
    },
    set(questionId, value) {
      return testStickyStorage[questionId] = value;
    }
  },

  selectEntity: options => {
    return options.callback("1234");
  },

  getEntityById: (entityType, entityId, callback) => {
    if (entityId === "1234") {
      return callback({ _id: "1234", code: "10007", name: "Test" });
    } else {
      return callback(null);
    }
  },

  getEntityByCode: (entityType, entityCode, callback) => {
    if (entityCode === "10007") {
      return callback({ _id: "1234", code: "10007", name: "Test" });
    } else {
      return callback(null);
    }
  }
};

const stories = storiesOf('ResponseAnswersComponent', module);
stories.addDecorator(withKnobs);

stories
  .add('With Previous Data', () => {
    return R(ResponseAnswersComponent, {
      formDesign: simpleForm,
      data: answers,
      schema: {},
      formCtx,
      T,
      prevData: prevAnswers,
      showPrevAnswers: boolean('Show previous answers', false),
      highlightChanges: boolean('Highlight changes', false),
      hideUnchangedAnswers: boolean('Hide unchanged answers', false),
      showChangedLink: boolean('Show changed link', false),
      onChangedLinkClick: () => action('changeLinkClicked')()
    }
    );
});