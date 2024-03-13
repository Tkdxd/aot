import { Button, Divider } from 'antd';

function SideBar({ runScript, openModal }) {
  const onDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-full h-full shadow-2xl px-2 py-3">
      <Button
        draggable
        onDragStart={(event) => onDragStart(event, 'openURLNode')}
      >
        Open URL
      </Button>
      <Button
        draggable
        onDragStart={(event) => onDragStart(event, 'clickNode')}
      >
        Click
      </Button>
      <Button draggable onDragStart={(event) => onDragStart(event, 'typeNode')}>
        Type
      </Button>
      <Button
        draggable
        onDragStart={(event) => onDragStart(event, 'scrollNode')}
      >
        Scroll
      </Button>
      <Button
        draggable
        onDragStart={(event) => onDragStart(event, 'hoverNode')}
      >
        Hover
      </Button>
      <Divider></Divider>
      <Button draggable onClick={runScript}>
        Run
      </Button>
      <Divider></Divider>
      <Button type="primary" onClick={openModal}>
        Open Modal
      </Button>
    </div>
  );
}

export default SideBar;
