import React, { useCallback, useState } from "react";
import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges,} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

let nodeId = 1;
const getId = () => `node_${nodeId++}`;

const initialNodes = [
  {
    id: 'node_0',
    type: "default",
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

const initialEdges = [];

export default function MindMappr() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeLabel, setNodeLabel] = useState("");

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => {
      // Prevent self-connections
      if (connection.source !== connection.target) {
        setEdges((eds) => addEdge({
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#555' }
        }, eds));
      }
    },
    []
  );

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeLabel(node.data.label);
  }, []);

  const addBranch = useCallback(() => {
    if (!selectedNode) {
      alert("Select a node to branch from!");
      return;
    }

    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      data: { label: "New Branch" },
      position: {
        x: selectedNode.position.x + 200,
        y: selectedNode.position.y + Math.random() * 160 - 80,
      },
      style: {
        background: '#fff',
        border: '1px solid #777',
        borderRadius: '8px',
        padding: '10px',
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds,
      {
        id: `e${selectedNode.id}-${newNodeId}`,
        source: selectedNode.id,
        target: newNodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#555' }
      },
    ]);
  }, [selectedNode]);

  const deleteNode = useCallback(() => {
    if (!selectedNode) {
      alert("Select a node to delete!");
      return;
    }

    if (selectedNode.id === 'node_0') {
      alert("Cannot delete the main topic node!");
      return;
    }

    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
    setNodeLabel("");
  }, [selectedNode]);

  const handleLabelChange = useCallback((e) => {
    setNodeLabel(e.target.value);
  }, []);

  const updateLabel = useCallback(() => {
    if (!selectedNode) {
      alert("Select a node to rename!");
      return;
    }

    if (!nodeLabel.trim()) {
      alert("Label cannot be empty!");
      return;
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: nodeLabel.trim() } }
          : node
      )
    );
  }, [selectedNode, nodeLabel]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="mindmap-toolbar">
        <button 
          onClick={addBranch}
          className="toolbar-button"
        >
          ➕ Add Branch
        </button>
        <button 
          onClick={deleteNode}
          className="toolbar-button"
        >
          🗑️ Delete Node
        </button>
        <input
          type="text"
          value={nodeLabel}
          onChange={handleLabelChange}
          placeholder="Edit label"
          className="label-input"
        />
        <button 
          onClick={updateLabel}
          className="toolbar-button"
        >
          ✏️ Update Label
        </button>
        {selectedNode && (
          <span className="selected-node-info">
            Selected: {selectedNode.data.label}
          </span>
        )}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
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
