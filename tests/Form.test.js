import React from "react";
import { renderIntoDocument, Simulate } from "react-dom/test-utils";
import { findDOMNode } from "react-dom";

import Form from "../src";
import { render, fireEvent } from "./render";
import { createFormComponent, suppressLogs } from "./test-utils";

describe("Form", () => {
  describe("Empty schema", () => {
    it("should render a form tag", () => {
      const { node } = createFormComponent({ schema: {} });

      expect(node.tagName).toEqual("FORM");
    });

    it("should render a submit button", () => {
      const { node } = createFormComponent({ schema: {} });

      expect(node.querySelectorAll("button[type=submit]")).toHaveLength(1);
    });

    it("should render children buttons", () => {
      const props = { schema: {} };
      const comp = renderIntoDocument(
        <Form {...props}>
          <button type="submit">Submit</button>
          <button type="submit">Another submit</button>
        </Form>
      );
      const node = findDOMNode(comp);
      expect(node.querySelectorAll("button[type=submit]")).toHaveLength(2);
    });
  });

  describe("Option idPrefix", function() {
    it("should change the rendered ids", function() {
      const schema = {
        type: "object",
        title: "root object",
        required: ["foo"],
        properties: {
          count: {
            type: "number"
          }
        }
      };
      const comp = renderIntoDocument(<Form schema={schema} idPrefix="rjsf" />);
      const node = findDOMNode(comp);
      const inputs = node.querySelectorAll("input");
      const ids = [];
      for (var i = 0, len = inputs.length; i < len; i++) {
        const input = inputs[i];
        ids.push(input.getAttribute("id"));
      }
      expect(ids).toEqual(["rjsf_count"]);
    });
  });

  describe("Changing idPrefix", function() {
    it("should work with simple example", function() {
      const schema = {
        type: "object",
        title: "root object",
        required: ["foo"],
        properties: {
          count: {
            type: "number"
          }
        }
      };
      const comp = renderIntoDocument(<Form schema={schema} idPrefix="rjsf" />);
      const node = findDOMNode(comp);
      const inputs = node.querySelectorAll("input");
      const ids = [];
      for (var i = 0, len = inputs.length; i < len; i++) {
        const input = inputs[i];
        ids.push(input.getAttribute("id"));
      }
      expect(ids).toEqual(["rjsf_count"]);
    });

    it("should work with oneOf", function() {
      const schema = {
        $schema: "http://json-schema.org/draft-06/schema#",
        type: "object",
        properties: {
          connector: {
            type: "string",
            enum: ["aws", "gcp"],
            title: "Provider",
            default: "aws"
          }
        },
        dependencies: {
          connector: {
            oneOf: [
              {
                type: "object",
                properties: {
                  connector: {
                    type: "string",
                    enum: ["aws"]
                  },
                  key_aws: {
                    type: "string"
                  }
                }
              },
              {
                type: "object",
                properties: {
                  connector: {
                    type: "string",
                    enum: ["gcp"]
                  },
                  key_gcp: {
                    type: "string"
                  }
                }
              }
            ]
          }
        }
      };

      const comp = renderIntoDocument(<Form schema={schema} idPrefix="rjsf" />);
      const node = findDOMNode(comp);
      const inputs = node.querySelectorAll("input");
      const ids = [];
      for (var i = 0, len = inputs.length; i < len; i++) {
        const input = inputs[i];
        ids.push(input.getAttribute("id"));
      }
      expect(ids).toEqual(["rjsf_key_aws"]);
    });
  });

  describe("Custom field template", () => {
    const schema = {
      type: "object",
      title: "root object",
      required: ["foo"],
      properties: {
        foo: {
          type: "string",
          description: "this is description",
          minLength: 32
        }
      }
    };

    const uiSchema = {
      foo: {
        "ui:help": "this is help"
      }
    };

    const formData = { foo: "invalid" };

    function FieldTemplate(props) {
      const {
        id,
        classNames,
        label,
        help,
        required,
        description,
        errors,
        children
      } = props;
      return (
        <div className={"my-template " + classNames}>
          <label htmlFor={id}>
            {label}
            {required ? "*" : null}
          </label>
          {children}
          <span className="raw-help">
            {`${help} rendered from the raw format`}
          </span>
          <span className="raw-description">
            {`${description} rendered from the raw format`}
          </span>
          {errors ? (
            <ul>
              {errors.map((error, i) => (
                <li key={i} className="raw-error">
                  {error}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    let node;

    beforeEach(() => {
      node = createFormComponent({
        schema,
        uiSchema,
        formData,
        templates: { FieldTemplate },
        liveValidate: true
      }).node;
    });

    it("should use the provided field template", () => {
      expect(node.querySelector(".my-template")).toBeDefined();
    });

    it("should use the provided template for labels", () => {
      expect(node.querySelector(".my-template > label").textContent).toEqual(
        "root object"
      );
      expect(
        node.querySelector(".my-template .field-string > label").textContent
      ).toEqual("foo*");
    });

    it("should pass description as a string", () => {
      expect(node.querySelector(".raw-description").textContent).toEqual(
        "this is description rendered from the raw format"
      );
    });

    it("should pass errors as an array of strings", () => {
      expect(node.querySelectorAll(".raw-error")).toHaveLength(1);
    });

    it("should pass help as a string", () => {
      expect(node.querySelector(".raw-help").textContent).toEqual(
        "this is help rendered from the raw format"
      );
    });
  });

  describe("Custom submit buttons", () => {
    it("should submit the form when clicked", async () => {
      const onSubmit = jest.fn();
      const { getByText } = render(
        <Form onSubmit={onSubmit} schema={{}}>
          <button type="submit">Submit</button>
          <button type="submit">Another submit</button>
        </Form>
      );

      /**
       * From some of the reason this doesn't work with wait()
       */
      fireEvent.click(getByText("Submit"));
      fireEvent.click(getByText("Another submit"));

      await new Promise(setImmediate);

      expect(onSubmit).toHaveBeenCalledTimes(2);
    });
  });

  describe("Schema definitions", () => {
    it("should use a single schema definition reference", () => {
      const schema = {
        definitions: {
          testdef: { type: "string" }
        },
        $ref: "#/definitions/testdef"
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(1);
    });

    it("should handle multiple schema definition references", () => {
      const schema = {
        definitions: {
          testdef: { type: "string" }
        },
        type: "object",
        properties: {
          foo: { $ref: "#/definitions/testdef" },
          bar: { $ref: "#/definitions/testdef" }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(2);
    });

    it("should handle deeply referenced schema definitions", () => {
      const schema = {
        definitions: {
          testdef: { type: "string" }
        },
        type: "object",
        properties: {
          foo: {
            type: "object",
            properties: {
              bar: { $ref: "#/definitions/testdef" }
            }
          }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(1);
    });

    it("should handle references to deep schema definitions", () => {
      const schema = {
        definitions: {
          testdef: {
            type: "object",
            properties: {
              bar: { type: "string" }
            }
          }
        },
        type: "object",
        properties: {
          foo: { $ref: "#/definitions/testdef/properties/bar" }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(1);
    });

    it("should handle referenced definitions for array items", () => {
      const schema = {
        definitions: {
          testdef: { type: "string" }
        },
        type: "object",
        properties: {
          foo: {
            type: "array",
            items: { $ref: "#/definitions/testdef" }
          }
        }
      };

      const { node } = createFormComponent({
        schema,
        formData: {
          foo: ["blah"]
        }
      });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(1);
    });

    it("should raise for non-existent definitions referenced", () => {
      const schema = {
        type: "object",
        properties: {
          foo: { $ref: "#/definitions/nonexistent" }
        }
      };

      expect(() => createFormComponent({ schema })).toThrowError(Error);
    });

    it("should propagate referenced definition defaults", () => {
      const schema = {
        definitions: {
          testdef: { type: "string", default: "hello" }
        },
        $ref: "#/definitions/testdef"
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelector("input[type=text]").value).toEqual("hello");
    });

    it("should propagate nested referenced definition defaults", () => {
      const schema = {
        definitions: {
          testdef: { type: "string", default: "hello" }
        },
        type: "object",
        properties: {
          foo: { $ref: "#/definitions/testdef" }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelector("input[type=text]").value).toEqual("hello");
    });

    it("should propagate referenced definition defaults for array items", () => {
      const schema = {
        definitions: {
          testdef: { type: "string", default: "hello" }
        },
        type: "array",
        items: {
          $ref: "#/definitions/testdef"
        }
      };

      const { node } = createFormComponent({ schema });

      Simulate.click(node.querySelector(".array-item-add button"));

      expect(node.querySelector("input[type=text]").value).toEqual("hello");
    });

    it("should recursively handle referenced definitions", () => {
      const schema = {
        $ref: "#/definitions/node",
        definitions: {
          node: {
            type: "object",
            properties: {
              name: { type: "string" },
              children: {
                type: "array",
                items: {
                  $ref: "#/definitions/node"
                }
              }
            }
          }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelector("#root_children_0_name")).toBeFalsy();

      Simulate.click(node.querySelector(".array-item-add button"));

      expect(node.querySelector("#root_children_0_name")).toBeDefined();
    });

    it("should priorize definition over schema type property", () => {
      // Refs bug #140
      const schema = {
        type: "object",
        properties: {
          name: { type: "string" },
          childObj: {
            type: "object",
            $ref: "#/definitions/childObj"
          }
        },
        definitions: {
          childObj: {
            type: "object",
            properties: {
              otherName: { type: "string" }
            }
          }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("input[type=text]")).toHaveLength(2);
    });

    it("should priorize local properties over definition ones", () => {
      // Refs bug #140
      const schema = {
        type: "object",
        properties: {
          foo: {
            title: "custom title",
            $ref: "#/definitions/objectDef"
          }
        },
        definitions: {
          objectDef: {
            type: "object",
            title: "definition title",
            properties: {
              field: { type: "string" }
            }
          }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelector("legend").textContent).toEqual("custom title");
    });

    it("should propagate and handle a resolved schema definition", () => {
      const schema = {
        definitions: {
          enumDef: { type: "string", enum: ["a", "b"] }
        },
        type: "object",
        properties: {
          name: { $ref: "#/definitions/enumDef" }
        }
      };

      const { node } = createFormComponent({ schema });

      expect(node.querySelectorAll("option")).toHaveLength(3);
    });
  });

  describe("Default value handling on clear", () => {
    const schema = {
      type: "string",
      default: "foo"
    };

    it("should not set default when a text field is cleared", () => {
      const { node } = createFormComponent({ schema, formData: "bar" });

      Simulate.change(node.querySelector("input"), {
        target: { value: "" }
      });

      expect(node.querySelector("input").value).toEqual("");
    });
  });

  describe("Defaults array items default propagation", () => {
    const schema = {
      type: "object",
      title: "lvl 1 obj",
      properties: {
        object: {
          type: "object",
          title: "lvl 2 obj",
          properties: {
            array: {
              type: "array",
              items: {
                type: "object",
                title: "lvl 3 obj",
                properties: {
                  bool: {
                    type: "boolean",
                    default: true
                  }
                }
              }
            }
          }
        }
      }
    };

    it("should propagate deeply nested defaults to form state", done => {
      const { comp, node } = createFormComponent({ schema });

      Simulate.click(node.querySelector(".array-item-add button"));
      Simulate.submit(node);

      // For some reason this may take some time to render, hence the safe wait.
      setTimeout(() => {
        expect(comp.state.formData).toEqual({
          object: {
            array: [
              {
                bool: true
              }
            ]
          }
        });
        done();
      }, 250);
    });
  });

  describe("Submit handler", () => {
    it("should call provided submit handler with form state", () => {
      const schema = {
        type: "object",
        properties: {
          foo: { type: "string" }
        }
      };
      const formData = {
        foo: "bar"
      };
      const onSubmit = jest.fn();
      const { comp, node } = createFormComponent({
        schema,
        formData,
        onSubmit
      });

      Simulate.submit(node);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining(comp.state)
      );
    });

    it("should not call provided submit handler on validation errors", () => {
      const schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            minLength: 1
          }
        }
      };
      const formData = {
        foo: ""
      };
      const onSubmit = jest.fn();
      const onError = jest.fn();
      const { node } = createFormComponent({
        schema,
        formData,
        onSubmit,
        onError
      });

      Simulate.submit(node);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Change handler", () => {
    it("should call provided change handler on form state change", () => {
      const schema = {
        type: "object",
        properties: {
          foo: {
            type: "string"
          }
        }
      };
      const formData = {
        foo: ""
      };
      const onChange = jest.fn();
      const { node } = createFormComponent({
        schema,
        formData,
        onChange
      });

      Simulate.change(node.querySelector("[type=text]"), {
        target: { value: "new" }
      });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: {
            foo: "new"
          }
        })
      );
    });
  });

  describe("Blur handler", () => {
    it("should call provided blur handler on form input blur event", () => {
      const schema = {
        type: "object",
        properties: {
          foo: {
            type: "string"
          }
        }
      };
      const formData = {
        foo: ""
      };
      const onBlur = jest.fn();
      const { node } = createFormComponent({ schema, formData, onBlur });

      const input = node.querySelector("[type=text]");
      Simulate.blur(input, {
        target: { value: "new" }
      });

      expect(onBlur).toHaveBeenCalledWith(input.id, "new");
    });
  });

  describe("Focus handler", () => {
    it("should call provided focus handler on form input focus event", () => {
      const schema = {
        type: "object",
        properties: {
          foo: {
            type: "string"
          }
        }
      };
      const formData = {
        foo: ""
      };
      const onFocus = jest.fn();
      const { node } = createFormComponent({ schema, formData, onFocus });

      const input = node.querySelector("[type=text]");
      Simulate.focus(input, {
        target: { value: "new" }
      });

      expect(onFocus).toHaveBeenCalledWith(input.id, "new");
    });
  });

  describe("Error handler", () => {
    it("should call provided error handler on validation errors", () => {
      const schema = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            minLength: 1
          }
        }
      };
      const formData = {
        foo: ""
      };
      const onError = jest.fn();
      const { node } = createFormComponent({ schema, formData, onError });

      Simulate.submit(node);

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe("External formData updates", () => {
    describe("root level", () => {
      const formProps = {
        schema: { type: "string" },
        liveValidate: true
      };

      it("should update form state from new formData prop value", () => {
        const { comp } = createFormComponent(formProps);

        comp.componentWillReceiveProps({ formData: "yo" });

        expect(comp.state.formData).toEqual("yo");
      });

      it("should validate formData when the schema is updated", () => {
        const { comp } = createFormComponent(formProps);

        comp.componentWillReceiveProps({
          formData: "yo",
          schema: { type: "number" }
        });

        expect(comp.state.errors).toHaveLength(1);
        expect(comp.state.errors[0].stack).toEqual("should be number");
      });
    });

    describe("object level", () => {
      it("should update form state from new formData prop value", () => {
        const { comp } = createFormComponent({
          schema: {
            type: "object",
            properties: {
              foo: {
                type: "string"
              }
            }
          }
        });

        comp.componentWillReceiveProps({ formData: { foo: "yo" } });

        expect(comp.state.formData).toEqual({ foo: "yo" });
      });
    });

    describe("array level", () => {
      it("should update form state from new formData prop value", () => {
        const schema = {
          type: "array",
          items: {
            type: "string"
          }
        };
        const { comp } = createFormComponent({ schema });

        comp.componentWillReceiveProps({ formData: ["yo"] });

        expect(comp.state.formData).toEqual(["yo"]);
      });
    });
  });

  describe("Error contextualization", () => {
    describe("on form state updated", () => {
      const schema = {
        type: "string",
        minLength: 8
      };

      describe("Lazy validation", () => {
        it("should not update the errorSchema when the formData changes", () => {
          const { comp, node } = createFormComponent({ schema });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });

          expect(comp.state.errorSchema).toEqual({});
        });

        it("should not denote an error in the field", () => {
          const { node } = createFormComponent({ schema });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });

          expect(node.querySelectorAll(".field-error")).toHaveLength(0);
        });

        it("should clean contextualized errors up when they're fixed", () => {
          const altSchema = {
            type: "object",
            properties: {
              field1: { type: "string", minLength: 8 },
              field2: { type: "string", minLength: 8 }
            }
          };
          const { node } = createFormComponent({
            schema: altSchema,
            formData: {
              field1: "short",
              field2: "short"
            }
          });

          const submit = node => {
            suppressLogs(() => {
              Simulate.submit(node);
            });
          };

          submit(node);

          // Fix the first field
          Simulate.change(node.querySelectorAll("input[type=text]")[0], {
            target: { value: "fixed error" }
          });
          submit(node);

          expect(node.querySelectorAll(".field-error")).toHaveLength(1);

          // Fix the second field
          Simulate.change(node.querySelectorAll("input[type=text]")[1], {
            target: { value: "fixed error too" }
          });
          submit(node);

          // No error remaining, shouldn't throw.
          Simulate.submit(node);

          expect(node.querySelectorAll(".field-error")).toHaveLength(0);
        });
      });

      describe("Live validation", () => {
        it("should update the errorSchema when the formData changes", () => {
          const { comp, node } = createFormComponent({
            schema,
            liveValidate: true
          });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });

          expect(comp.state.errorSchema).toEqual({
            __errors: ["should NOT be shorter than 8 characters"]
          });
        });

        it("should denote the new error in the field", () => {
          const { node } = createFormComponent({
            schema,
            liveValidate: true
          });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });

          expect(node.querySelectorAll(".field-error")).toHaveLength(1);
          expect(
            node.querySelector(".field-string .error-detail").textContent
          ).toEqual("should NOT be shorter than 8 characters");
        });
      });

      describe("Disable validation onChange event", () => {
        it("should not update errorSchema when the formData changes", () => {
          const { comp, node } = createFormComponent({
            schema,
            noValidate: true,
            liveValidate: true
          });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });

          expect(comp.state.errorSchema).toEqual({});
        });
      });

      describe("Disable validation onSubmit event", () => {
        it("should not update errorSchema when the formData changes", () => {
          const { comp, node } = createFormComponent({
            schema,
            noValidate: true
          });

          Simulate.change(node.querySelector("input[type=text]"), {
            target: { value: "short" }
          });
          Simulate.submit(node);

          expect(comp.state.errorSchema).toEqual({});
        });
      });
    });

    describe("on form submitted", () => {
      const schema = {
        type: "string",
        minLength: 8
      };

      it("should update the errorSchema on form submission", () => {
        const { comp, node } = createFormComponent({
          schema,
          onError: () => {}
        });

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "short" }
        });
        Simulate.submit(node);

        expect(comp.state.errorSchema).toEqual({
          __errors: ["should NOT be shorter than 8 characters"]
        });
      });

      it("should call the onError handler", () => {
        const onError = jest.fn();
        const { node } = createFormComponent({ schema, onError });

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "short" }
        });
        Simulate.submit(node);

        expect(onError).toHaveBeenCalledWith([
          expect.objectContaining({
            message: "should NOT be shorter than 8 characters"
          })
        ]);
      });

      it("should reset errors and errorSchema state to initial state after correction and resubmission", () => {
        const onError = jest.fn();
        const { comp, node } = createFormComponent({
          schema,
          onError
        });

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "short" }
        });
        Simulate.submit(node);

        expect(comp.state.errorSchema).toEqual({
          __errors: ["should NOT be shorter than 8 characters"]
        });
        expect(comp.state.errors.length).toEqual(1);
        expect(onError).toHaveBeenCalledTimes(1);

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "long enough" }
        });
        Simulate.submit(node);

        expect(comp.state.errorSchema).toEqual({});
        expect(comp.state.errors).toEqual([]);
        expect(onError).toHaveBeenCalledTimes(1);
      });
    });

    describe("root level", () => {
      const formProps = {
        liveValidate: true,
        schema: {
          type: "string",
          minLength: 8
        },
        formData: "short"
      };

      it("should reflect the contextualized error in state", () => {
        const { comp } = createFormComponent(formProps);

        expect(comp.state.errorSchema).toEqual({
          __errors: ["should NOT be shorter than 8 characters"]
        });
      });

      it("should denote the error in the field", () => {
        const { node } = createFormComponent(formProps);

        expect(node.querySelectorAll(".field-error")).toHaveLength(1);
        expect(
          node.querySelector(".field-string .error-detail").textContent
        ).toEqual("should NOT be shorter than 8 characters");
      });
    });

    describe("root level with multiple errors", () => {
      const formProps = {
        liveValidate: true,
        schema: {
          type: "string",
          minLength: 8,
          pattern: "d+"
        },
        formData: "short"
      };

      it("should reflect the contextualized error in state", () => {
        const { comp } = createFormComponent(formProps);
        expect(comp.state.errorSchema).toEqual({
          __errors: [
            "should NOT be shorter than 8 characters",
            'should match pattern "d+"'
          ]
        });
      });

      it("should denote the error in the field", () => {
        const { node } = createFormComponent(formProps);

        const liNodes = node.querySelectorAll(".field-string .error-detail li");
        const errors = [].map.call(liNodes, li => li.textContent);

        expect(errors).toEqual([
          "should NOT be shorter than 8 characters",
          'should match pattern "d+"'
        ]);
      });
    });

    describe("nested field level", () => {
      const schema = {
        type: "object",
        properties: {
          level1: {
            type: "object",
            properties: {
              level2: {
                type: "string",
                minLength: 8
              }
            }
          }
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: {
          level1: {
            level2: "short"
          }
        }
      };

      it("should reflect the contextualized error in state", () => {
        const { comp } = createFormComponent(formProps);

        expect(comp.state.errorSchema).toEqual({
          level1: {
            level2: {
              __errors: ["should NOT be shorter than 8 characters"]
            }
          }
        });
      });

      it("should denote the error in the field", () => {
        const { node } = createFormComponent(formProps);
        const errorDetail = node.querySelector(
          ".field-object .field-string .error-detail"
        );

        expect(node.querySelectorAll(".field-error")).toHaveLength(1);
        expect(errorDetail.textContent).toEqual(
          "should NOT be shorter than 8 characters"
        );
      });
    });

    describe("array indices", () => {
      const schema = {
        type: "array",
        items: {
          type: "string",
          minLength: 4
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: ["good", "bad", "good"]
      };

      it("should contextualize the error for array indices", () => {
        const { comp } = createFormComponent(formProps);

        expect(comp.state.errorSchema).toEqual({
          1: {
            __errors: ["should NOT be shorter than 4 characters"]
          }
        });
      });

      it("should denote the error in the item field in error", () => {
        const { node } = createFormComponent(formProps);
        const fieldNodes = node.querySelectorAll(".field-string");

        const liNodes = fieldNodes[1].querySelectorAll(
          ".field-string .error-detail li"
        );
        const errors = [].map.call(liNodes, li => li.textContent);

        expect(fieldNodes[1].classList.contains("field-error")).toEqual(true);
        expect(errors).toEqual(["should NOT be shorter than 4 characters"]);
      });

      it("should not denote errors on non impacted fields", () => {
        const { node } = createFormComponent(formProps);
        const fieldNodes = node.querySelectorAll(".field-string");

        expect(fieldNodes[0].classList.contains("field-error")).toEqual(false);
        expect(fieldNodes[2].classList.contains("field-error")).toEqual(false);
      });
    });

    describe("nested array indices", () => {
      const schema = {
        type: "object",
        properties: {
          level1: {
            type: "array",
            items: {
              type: "string",
              minLength: 4
            }
          }
        }
      };

      const formProps = { schema, liveValidate: true };

      it("should contextualize the error for nested array indices", () => {
        const { comp } = createFormComponent({
          ...formProps,
          formData: {
            level1: ["good", "bad", "good", "bad"]
          }
        });

        expect(comp.state.errorSchema).toEqual({
          level1: {
            1: {
              __errors: ["should NOT be shorter than 4 characters"]
            },
            3: {
              __errors: ["should NOT be shorter than 4 characters"]
            }
          }
        });
      });

      it("should denote the error in the nested item field in error", () => {
        const { node } = createFormComponent({
          ...formProps,
          formData: {
            level1: ["good", "bad", "good"]
          }
        });

        const liNodes = node.querySelectorAll(".field-string .error-detail li");
        const errors = [].map.call(liNodes, li => li.textContent);

        expect(errors).toEqual(["should NOT be shorter than 4 characters"]);
      });
    });

    describe("nested arrays", () => {
      const schema = {
        type: "object",
        properties: {
          outer: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "string",
                minLength: 4
              }
            }
          }
        }
      };

      const formData = {
        outer: [["good", "bad"], ["bad", "good"]]
      };

      const formProps = { schema, formData, liveValidate: true };

      it("should contextualize the error for nested array indices", () => {
        const { comp } = createFormComponent(formProps);

        expect(comp.state.errorSchema).toEqual({
          outer: {
            0: {
              1: {
                __errors: ["should NOT be shorter than 4 characters"]
              }
            },
            1: {
              0: {
                __errors: ["should NOT be shorter than 4 characters"]
              }
            }
          }
        });
      });

      it("should denote the error in the nested item field in error", () => {
        const { node } = createFormComponent(formProps);
        const fields = node.querySelectorAll(".field-string");
        const errors = [].map.call(fields, field => {
          const li = field.querySelector(".error-detail li");
          return li && li.textContent;
        });

        expect(errors).toEqual([
          null,
          "should NOT be shorter than 4 characters",
          "should NOT be shorter than 4 characters",
          null
        ]);
      });
    });

    describe("array nested items", () => {
      const schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            foo: {
              type: "string",
              minLength: 4
            }
          }
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: [{ foo: "good" }, { foo: "bad" }, { foo: "good" }]
      };

      it("should contextualize the error for array nested items", () => {
        const { comp } = createFormComponent(formProps);

        expect(comp.state.errorSchema).toEqual({
          1: {
            foo: {
              __errors: ["should NOT be shorter than 4 characters"]
            }
          }
        });
      });

      it("should denote the error in the array nested item", () => {
        const { node } = createFormComponent(formProps);
        const fieldNodes = node.querySelectorAll(".field-string");

        const liNodes = fieldNodes[1].querySelectorAll(
          ".field-string .error-detail li"
        );
        const errors = [].map.call(liNodes, li => li.textContent);

        expect(fieldNodes[1].classList.contains("field-error")).toEqual(true);
        expect(errors).toEqual(["should NOT be shorter than 4 characters"]);
      });
    });

    describe("schema dependencies", () => {
      const schema = {
        type: "object",
        properties: {
          branch: {
            type: "number",
            enum: [1, 2, 3],
            default: 1
          }
        },
        required: ["branch"],
        dependencies: {
          branch: {
            oneOf: [
              {
                properties: {
                  branch: {
                    enum: [1]
                  },
                  field1: {
                    type: "number"
                  }
                },
                required: ["field1"]
              },
              {
                properties: {
                  branch: {
                    enum: [2]
                  },
                  field1: {
                    type: "number"
                  },
                  field2: {
                    type: "number"
                  }
                },
                required: ["field1", "field2"]
              }
            ]
          }
        }
      };

      it("should only show error for property in selected branch", () => {
        const { comp, node } = createFormComponent({
          schema,
          liveValidate: true
        });

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "not a number" }
        });

        expect(comp.state.errorSchema).toEqual({
          field1: {
            __errors: ["should be number"]
          }
        });
      });

      it("should only show errors for properties in selected branch", () => {
        const { comp, node } = createFormComponent({
          schema,
          liveValidate: true,
          formData: { branch: 2 }
        });

        Simulate.change(node.querySelector("input[type=text]"), {
          target: { value: "not a number" }
        });

        expect(comp.state.errorSchema).toEqual({
          field1: {
            __errors: ["should be number"]
          },
          field2: {
            __errors: ["is a required property"]
          }
        });
      });

      it("should not show any errors when branch is empty", () => {
        suppressLogs('warn', () => {
          const { comp, node } = createFormComponent({
            schema,
            liveValidate: true,
            formData: { branch: 3 }
          });

          Simulate.change(node.querySelector("select"), {
            target: { value: 3 }
          });

          expect(comp.state.errorSchema).toEqual({});
        });
      });
    });
  });

  describe("Schema and formData updates", () => {
    // https://github.com/mozilla-services/react-jsonschema-form/issues/231
    const schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" }
      }
    };

    it("should replace state when formData have keys removed", () => {
      const formData = { foo: "foo", bar: "bar" };
      const { comp, node } = createFormComponent({ schema, formData });
      comp.componentWillReceiveProps({
        schema: {
          type: "object",
          properties: {
            bar: { type: "string" }
          }
        },
        formData: { bar: "bar" }
      });

      Simulate.change(node.querySelector("#root_bar"), {
        target: { value: "baz" }
      });

      expect(comp.state.formData).toEqual({ bar: "baz" });
    });

    it("should replace state when formData keys have changed", () => {
      const formData = { foo: "foo", bar: "bar" };
      const { comp, node } = createFormComponent({ schema, formData });
      comp.componentWillReceiveProps({
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
            baz: { type: "string" }
          }
        },
        formData: { foo: "foo", baz: "bar" }
      });

      Simulate.change(node.querySelector("#root_baz"), {
        target: { value: "baz" }
      });

      expect(comp.state.formData).toEqual({ foo: "foo", baz: "baz" });
    });
  });

  describe("idSchema updates based on formData", () => {
    const schema = {
      type: "object",
      properties: {
        a: { type: "string", enum: ["int", "bool"] }
      },
      dependencies: {
        a: {
          oneOf: [
            {
              properties: {
                a: { enum: ["int"] }
              }
            },
            {
              properties: {
                a: { enum: ["bool"] },
                b: { type: "boolean" }
              }
            }
          ]
        }
      }
    };

    it("should not update idSchema for a falsey value", () => {
      const formData = { a: "int" };
      const { comp } = createFormComponent({ schema, formData });
      comp.componentWillReceiveProps({
        schema: {
          type: "object",
          properties: {
            a: { type: "string", enum: ["int", "bool"] }
          },
          dependencies: {
            a: {
              oneOf: [
                {
                  properties: {
                    a: { enum: ["int"] }
                  }
                },
                {
                  properties: {
                    a: { enum: ["bool"] },
                    b: { type: "boolean" }
                  }
                }
              ]
            }
          }
        },
        formData: { a: "int" }
      });
      expect(comp.state.idSchema).toEqual({
        $id: "root",
        a: { $id: "root_a" }
      });
    });

    it("should update idSchema based on truthy value", () => {
      const formData = {
        a: "int"
      };
      const { comp } = createFormComponent({ schema, formData });
      comp.componentWillReceiveProps({
        schema: {
          type: "object",
          properties: {
            a: { type: "string", enum: ["int", "bool"] }
          },
          dependencies: {
            a: {
              oneOf: [
                {
                  properties: {
                    a: { enum: ["int"] }
                  }
                },
                {
                  properties: {
                    a: { enum: ["bool"] },
                    b: { type: "boolean" }
                  }
                }
              ]
            }
          }
        },
        formData: { a: "bool" }
      });
      expect(comp.state.idSchema).toEqual({
        $id: "root",
        a: { $id: "root_a" },
        b: { $id: "root_b" }
      });
    });
  });

  describe("Attributes", () => {
    const formProps = {
      schema: {},
      id: "test-form",
      className: "test-class other-class",
      name: "testName",
      method: "post",
      target: "_blank",
      action: "/users/list",
      autocomplete: "off",
      enctype: "multipart/form-data",
      acceptcharset: "ISO-8859-1",
      noHtml5Validate: true
    };

    let node;

    beforeEach(() => {
      node = createFormComponent(formProps).node;
    });

    it("should set attr id of form", () => {
      expect(node.getAttribute("id")).toEqual(formProps.id);
    });

    it("should set attr class of form", () => {
      expect(node.getAttribute("class")).toEqual(formProps.className);
    });

    it("should set attr name of form", () => {
      expect(node.getAttribute("name")).toEqual(formProps.name);
    });

    it("should set attr method of form", () => {
      expect(node.getAttribute("method")).toEqual(formProps.method);
    });

    it("should set attr target of form", () => {
      expect(node.getAttribute("target")).toEqual(formProps.target);
    });

    it("should set attr action of form", () => {
      expect(node.getAttribute("action")).toEqual(formProps.action);
    });

    it("should set attr autoComplete of form", () => {
      expect(node.getAttribute("autocomplete")).toEqual(formProps.autocomplete);
    });

    it("should set attr enctype of form", () => {
      expect(node.getAttribute("enctype")).toEqual(formProps.enctype);
    });

    it("should set attr acceptcharset of form", () => {
      expect(node.getAttribute("accept-charset")).toEqual(
        formProps.acceptcharset
      );
    });

    it("should set attr novalidate of form", () => {
      expect(node.getAttribute("novalidate")).not.toBeNull();
    });
  });
});
