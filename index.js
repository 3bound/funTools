/**
 * Small functional utilities focused on the DOM
 *
 */

'use strict';

// Imports
const Result = require('folktale/result');
const R = require('ramda');


// Curried Result.fromNullable
const resultFromNullable = R.curry(Result.fromNullable);


/**
 * Safe JSON.parse
 *
 * string -> Result object
 */
const safeJSONParse = str => {
  try {
    const json = JSON.parse(str);
    return Result.Ok(json);
  } catch(e) {
    return Result.Error(e);
  }
}


/**
 * Get elements by class name
 *
 * string -> HTMLCollection
 */
const myGetElementsByClassName = className => document.getElementsByClassName(className);


/**
 * Get a child element by class name
 *
 * string -> Node -> Node
 */
const getChildElementByClassName = className => node => node.getElementsByClassName(className)[0];


/**
 * Get child elements by class name
 *
 * string -> Node -> HTMLCollection
 */
const getChildElementsByClassName = className => node => node.getElementsByClassName(className);


/**
 * Get the closest parent by class name
 *
 * string -> Node -> Node
 */
const getClosestParentByClassName = className => node => node.closest('.' + className);


/**
 * Get an event target
 *
 * Event -> Node
 */
const getEventTarget = e => R.prop('target')(e);


/*
 * Set a stylesheet property
 *
 * string -> string -> Node -> side effect
 */
const setStyle = propertyName => propertyValue => node => node.style[propertyName] = propertyValue;


/**
 * Does the node have the given attribute?
 *
 * string -> Node -> bool
 */
const hasAttribute = attributeName => node => node.hasAttribute(attributeName);


/**
 * Get an attrjbute value
 *
 * string -> Node -> string
 */
const getAttribute = attributeName => node => node.getAttribute(attributeName);


/**
 * Set an attribute value
 *
 * string -> string -> Node -> side effect
 */
const setAttribute = attributeName => attributeValue => node => node.setAttribute(attributeName, attributeValue);


/**
 * Safe getAttribute
 *
 * string -> Node -> Result string
 */
const safeGetAttribute = attributeName => node => R.ifElse(
  hasAttribute(attributeName)
  , node => Result.Ok(getAttribute(attributeName)(node))
  , R.always(Result.Error("Failed to find the attribute " + attributeName + "."))
)(node);


/**
 * Attach an event listener
 *
 * string -> function -> Node -> side effect
 */
const attachListener = eventName => fn => node => node.addEventListener(eventName, fn);


/**
 * Safely get an element by class name
 *
 * string -> Result Node
 */
const safeGetElementByClassName = className => R.compose(
  resultFromNullable(R.__, "Error: Failed to find an element with the class '" + className + "'."),
  className => document.getElementsByClassName(className)[0],
)(className);


/**
 * Safely get a child element by class name
 *
 * string -> Node -> Result Node
 */
const safeGetChildElementByClassName = className => node => R.compose(
  resultFromNullable(R.__, "Error: Failed to find an element with the class '" + className + "'."),
  getChildElementByClassName(className),
)(node);


/**
 * Safely get the first element in a collection with an attribute that matches a given value
 *
 * string -> string -> HTMLCollection -> Result Node
 */
const safeGetElementByAttribute = R.curry((attribute, value, elements) => R.compose(
  resultFromNullable(R.__, "Error: Failed to find an element with the attribute '" + attribute + "' and value '" + value + "'."),
  R.find(element => element.getAttribute(attribute) === value)
)(elements));


/**
 * Get child element with an attribute that matches a given value
 *
 * string -> string -> Node -> Node
 */
const getElementByAttributeValue = name => value => node => node.querySelector("[" + name + "='" + value + "']");


/**
 * Safely get a child element with an attribute that matches a given value
 *
 * string -> string -> Node -> Result Node
 */
const safeGetElementByAttributeValue = name => value => node => Result.fromNullable(getElementByAttributeValue(name)(value)(node), "Failed to find an element with the attribute '" + name + "' and value '" + value + "'");


/**
 * Transform an object whose values are Applicatives into an Applicative of an
 * object while retaining object key names
 *
 * Applicative f => (a -> f a) -> object(f a) -> f object(a)
 */
const sequenceObj = R.curry((applicativeOf, obj) => {
  const sequenceObjValues = R.compose(R.sequence(applicativeOf), R.values);
  const restoreKeys = (obj, sequence) => R.map(R.zipObj(R.keys(obj)), sequence);
  return restoreKeys(obj, sequenceObjValues(obj));
});


/**
 * Sequence an object whose values are the Result type
 *
 * object(Result a) -> Result object(a)
 */
const sequenceResultObj = obj => sequenceObj(Result.of)(obj);


module.exports = {
  resultFromNullable
  , safeJSONParse
  , safeGetElementByClassName
  , safeGetElementByAttribute
  , safeGetChildElementByClassName
  , sequenceObj
  , sequenceResultObj
  , myGetElementsByClassName
  , getChildElementsByClassName
  , getClosestParentByClassName
  , getEventTarget
  , attachListener
  , setStyle
  , getAttribute
  , setAttribute
  , hasAttribute
  , safeGetAttribute
  , safeGetElementByAttributeValue
};
