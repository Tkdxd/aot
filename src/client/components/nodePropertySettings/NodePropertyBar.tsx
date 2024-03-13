import { Button } from 'antd';
import OpenURLSetting from './propertySettings/OpenURLSetting';
import { CloseOutlined } from '@ant-design/icons';
import ClickSetting from './propertySettings/ClickSetting';
import TypeSetting from './propertySettings/TypeSetting';
import ScrollSetting from './propertySettings/ScrollSetting';
import HoverSetting from './propertySettings/HoverSetting';

function NodePropertyBar({ node, onChangeNodeData, onClose }) {
  return (
    <div className="fixed right-0 h-full w-72 bg-white px-4 py-5 shadow-2xl flex flex-col">
      <div>
        <Button
          className="float-right"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => onClose()}
        />
      </div>
      {
        {
          openURLNode: (
            <OpenURLSetting onChangeData={onChangeNodeData} data={node.data} />
          ),
          clickNode: (
            <ClickSetting onChangeData={onChangeNodeData} data={node.data} />
          ),
          typeNode: (
            <TypeSetting onChangeData={onChangeNodeData} data={node.data} />
          ),
          scrollNode: (
            <ScrollSetting onChangeData={onChangeNodeData} data={node.data} />
          ),
          hoverNode: (
            <HoverSetting onChangeData={onChangeNodeData} data={node.data} />
          ),
        }[node?.type]
      }
    </div>
  );
}

export default NodePropertyBar;
