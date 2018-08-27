import React from "react";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
import { fields, widgets, templates } from "../src";
import SchemaField from "../src/components/fields/SchemaField";
import { createComponent, createFormComponent } from "./test-utils";

describe("Rendering performance optimizations", () => {
  describe("Form", () => {
    it("should not render if next props are equivalent", () => {
      const schema = { type: "string" };
      const uiSchema = {};

      const { comp } = createFormComponent({ schema, uiSchema });
      jest.spyOn(comp, "render").mockImplementation(() => <div />);

      comp.componentWillReceiveProps({ schema });

      expect(comp.render).not.toHaveBeenCalled();
    });

    it("should not render if next formData are equivalent", () => {
      const schema = { type: "string" };
      const formData = "foo";

      const { comp } = createFormComponent({ schema, formData });
      jest.spyOn(comp, "render").mockImplementation(() => <div />);

      comp.componentWillReceiveProps({ formData });

      expect(comp.render).not.toHaveBeenCalled();
    });

    it("should only render changed object properties", () => {
      const schema = {
        type: "object",
        properties: {
          const: { type: "string" },
          var: { type: "string" }
        }
      };

      const { comp, rerender } = createFormComponent({
        schema,
        formData: { const: "0", var: "0" }
      });

      const fields = scryRenderedComponentsWithType(comp, SchemaField).reduce(
        (fields, fieldComp) => {
          jest.spyOn(fieldComp, "render").mockImplementation(() => <div />);
          fields[fieldComp.props.idSchema.$id] = fieldComp;
          return fields;
        }
      );

      rerender({ schema, formData: { const: "0", var: "1" } });

      expect(fields.root_const.render).not.toHaveBeenCalled();
      expect(fields.root_var.render).toHaveBeenCalledTimes(1);
    });

    it("should only render changed array items", () => {
      const schema = {
        type: "array",
        items: { type: "string" }
      };

      const { comp, rerender } = createFormComponent({
        schema,
        formData: ["const", "var0"]
      });

      const fields = scryRenderedComponentsWithType(comp, SchemaField).reduce(
        (fields, fieldComp) => {
          jest.spyOn(fieldComp, "render").mockImplementation(() => <div />);
          fields[fieldComp.props.idSchema.$id] = fieldComp;
          return fields;
        }
      );

      rerender({ schema, formData: ["const", "var1"] });

      expect(fields.root_0.render).not.toHaveBeenCalled();
      expect(fields.root_1.render).toHaveBeenCalledTimes(1);
    });
  });

  describe("SchemaField", () => {
    const onChange = () => {};
    const onBlur = () => {};
    const onFocus = () => {};
    const registry = {
      fields,
      widgets,
      templates,
      definitions: {},
      formContext: {}
    };
    const uiSchema = {};
    const schema = {
      type: "object",
      properties: {
        foo: { type: "string" }
      }
    };
    const idSchema = { $id: "root", foo: { $id: "root_plop" } };

    it("should not render if next props are equivalent", () => {
      const props = {
        registry,
        schema,
        uiSchema,
        onChange,
        idSchema,
        onBlur,
        onFocus
      };

      const { comp, rerender } = createComponent(SchemaField, props);
      jest.spyOn(comp, "render").mockImplementation(() => <div />);

      rerender(props);

      expect(comp.render).not.toHaveBeenCalled();
    });

    it("should not render if next formData are equivalent", () => {
      const props = {
        registry,
        schema,
        formData: { foo: "blah" },
        onChange,
        idSchema,
        onBlur
      };

      const { comp, rerender } = createComponent(SchemaField, props);
      jest.spyOn(comp, "render").mockImplementation(() => <div />);

      rerender({ ...props, formData: { foo: "blah" } });

      expect(comp.render).not.toHaveBeenCalled();
    });
  });
});
