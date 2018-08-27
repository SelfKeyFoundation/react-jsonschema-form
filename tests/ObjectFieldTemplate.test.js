import React, { PureComponent } from "react";

import { createFormComponent } from "./test-utils";

describe("ObjectFieldTemplate", () => {
  const formData = { foo: "bar", bar: "foo" };

  class ObjectFieldTemplate extends PureComponent {
    render() {
      const {
        properties,
        title,
        description,
        registry: {
          templates: { TitleTemplate, DescriptionTemplate },
        },
      } = this.props;
      return (
        <div className="root">
          <TitleTemplate title={title} />
          <DescriptionTemplate description={description} />
          <div>
            {properties.map(({ content }, index) => (
              <div key={index} className="property">
                {content}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  const TitleTemplate = () => <div className="title-template" />;
  const DescriptionTemplate = ({ description }) =>
    description ? <div className="description-template" /> : null;

  const { node } = createFormComponent({
    schema: {
      type: "object",
      properties: { foo: { type: "string" }, bar: { type: "string" } },
    },
    uiSchema: { "ui:description": "foobar" },
    formData,
    templates: { ObjectFieldTemplate, TitleTemplate, DescriptionTemplate },
  });

  it("should render one root element", () => {
    expect(node.querySelectorAll(".root")).toHaveLength(1);
  });

  it("should render one title", () => {
    expect(node.querySelectorAll(".title-template")).toHaveLength(1);
  });

  it("should render one description", () => {
    expect(node.querySelectorAll(".description-template")).toHaveLength(1);
  });

  it("should render two property containers", () => {
    expect(node.querySelectorAll(".property")).toHaveLength(2);
  });
});
