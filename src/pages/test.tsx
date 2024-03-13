import { FC, useEffect, useRef, useState } from 'react';

import { debounce } from 'lodash';
import { io } from 'socket.io-client';
import React from 'react';
import { Carousel, Modal, Image, message } from 'antd';
import styles from '../client/styles/test.module.scss';
import FlowLayout from '../client/components/flow/FlowLayout';
import { script_2, script_3 } from '../shared/constants/test';

// const initialNodes: Node[] = [
//   {
//     id: '1',
//     position: { x: 0, y: 0 },
//     type: 'startNode',
//     data: {},
//   },
//   {
//     id: '2',
//     position: { x: 100, y: 150 },
//     type: 'openURLNode',
//     data: {
//       url: 'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
//     },
//   },
//   {
//     id: '3',
//     position: { x: 100, y: 200 },
//     type: 'clickNode',
//     data: {
//       selector: [
//         {
//           type: 'paragraph',
//           children: [
//             {
//               character: 'xpath',
//               prefix: '@',
//               type: 'mention',
//               subType: 'selector',
//               children: [{ text: '' }],
//             },
//             {
//               text: '(//',
//             },
//             {
//               character: 'a',
//               prefix: '',
//               type: 'mention',
//               subType: 'tag',
//               children: [{ text: '' }],
//             },
//             {
//               text: '[',
//             },
//             {
//               character: 'div',
//               prefix: '',
//               type: 'mention',
//               subType: 'attribute',
//               children: [{ text: '' }],
//             },
//             {
//               text: '//',
//             },
//             {
//               character: 'div',
//               prefix: '',
//               type: 'mention',
//               subType: 'attribute',
//               children: [{ text: '' }],
//             },
//             {
//               text: '[',
//             },
//             {
//               character: 'contains',
//               prefix: '',
//               type: 'mention',
//               subType: 'func',
//               children: [{ text: '' }],
//             },
//             {
//               text: '(',
//             },
//             {
//               character: 'text',
//               prefix: '',
//               type: 'mention',
//               subType: 'self_func',
//               children: [{ text: '' }],
//             },
//             {
//               text: '(), "TopCV")]])[1]',
//             },
//           ],
//         },
//       ],
//       // selector: '@xpath (//a[div//div[contains(text(), "TopCV")]])[1]',
//     },
//   },
//   // {
//   //   id: '4',
//   //   position: { x: 100, y: 200 },
//   //   type: 'clickNode',
//   //   data: {
//   //     selector:
//   //       '@xpath (//div[@role="dialog"]//button[@aria-label="Close"])[2]',
//   //   },
//   // },
//   // {
//   //   id: '5',
//   //   position: { x: 100, y: 200 },
//   //   type: 'scrollNode',
//   //   data: {
//   //     type: 'page',
//   //     distancePerIntervalTime: 100,
//   //     intervalTime: 0.4,
//   //     scrollContainerSelector:
//   //       '@xpath (//div[contains(@class, "ctn-list-jobs")])[1]',
//   //     option: 'bottom',
//   //     // selector: '@xpath (//a[contains(@class, "list-item")])[20]',
//   //     // selector: '@xpath (//div[contains(@class, "ctn-list-jobs")])[1]',
//   //   },
//   // },
//   // {
//   //   id: '6',
//   //   position: { x: 100, y: 200 },
//   //   type: 'clickNode',
//   //   data: {
//   //     selector:
//   //       '@xpath //div[@data-box="BoxSearchResult"]//a[@target="_blank"]',
//   //     randomClick: true,
//   //   },
//   // },
//   // {
//   //   id: '7',
//   //   position: { x: 100, y: 200 },
//   //   type: 'closeDialogNode',
//   //   data: {},
//   // },
// ];
// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success' },
//   { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success' },
//   { id: 'e3-4', source: '3', target: '4', sourceHandle: 'success' },
//   { id: 'e4-5', source: '4', target: '5', sourceHandle: 'success' },
//   { id: 'e5-6', source: '5', target: '6', sourceHandle: 'success' },
//   { id: 'e6-7', source: '6', target: '7', sourceHandle: 'success' },
// ];
const initialNodes = script_3.nodes;
const initialEdges = script_3.edges;

const Test: FC = () => {
  const [socket] = useState(io('http://localhost:80'));
  const [images, setImages] = useState([]);
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const carousel = useRef(null);

  const connectServer = debounce(() => {
    message.success('Connected server!');
  }, 500);

  const exportScript = (data) => {
    socket.emit('export_script', data);
  };

  useEffect(() => {
    socket.on('connect', () => {
      if (socket.connected) {
        connectServer();
      }
    });

    socket.on('receive_info', async (event) => {
      console.log('Message from server:', event.data);
      setImages((oldArray) => {
        if (!oldArray?.includes(event.data)) {
          return [...(oldArray || []), event.data];
        }
        return oldArray;
      });
      setModalDisplayed(true);
    });
  }, []);

  useEffect(() => {
    carousel?.current?.next();
  }, [images]);

  return (
    <div className="h-screen grid grid-cols-4">
      <FlowLayout
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        exportScript={exportScript}
        openModal={() => setModalDisplayed(true)}
      />

      <Modal
        width="90%"
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}
        open={modalDisplayed}
        onCancel={() => setModalDisplayed(false)}
      >
        <Carousel ref={carousel} className={styles.image} draggable>
          {images?.length &&
            images.map((img, idx) => (
              <Image key={idx} width="40%" src={img} className="shadow-2xl" />
            ))}
        </Carousel>
      </Modal>
    </div>
  );
};

export default Test;
