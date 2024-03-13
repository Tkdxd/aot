import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import SideBar from '../SideBar';
import { useCallback, useEffect, useState } from 'react';
import NodePropertyBar from '../nodePropertySettings/NodePropertyBar';
import { arrangeNode } from '../../../shared/utils/node';
import { cloneDeep } from 'lodash';
import 'reactflow/dist/style.css';
import {
  StartNode,
  OpenURLNode,
  StopNode,
  ClickNode,
  TypeNode,
  ScrollNode,
  CloseDialogNode,
  HoverNode,
} from '../nodes';

const nodeTypes = {
  startNode: StartNode,
  openURLNode: OpenURLNode,
  stopNode: StopNode,
  clickNode: ClickNode,
  typeNode: TypeNode,
  scrollNode: ScrollNode,
  closeDialogNode: CloseDialogNode,
  hoverNode: HoverNode,
};

function FlowLayout({ initialNodes, initialEdges, exportScript, openModal }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
  const onNodeDelete = (event, node) => {
    event.preventDefault();
    setNodes(nodes.filter(({ id }) => id !== node.id));
  };

  const onNodeClick = (event, node) => {
    event.preventDefault();
    setSidebarOpen(true);
    setSelectedNode(node);
  };
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = [
        {
          id: Date.now().toString(),
          type,
          position,
          data: {},
        },
      ];

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );
  const onChangeNode = (id, key, value) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) node = { ...node, [key]: value };
        return node;
      }),
    );
  };

  const handleKeyPress = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        let cloneNodes = cloneDeep(nodes);
        const node = cloneNodes.find(({ type }) => type === 'startNode');
        if (node) {
          node.position = {
            x: 0,
            y: 0,
          };
          cloneNodes = cloneNodes.map((n) => {
            if (n.id === node.id) n = node;
            return n;
          });

          setNodes(arrangeNode(node, edges, cloneNodes));
        }
      }
    },
    [nodes, edges],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [handleKeyPress]);

  return (
    <ReactFlowProvider>
      <div className="col-span-1">
        <SideBar
          runScript={() => exportScript({ nodes, edges, id: 1 })}
          openModal={openModal}
        />
      </div>
      <div className="col-span-3 h-full">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={(evt, node) => onNodeDelete(evt, node)}
          onNodeClick={(evt, node) => onNodeClick(evt, node)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {sidebarOpen && (
        <NodePropertyBar
          node={selectedNode}
          onChangeNodeData={(data) =>
            onChangeNode(selectedNode.id, 'data', data)
          }
          onClose={() => setSidebarOpen(false)}
        ></NodePropertyBar>
      )}
    </ReactFlowProvider>
  );
}

export default FlowLayout;
