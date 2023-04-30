import { useState } from 'react';
import { hierarchy, HierarchyPointNode, tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { line } from 'd3-shape';

interface Node {
  name: [number, number];
  children?: Node[];
}

interface Props {
  data: Node;
}

export default function TreeDiagram({ data }: Props): JSX.Element {
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');

  const toggleLayout = () => {
    setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const width = 800;
  const height = 400;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  const root = hierarchy<Node>(data);

  const treeLayout = tree<Node>()
      .size(layout === 'horizontal' ? [height, width] : [width, height]);

  const treeData = treeLayout(root);

  const diagonal = line<HierarchyPointNode<Node>>()
      .x((d) => layout === 'horizontal' ? d.y : d.x)
      .y((d) => layout === 'horizontal' ? height - d.x : height - d.y);

  const nodes = treeData.descendants().reverse();
  const links = treeData.links();

  return (
      <>
        <div className="mb-4">
          <button onClick={toggleLayout}>
            {layout === 'horizontal' ? 'Vertical Layout' : 'Horizontal Layout'}
          </button>
        </div>
        <svg viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {links.map((link) => (
                <path
                    key={`${link.source.data.name}-${link.target.data.name}`}
                    fill="none"
                    stroke="#999"
                    strokeWidth="1.5"
                    d={diagonal(link) || undefined}
                />
            ))}
            {nodes.map((node) => (
                <g key={node.data.name.toString()} transform={`translate(${layout === 'horizontal' ? node.y : node.x},${layout === 'horizontal' ? height - node.x : height - node.y})`}>
                  <circle r={4} fill="#fff" stroke="#333" strokeWidth={1.5} />
                  <text
                      x={layout === 'horizontal' ? (node.children ? -8 : 8) : (node.depth === 0 ? -8 : 8)}
                      y={layout === 'horizontal' ? (node.depth === 0 ? 8 : -8) : (node.children ? 8 : -8)}
                      textAnchor={layout === 'horizontal' ? (node.children ? 'end' : 'start') : (node.depth === 0 ? 'end' : 'start')}
                      dominantBaseline="middle"
                      fill="#333"
                      fontWeight={node.depth === 0 ? 700 : undefined}
                  >
                    {node.data.name.toString()}
                  </text>
                </g>
            ))}
          </g>
        </svg>
      </>
  );
}