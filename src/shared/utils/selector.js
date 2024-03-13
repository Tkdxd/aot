import { SELECTORS } from '../constants/constants';
import { Node } from 'slate';

export const genSelector = (selector) => {
  selector = selector.reduce((res, se) => {
    if (se.children) {
      res += se.children.reduce((r, s) => {
        if (s?.text) {
          r += s.text;
        } else {
          r += `${s.prefix}${s.character} `;
        }
        return r;
      }, '');
      return res;
    }
  }, '');
  const selectors = SELECTORS.map((s) => `@${s.toLowerCase()}`);
  const selectorRegExp = `/${selectors.join('|')}/g`;

  let mappedSelector = [];
  let length = 1;
  while (selector) {
    const subSelector = selector.substr(0, length);
    if (selectors.includes(subSelector)) {
      mappedSelector = [...mappedSelector, subSelector];
      selector = selector.slice(length);
    }
    if (subSelector.match(selectorRegExp)) {
      const index = subSelector.search(selectorRegExp);
      if (index !== -1) {
        mappedSelector = [
          ...mappedSelector,
          selector.slice(index),
          selector.substr(index, length),
        ];
        selector = selector.slice(length);
      }
    }
    if (selector === subSelector) {
      mappedSelector = [...mappedSelector, subSelector];
      selector = selector.slice(length);
    }
    length += 1;
  }
  let selectorType = null;
  return mappedSelector
    .reduce((res, value) => {
      value = value.trim();
      if (selectors.includes(value)) selectorType = value;
      else res = [...res, mapSelector(selectorType, value)];

      return res;
    }, [])
    .join(' ');
};

export const mapSelector = (type = '@css', value) => {
  switch (type) {
    case '@xpath':
      return `::-p-xpath(${value})`;
    case '@css':
      return value;
    case '@text':
      return `::-p-text(${value})`;
  }
};

export const serialize = (value) => {
  return value.reduce((res, n) => {
    if (n.children?.length) {
      res += n.children
        .map((child) => {
          if (child.type === 'mention') {
            return `${child.prefix}${child.character}`;
          }
          return Node.string(child);
        })
        .join('');
    }
    return res;
  }, '');
};
