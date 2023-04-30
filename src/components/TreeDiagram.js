import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeDiagram = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const renderTree = () => {
      const width = 600;
      const height = 400;

      const treeLayout = d3.tree().size([width, height]);

      const root = d3.hierarchy(data);
      treeLayout(root);

      const svg = d3.select(ref.current).append('svg')
        .attr('width', width)
        .attr('height', height);

      const g = svg.append('g');

      // Add links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
        .attr('stroke', 'black')
        .attr('fill', 'none');

      // Add nodes
      const nodes = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y}, ${d.x})`);

      nodes.append('circle')
        .attr('r', 4)
        .attr('fill', 'black');

      nodes.append('text')
        .attr('dy', 3)
        .attr('x', d => (d.children ? -8 : 8))
        .style('text-anchor', d => (d.children ? 'end' : 'start'))
        .text(d => d.data.name);
    };

    renderTree();
  }, [data]);

  return (
    <div ref={ref} className="w-full h-full">
    </div>
  );
};

export default TreeDiagram;
