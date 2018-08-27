/* Utils for tests. */

import React from "react";
import {
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag
} from "react-dom/test-utils";
import { findDOMNode } from "react-dom";

import { render } from './render';
import FormWithTheme, { Form } from "../src";

export function createComponent(Component, props) {
  return render(<Component {...props} />);
}

export function createFormComponent(props) {
  const wrapper = render(
    <FormWithTheme {...props} safeRenderCompletion={true} />
  );
  const compForm = findRenderedComponentWithType(wrapper.comp, Form);
  const nodeForm = findRenderedDOMComponentWithTag(wrapper.comp, "form");

  return {
    comp: compForm,
    node: nodeForm,
    wrapper
  };
}

export function setProps(comp, newProps) {
  const node = findDOMNode(comp);
  render(React.createElement(comp.constructor, newProps), node.parentNode);
}

export function suppressLogs(type, fn) {
  jest.spyOn(console, type);
  global.console[type].mockImplementation(() => {});
  fn();
  global.console[type].mockRestore();
}
