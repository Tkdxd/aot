import { Button } from 'antd';
import { Handle, Position } from 'reactflow';

function StartNode({ isConnectable }) {
  return (
    <Button className="overflow-visible">
      Start
      <Handle
        className="!bg-blue-500"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        className="!bg-green-500"
        type="source"
        position={Position.Right}
        id="success"
        style={{
          top: '30%',
        }}
        isConnectable={isConnectable}
      />
      <Handle
        className="!bg-red-500"
        type="source"
        position={Position.Right}
        id="b"
        style={{
          top: '70%',
        }}
        isConnectable={isConnectable}
      />
    </Button>
  );
}

export default StartNode;
