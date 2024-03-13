export const script_1 = {
  id: 1,
  nodes: [
    {
      id: '1',
      position: { x: 0, y: 0 },
      type: 'startNode',
      data: {},
    },
    {
      id: '2',
      position: { x: 100, y: 0 },
      type: 'openURLNode',
      data: {
        url: 'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
      },
    },
    {
      id: '3',
      position: { x: 250, y: 0 },
      type: 'stopNode',
      data: {},
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success' },
    { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success' },
  ],
};

export const script_2 = {
  id: 1,
  nodes: [
    {
      id: '1',
      position: { x: 0, y: 0 },
      type: 'startNode',
      data: {},
    },
    {
      id: '2',
      position: { x: 100, y: 0 },
      type: 'openURLNode',
      data: {
        url: 'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
      },
    },
    {
      id: '3',
      position: { x: 250, y: 0 },
      type: 'clickNode',
      data: {
        selector: [
          {
            type: 'paragraph',
            children: [
              {
                character: 'xpath',
                prefix: '@',
                type: 'mention',
                subType: 'selector',
                children: [{ text: '' }],
              },
              {
                text: '(//',
              },
              {
                character: 'a',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'div',
                prefix: '',
                type: 'mention',
                subType: 'attribute',
                children: [{ text: '' }],
              },
              {
                text: '//',
              },
              {
                character: 'div',
                prefix: '',
                type: 'mention',
                subType: 'attribute',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'contains',
                prefix: '',
                type: 'mention',
                subType: 'func',
                children: [{ text: '' }],
              },
              {
                text: '(',
              },
              {
                character: 'text',
                prefix: '',
                type: 'mention',
                subType: 'self_func',
                children: [{ text: '' }],
              },
              {
                text: '(), "TopCV")]])[1]',
              },
            ],
          },
        ],
      },
    },
    {
      id: '4',
      position: { x: 350, y: 0 },
      type: 'stopNode',
      data: {},
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success' },
    { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success' },
    { id: 'e3-4', source: '3', target: '4', sourceHandle: 'success' },
  ],
};

export const script_3 = {
  id: 1,
  nodes: [
    {
      id: '1',
      position: { x: 0, y: 0 },
      type: 'startNode',
      data: {},
    },
    {
      id: '2',
      position: { x: 100, y: 0 },
      type: 'openURLNode',
      data: {
        url: 'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
      },
    },
    {
      id: '3',
      position: { x: 250, y: 0 },
      type: 'clickNode',
      data: {
        selector: [
          {
            type: 'paragraph',
            children: [
              {
                character: 'xpath',
                prefix: '@',
                type: 'mention',
                subType: 'selector',
                children: [{ text: '' }],
              },
              {
                text: '(//',
              },
              {
                character: 'a',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'div',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '//',
              },
              {
                character: 'div',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'contains',
                prefix: '',
                type: 'mention',
                subType: 'func',
                children: [{ text: '' }],
              },
              {
                text: '(',
              },
              {
                character: 'text',
                prefix: '',
                type: 'mention',
                subType: 'self_func',
                children: [{ text: '' }],
              },
              {
                text: '(), "TopCV")]])[1]',
              },
            ],
          },
        ],
      },
    },
    {
      id: '4',
      position: { x: 350, y: 0 },
      type: 'clickNode',
      data: {
        selector: [
          {
            type: 'paragraph',
            children: [
              {
                character: 'xpath',
                prefix: '@',
                type: 'mention',
                subType: 'selector',
                children: [{ text: '' }],
              },
              {
                text: '(//',
              },
              {
                character: 'div',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'role',
                prefix: '@',
                type: 'mention',
                subType: 'attribute',
                children: [{ text: '' }],
              },
              {
                text: '="dialog"]//',
              },
              {
                character: 'button',
                prefix: '',
                type: 'mention',
                subType: 'tag',
                children: [{ text: '' }],
              },
              {
                text: '[',
              },
              {
                character: 'aria-label',
                prefix: '@',
                type: 'mention',
                subType: 'attribute',
                children: [{ text: '' }],
              },
              {
                text: '="Close"])[2]',
              },
            ],
          },
        ],
      },
    },
    {
      id: '5',
      position: { x: 450, y: 0 },
      type: 'stopNode',
      data: {},
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success' },
    { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success' },
    { id: 'e3-4', source: '3', target: '4', sourceHandle: 'success' },
    { id: 'e4-5', source: '4', target: '5', sourceHandle: 'success' },
  ],
};
