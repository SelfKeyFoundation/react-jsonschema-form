/* Utils for tests. */

import React from "react";
import {
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag
} from "react-dom/test-utils";
import { findDOMNode } from "react-dom";

import { render } from "./render";
import FormWithTheme, { Form } from "../src";

export function createComponent(Component, props) {
  const tools = render(<Component {...props} />);
  return {
    ...tools,
    rerender: props => tools.rerender(<Component {...props} />)
  };
}

export function createFormComponent(props) {
  const tools = createComponent(FormWithTheme, {
    ...props,
    safeRenderCompletion: true
  });
  const compForm = findRenderedComponentWithType(tools.comp, Form);
  const nodeForm = findRenderedDOMComponentWithTag(tools.comp, "form");

  return { ...tools, comp: compForm, node: nodeForm };
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
