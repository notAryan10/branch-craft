import React, { useState } from "react";
import ReactFlow, {  Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

let nodeCounter = 1;
const createNodeId = () => `node_${nodeCounter++}`;

const startingNodes = [
  {
    id: 'node_0',
    data: { label: "Main Topic" },
    position: { x: 350, y: 100 },
    style: {
      background: '#fff',
      border: '1px solid #777',
      borderRadius: '8px',
      padding: '10px',
    }
  },
];

function MindMappr() {
  const [nodes, setNodes] = useState(startingNodes);
  const [edges, setEdges] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [nodeName, setNodeName] = useState("");

  function selectNode(_, node) {
    setActiveNode(node);
    setNodeName(node.data.label);
  }

  function addNewBranch() {
    if (!activeNode) {
      alert("Please select a node first!");
      return;
    }

    const newId = createNodeId();
    
    const newNode = {
      id: newId,
      data: { label: "New Branch" },
      position: {
        x: activeNode.position.x + 200,
        y: activeNode.position.y + (Math.random() * 160 - 80),
      },
      style: {
        background: '#fff',
        border: '1px solid #777',
        borderRadius: '8px',
        padding: '10px',
      }
    };

    setNodes([...nodes, newNode]);
    
    setEdges([
      ...edges,
      {
        id: `e${activeNode.id}-${newId}`,
        source: activeNode.id,
        target: newId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#555' }
      },
    ]);
  }

  function removeNode() {
    if (!activeNode) {
      alert("Please select a node to delete!");
      return;
    }

    if (activeNode.id === 'node_0') {
      alert("Can't delete the main topic node!");
      return;
    }

    setNodes(nodes.filter(n => n.id !== activeNode.id));
    setEdges(edges.filter(e => e.source !== activeNode.id && e.target !== activeNode.id));
    
    setActiveNode(null);
    setNodeName("");
  }

  function changeNodeName() {
    if (!activeNode) {
      alert("Select a node to rename!");
      return;
    }

    if (!nodeName.trim()) {
      alert("Label cannot be empty!");
      return;
    }

    setNodes(
      nodes.map(node => 
        node.id === activeNode.id
          ? { ...node, data: { ...node.data, label: nodeName.trim() } }
          : node
      )
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="mindmap-toolbar">
        <button onClick={addNewBranch} className="toolbar-button">
          ➕ Add Branch
        </button>
        <button onClick={removeNode} className="toolbar-button">
          🗑️ Delete Node
        </button>
        <input type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Edit label" className="label-input" />
        <button onClick={changeNodeName} className="toolbar-button">  ✏️ Update Label</button>
        {activeNode && (
          <span className="selected-node-info">
            Selected: {activeNode.data.label}
          </span>
        )}
      </div>
      
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={(changes) => setNodes(applyNodeChanges(changes, nodes))} onEdgesChange={(changes) => setEdges(applyEdgeChanges(changes, edges))}
        onConnect={(connection) => {
          if (connection.source !== connection.target) {
            setEdges(addEdge({
              ...connection,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#555' }
            }, edges));
          }
        }}
        onNodeClick={selectNode}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        className="mindmap-flow"
      >
        <Controls />
        <Background variant="dots" gap={20} size={2} color="#c8c8c8" />
      </ReactFlow>
    </div>
  );
}

export default MindMappr;
