// @ts-nocheck
import $ from "jquery"
import { assert } from "chai"

class UIDriver {
  constructor(el: any) {
    this.el = $(el)
  }

  getDisabled(str: any) {
    for (let item of this.el.find("a,button")) {
      if ($(item).text().indexOf(str) !== -1) {
        return $(item).is(":disabled")
      }
    }
    return assert.fail(null, str, "Can't find: " + str)
  }

  click(str: any) {
    for (let item of this.el.find("a,button")) {
      if ($(item).text().indexOf(str) !== -1) {
        //console.log "Clicking: " + $(item).text()
        $(item).trigger("click")
        return
      }
    }
    return assert.fail(null, str, "Can't find: " + str)
  }

  fill(str: any, value: any) {
    return (() => {
      const result = []
      for (let item of this.el.find("label")) {
        if ($(item).text().indexOf(str) !== -1) {
          const box = this.el.find("#" + $(item).attr("for"))
          result.push(box.val(value))
        } else {
          result.push(undefined)
        }
      }
      return result
    })()
  }

  text() {
    return this.el.text()
  }

  html() {
    return this.el.html()
  }

  wait(after: any) {
    return setTimeout(after, 10)
  }
}

export default UIDriver
