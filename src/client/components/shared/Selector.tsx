import { Form } from 'antd';
import {
  ATTRIBUTES,
  FUNCS,
  SELECTORS,
  SELF_FUNCS,
  TAGS,
} from '../../../shared/constants/constants';
// Import the Slate editor factory.
import { BaseRange, Editor, Transforms, createEditor, Range } from 'slate';

// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  useSelected,
  useFocused,
  ReactEditor,
} from 'slate-react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MentionElement } from './custom-types';
import ReactDOM from 'react-dom';
import { withHistory } from 'slate-history';

// const selectorOptions = SELECTORS.map((selector) => {
//   return {
//     label: selector,
//     value: selector.toLowerCase(),
//   };
// });

const selectors = SELECTORS.map((s) => s.toLowerCase());
const tags = TAGS.map((s) => s.toLowerCase());
const attributes = ATTRIBUTES.map((s) => s.toLowerCase());
const funcs = FUNCS.map((s) => s.toLowerCase());
const selfFuncs = SELF_FUNCS.map((s) => s.toLowerCase());

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const colorMapping = {
    selector: '#ff85c0',
    tag: '#85a5ff',
    attribute: '#b37feb',
    func: '#5cdbd3',
    self_func: '#95de64',
  };
  const style: React.CSSProperties = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    color: colorMapping[element.subType],
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  };
  return (
    <>
      <span {...attributes} contentEditable={false} style={style}>
        {element.prefix}
        {element.character}
        {children}
      </span>
    </>
  );
};

const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const withMentions = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === 'mention' || markableVoid(element);
  };

  return editor;
};

const insertMention = (
  editor,
  character,
  subType,
  beforeText,
  afterText,
  prefix = '',
) => {
  const mention: MentionElement = {
    type: 'mention',
    character,
    children: [{ text: '' }],
    prefix,
    subType,
  };
  if (subType !== 'selector')
    Transforms.move(editor, { distance: 1, unit: 'offset' });
  if (
    !['selector', 'func', 'attribute', 'self_func'].includes(subType) &&
    beforeText
  ) {
    Transforms.insertText(editor, beforeText);
  }
  if (['func', 'attribute', 'self_func'].includes(subType)) {
    Transforms.insertText(editor, beforeText[0]);
  }

  if (subType === 'selector') {
    Transforms.insertText(editor, beforeText.slice(0, -1));
  }

  Transforms.insertNodes(editor, mention);
  Transforms.move(editor, { distance: 1, unit: 'offset' });
  if (subType === 'func') {
    Transforms.insertText(editor, '()');
    Transforms.move(editor, {
      distance: 1,
      unit: 'offset',
      reverse: true,
    });
  }
  if (subType === 'self_func') {
    Transforms.insertText(editor, '()');
  }
  if (!['func', 'self_func'].includes(subType) && afterText) {
    Transforms.insertText(editor, afterText);
    Transforms.move(editor, {
      distance: 1,
      unit: 'offset',
      reverse: true,
    });
  }
  if (subType === 'attribute') {
    Transforms.insertText(editor, `=""`);
    Transforms.move(editor, {
      distance: 1,
      unit: 'offset',
      reverse: true,
    });
  }
  if (subType === 'selector') Transforms.insertText(editor, ' ');
};

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

function Selector({ value = null, onChangeSetting }) {
  const ref = useRef<HTMLDivElement | null>();
  const [target, setTarget] = useState<BaseRange | undefined>();
  const [portal, setPortal] = useState([]);
  const [targetType, setTargetType] = useState('');
  const [index, setIndex] = useState(0);
  // const [search, setSearch] = useState('');
  const renderElement = useCallback((props) => <Element {...props} />, []);

  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    [],
  );
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];

  const prefix = useMemo(
    () => (['selector', 'attribute'].includes(targetType) ? '@' : ''),
    [targetType],
  );

  const beforeText = useMemo(() => {
    const { selection } = editor;
    if (selection) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start, {
        unit: 'word',
      });
      const beforeRange = before && Editor.range(editor, before, start);
      return beforeRange && Editor.string(editor, beforeRange);
    }
    return null;
  }, [editor.selection]);

  const afterText = useMemo(() => {
    const { selection } = editor;
    if (selection) {
      const [end] = Range.edges(selection);
      const after = Editor.after(editor, end, {
        unit: 'offset',
      });
      const afterRange = after && Editor.range(editor, after, end);
      return afterRange && Editor.string(editor, afterRange);
    }
    return null;
  }, [editor.selection]);

  const onChange = useCallback(() => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start, {
        unit: 'word',
      });
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      switch (true) {
        case /\[@|\(@$/.test(beforeText):
          setTarget(beforeRange);
          setPortal(attributes);
          setTargetType('attribute');
          setIndex(0);
          break;
        case /@$/.test(beforeText):
          setTarget(beforeRange);
          setPortal(selectors);
          setTargetType('selector');
          setIndex(0);
          break;
        case /(\[\()$/.test(beforeText):
          setTarget(beforeRange);
          setPortal(funcs);
          setTargetType('func');
          setIndex(0);
          break;
        case /(\(\()$/.test(beforeText):
          setTarget(beforeRange);
          setPortal(selfFuncs);
          setTargetType('self_func');
          setIndex(0);
          break;
        case /\s|\/|\[$/.test(beforeText):
          setTarget(beforeRange);
          setPortal(tags);
          setTargetType('tag');
          setIndex(0);
          break;

        default:
          break;
      }

      // switch (event.key) {
      //   case '{':
      //     event.preventDefault();
      //     editor.insertText('{}');
      //     Transforms.move(editor, {
      //       distance: 1,
      //       unit: 'offset',
      //       reverse: true,
      //     });
      //     break;
      //   case '(':
      //     event.preventDefault();
      //     editor.insertText('()');
      //     Transforms.move(editor, {
      //       distance: 1,
      //       unit: 'offset',
      //       reverse: true,
      //     });
      //     break;
      //   case '[':
      //     event.preventDefault();
      //     editor.insertText('[]');
      //     Transforms.move(editor, {
      //       distance: 1,
      //       unit: 'offset',
      //       reverse: true,
      //     });
      //     break;
      //   default:
      //     break;
      // }

      // if (targetSelector || targetTag) {
      //   switch (event.key) {
      //     case 'ArrowDown':
      //       event.preventDefault();
      //       const prevIndex = index >= selectors.length - 1 ? 0 : index + 1;
      //       setIndex(prevIndex);
      //       break;
      //     case 'ArrowUp':
      //       event.preventDefault();
      //       const nextIndex = index <= 0 ? selectors.length - 1 : index - 1;
      //       setIndex(nextIndex);
      //       break;
      //     case 'Tab':
      //     case 'Enter':
      //       event.preventDefault();
      //       Transforms.select(editor, targetSelector || targetTag);
      //       insertMention(
      //         editor,
      //         !!targetSelector ? selectors[index] : tags[index],
      //         !!targetSelector,
      //       );
      //       setTargetSelector(null);
      //       setTargetTag(null);
      //       break;
      //     case 'Escape':
      //       event.preventDefault();
      //       setTargetSelector(null);
      //       break;
      //     default:
      //       break;
      //   }
      // }
      // const isAstChange = editor.operations.some(
      //   (op) => 'set_selection' !== op.type,
      // );
      // if (isAstChange) {
      //   onChangeSetting('selector', value);
      // }
    }
  }, [selectors, editor, index, target]);

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case '{':
          event.preventDefault();
          editor.insertText('{}');
          Transforms.move(editor, {
            distance: 1,
            unit: 'offset',
            reverse: true,
          });
          break;
        case '(':
          event.preventDefault();
          editor.insertText('()');
          Transforms.move(editor, {
            distance: 1,
            unit: 'offset',
            reverse: true,
          });
          break;
        case '[':
          event.preventDefault();
          editor.insertText('[]');
          Transforms.move(editor, {
            distance: 1,
            unit: 'offset',
            reverse: true,
          });
          break;
        case '"':
          event.preventDefault();
          editor.insertText('""');
          Transforms.move(editor, {
            distance: 1,
            unit: 'offset',
            reverse: true,
          });
          break;
        default:
          break;
      }
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= portal.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? portal.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(
              editor,
              portal[index],
              targetType,
              beforeText,
              afterText,
              prefix,
            );
            setTarget(null);
            null;
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(null);
            break;
          default:
            break;
        }
      }
    },
    [selectors, editor, index, target],
  );

  useEffect(() => {
    if (target) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [selectors.length, editor, index, target]);

  useEffect(() => {
    // console.log(editor.children);
  }, [editor.children]);

  return (
    <Form.Item hasFeedback name="selector" label="Selector">
      <Slate
        editor={editor}
        initialValue={value?.length ? value : initialValue}
        // onChange={(value) => {
        //   const isAstChange = editor.operations.some(
        //     (op) => 'set_selection' !== op.type,
        //   );
        //   if (isAstChange) {
        //     onChangeSetting('selector', value);
        //   }
        // }}
        onChange={onChange}
      >
        <Editable
          renderElement={renderElement}
          disableDefaultStyles
          className="px-3 py-2 max-h-40 border border-gray-300 rounded hover:border-blue-400 active:border-blue-400 focus:border-blue-400 outline-none overflow-y-auto"
          onKeyDown={onKeyDown}
          onBlur={() => onChangeSetting('selector', editor.children)}
        />
        {target && (
          <Portal>
            <div
              ref={ref}
              style={{
                top: '-9999px',
                left: '-9999px',
                position: 'absolute',
                zIndex: 1,
                padding: '3px',
                background: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
              }}
            >
              {portal.map((char, i) => (
                <div
                  key={char}
                  onClick={() => {
                    Transforms.select(editor, target);
                    insertMention(
                      editor,
                      char,
                      targetType,
                      beforeText,
                      afterText,
                      prefix,
                    );
                    setTarget(null);
                  }}
                  style={{
                    padding: '1px 3px',
                    borderRadius: '3px',
                    background: i === index ? '#B4D5FF' : 'transparent',
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
    </Form.Item>
  );
}

// const CHARACTERS = ['xpath', 'css', 'text'];

export default Selector;
