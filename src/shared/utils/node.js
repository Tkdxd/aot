export const arrangeNode = (node, edges, cloneNodes) => {
  const prevNode = node;
  const targetSuccess = edges.find(
    ({ source, sourceHandle }) =>
      source === node?.id && sourceHandle === 'success',
  )?.target;
  const targetFail = edges.find(
    ({ source, sourceHandle }) =>
      source === node?.id && sourceHandle === 'fail',
  )?.target;
  if (targetSuccess) {
    node = cloneNodes.find((n) => n?.id === targetSuccess);
    if (node) {
      const positionX = prevNode.position.x + prevNode.width + 50;
      cloneNodes = cloneNodes.map((n) => {
        if (n.id === node.id) {
          n = {
            ...n,
            position: {
              x: positionX > 500 ? 0 : positionX,
              y:
                positionX > 500
                  ? prevNode.position.y + prevNode.height + 25
                  : prevNode.position.y,
            },
          };
        }

        return n;
      });
      cloneNodes = arrangeNode(node, edges, cloneNodes);
    }
  }
  if (targetFail) {
    node = cloneNodes.find((n) => n?.id === targetFail);
    if (node) {
      const positionX = prevNode.position.x + prevNode.width + 50;

      cloneNodes = cloneNodes.map((n) => {
        if (n.id === node.id) {
          n = {
            ...n,
            position: {
              x: positionX > 500 ? 0 : positionX,
              y: prevNode.position.y + prevNode.height + 25,
            },
          };
        }

        return n;
      });
      cloneNodes = arrangeNode(node, edges, cloneNodes);
    }
  }
  return cloneNodes;
};
