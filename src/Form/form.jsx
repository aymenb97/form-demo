import React, { useState, useRef } from "react";
import { Formik, Field, Form } from "formik";
import { responseMock } from "../responseMock";
import { useEffect } from "react";

export default function DemoForm() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const formRef = useRef();
  useEffect(() => {
    setItems(responseMock);
    let catgs = [];
    responseMock
      .filter((el) => el.parent_id !== null)
      .map((el) => {
        catgs.push({
          categoryId: el.category.id,
          categoryName: el.category.name,
        });
      });

    const uniqueCats = Array.from(new Set(catgs.map((a) => a.categoryId))).map(
      (id) => {
        return catgs.find((a) => a.categoryId === id);
      }
    );

    setCategories(uniqueCats);
  }, []);
  function applyToAllItems() {
    const values = { ...formRef.current.values };
    values.applicable_items = responseMock.map((el) => {
      return el.id;
    });
    values.applied_to = "all";
    values.categories = Array.from(
      new Set(
        responseMock.map((el) => {
          return el.parent_id;
        })
      )
    );
    formRef.current.setValues(values);
  }

  function toggleItem(id, catId) {
    const items = [...formRef.current.values.applicable_items];
    const values = { ...formRef.current.values };
    console.log();
    if (items.includes(id)) {
      items.splice(items.indexOf(id), 1);
      if (values.categories.indexOf(catId) != -1)
        values.categories.splice(values.categories.indexOf(catId), 1);
    } else {
      items.push(id);
      console.log(items);
      const itemsCat = responseMock
        .filter((el) => {
          return el.parent_id === catId;
        })
        .map((el) => {
          return el.id;
        });
      if (itemsCat.every((elem) => items.includes(elem))) {
        values.categories.push(catId);
      }
    }
    values.applicable_items = Array.from(new Set(items));
    values.applied_to = "some";
    formRef.current.setValues(values);
  }

  function applyToCategory(event, categoryId) {
    const itemsCat = responseMock
      .filter((el) => {
        return el.parent_id === categoryId;
      })
      .map((el) => {
        return el.id;
      });
    const oldItems = [...formRef.current.values.applicable_items];
    itemsCat.map((el) => {
      if (oldItems.indexOf(el) !== -1) {
        oldItems.splice(oldItems.indexOf(el), 1);
      }
    });
    const items = event.target.checked
      ? responseMock
          .filter((el) => {
            return el.parent_id === categoryId;
          })
          .map((el) => {
            return el.id;
          })
          .concat([...formRef.current.values.applicable_items])
      : oldItems;
    const categories = formRef.current.values.categories
      ? [...formRef.current.values.categories]
      : [];
    event.target.checked
      ? categories.push(categoryId)
      : categories.splice(items.indexOf(categoryId), 1);
    const values = { ...formRef.current.values };
    values.applicable_items = Array.from(new Set(items));
    values.applied_to = "some";
    values.categories = categories;
    formRef.current.setValues(values);
  }

  return (
    <div>
      <h3>Add Tax</h3>
      <Formik
        initialValues={{
          name: "",
          rate: "",
          applied_to: "",
          applicable_items: [],
          categories: [],
        }}
        innerRef={formRef}
        onSubmit={(values) => {
          const valuesCopy = { ...values };
          valuesCopy.rate = parseInt(valuesCopy.rate) / 100;
          delete valuesCopy.categories;
          alert(JSON.stringify(valuesCopy, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <div className="row">
              <div className="col-md-8">
                <Field
                  className="w-100 justify-content-start"
                  id="name"
                  name="name"
                />
              </div>

              <div className="col-md-4">
                <Field className="w-50" id="rate" name="rate" />
              </div>
            </div>
            <div role="group" className="pt-4" aria-labelledby="my-radio-group">
              <div className="row">
                <label className="d-flex justify-content-start align-items-center">
                  <Field
                    onChange={applyToAllItems}
                    type="radio"
                    name="applied_to"
                    value="all"
                  />
                  Apply to all items in collection
                </label>
              </div>
              <div className="row">
                <label className="d-flex justify-content-start align-items-center">
                  <Field
                    className=""
                    type="radio"
                    name="applied_to"
                    value="some"
                  />
                  Apply to specific items
                </label>
              </div>
            </div>
            <hr></hr>
            {categories.map((el) => {
              return (
                <div key={el.categoryId}>
                  <div
                    role="group"
                    className="row bg-light p-2 row col-sm"
                    aria-labelledby="checkbox-group"
                  >
                    <label className="d-flex justify-content-start align-items-center">
                      <Field
                        type="checkbox"
                        name="categories"
                        value={el.categoryId}
                        onChange={(e, catId) =>
                          applyToCategory(e, el.categoryId)
                        }
                        className=" "
                      />
                      {el.categoryName}
                    </label>
                  </div>
                  <div
                    role="group"
                    className="row p-4"
                    aria-labelledby="checkbox-group"
                  >
                    {items.map((product) => {
                      return product.parent_id === el.categoryId ? (
                        <div className="row">
                          <label
                            key={product.id}
                            className="d-flex justify-content-start align-items-center"
                          >
                            <Field
                              onChange={(e) =>
                                toggleItem(product.id, el.categoryId)
                              }
                              type="checkbox"
                              className="m-2"
                              name="applicable_items"
                              value={product.id}
                              id={product.id}
                            />
                            {product.name}
                          </label>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
            <div>
              <div
                role="group"
                className="row bg-light p-2"
                aria-labelledby="checkbox-group"
              >
                <label>
                  <Field
                    type="checkbox"
                    name="categories"
                    value={null}
                    onChange={(e) => applyToCategory(e, null)}
                    className="d-flex justify-content-start align-items-center"
                  />
                </label>
              </div>
              <div
                role="group"
                className="row p-4"
                aria-labelledby="checkbox-group"
              >
                {items.map((product) => {
                  return product.parent_id === null ? (
                    <div className="row">
                      <label
                        key={product.id}
                        className="d-flex justify-content-start align-items-center"
                      >
                        <Field
                          onChange={(e) => toggleItem(product.id, null)}
                          type="checkbox"
                          className="m-2"
                          name="applicable_items"
                          id={product.id}
                          value={product.id}
                        />
                        {product.name}
                      </label>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <hr></hr>
            <div className="d-flex justify-content-end">
              <button className="btn btn-warning" type="submit">
                Apply Tax to{" "}
                {formRef.current
                  ? formRef.current.values.applicable_items.length + " "
                  : 0}
                item(s)
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
