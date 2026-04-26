import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';

interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
  color: string;
}

interface SkillLink extends d3.SimulationLinkDatum<SkillNode> {
  value: number;
}

const SKILL_DATA = {
  nodes: [
    // Core
    { id: 'Full Stack', group: 1, radius: 45, color: '#25F4EE' },
    
    // Frontend
    { id: 'React', group: 2, radius: 35, color: '#61DAFB' },
    { id: 'TypeScript', group: 2, radius: 30, color: '#3178C6' },
    { id: 'Tailwind', group: 2, radius: 25, color: '#38BDF8' },
    { id: 'Framer Motion', group: 2, radius: 25, color: '#FF0055' },
    { id: 'Three.js', group: 2, radius: 28, color: '#FFFFFF' },

    // Backend
    { id: 'Node.js', group: 3, radius: 35, color: '#339933' },
    { id: 'Express', group: 3, radius: 25, color: '#888888' },
    { id: 'MongoDB', group: 3, radius: 28, color: '#47A248' },
    { id: 'Python', group: 3, radius: 30, color: '#3776AB' },
    { id: 'PostgreSQL', group: 3, radius: 28, color: '#336791' },

    // AI/ML
    { id: 'Gemini AI', group: 4, radius: 40, color: '#FFB800' },
    { id: 'NLP', group: 4, radius: 25, color: '#FF9E0F' },
    { id: 'Vector DBs', group: 4, radius: 25, color: '#7E57C2' },
    
    // DevOps
    { id: 'Docker', group: 5, radius: 28, color: '#2496ED' },
    { id: 'Cloud Run', group: 5, radius: 25, color: '#4285F4' },
    { id: 'CI/CD', group: 5, radius: 22, color: '#25F4EE' },
  ],
  links: [
    { source: 'Full Stack', target: 'React', value: 2 },
    { source: 'Full Stack', target: 'Node.js', value: 2 },
    { source: 'Full Stack', target: 'Gemini AI', value: 2 },
    { source: 'React', target: 'TypeScript', value: 1 },
    { source: 'React', target: 'Tailwind', value: 1 },
    { source: 'React', target: 'Framer Motion', value: 1 },
    { source: 'React', target: 'Three.js', value: 1 },
    { source: 'Node.js', target: 'Express', value: 1 },
    { source: 'Node.js', target: 'MongoDB', value: 1 },
    { source: 'Node.js', target: 'PostgreSQL', value: 1 },
    { source: 'Node.js', target: 'Python', value: 1 },
    { source: 'Gemini AI', target: 'NLP', value: 1 },
    { source: 'Gemini AI', target: 'Vector DBs', value: 1 },
    { source: 'Node.js', target: 'Docker', value: 1 },
    { source: 'Docker', target: 'Cloud Run', value: 1 },
    { source: 'Docker', target: 'CI/CD', value: 1 },
  ]
};

export function SkillGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<SkillNode>(SKILL_DATA.nodes as SkillNode[])
      .force('link', d3.forceLink<SkillNode, SkillLink>(SKILL_DATA.links as SkillLink[]).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as SkillNode).radius + 5));

    const g = svg.append('g');

    const link = g.append('g')
      .attr('stroke', '#ffffff20')
      .attr('stroke-width', d => (d as any).value)
      .selectAll('line')
      .data(SKILL_DATA.links)
      .join('line');

    const node = g.append('g')
      .selectAll('g')
      .data(SKILL_DATA.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Node circles with glow
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('opacity', 0.15)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setSelectedNode(d.id);
        d3.select(event.currentTarget).transition().duration(200).attr('opacity', 0.5);
      })
      .on('mouseleave', (event) => {
        setSelectedNode(null);
        d3.select(event.currentTarget).transition().duration(200).attr('opacity', 0.15);
      });

    // Content circles
    node.append('circle')
      .attr('r', d => d.radius * 0.8)
      .attr('fill', 'black')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1)
      .style('pointer-events', 'none');

    // Text labels
    node.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', 'white')
      .attr('font-size', d => Math.min(12, d.radius * 0.4))
      .style('pointer-events', 'none')
      .attr('font-weight', '500')
      .attr('class', 'font-sans');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative min-h-[500px] bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-xl">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h3 className="text-white font-medium text-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-tiktok-cyan animate-pulse" />
          Technical Ecosystem
        </h3>
        <p className="text-white/40 text-sm mt-1">Interactive skill architecture map</p>
      </div>

      <div className="absolute bottom-8 right-8 z-10 bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md opacity-0 animate-fade-in pointer-events-none" 
           style={{ opacity: selectedNode ? 1 : 0, transition: 'opacity 0.3s' }}>
        <p className="text-tiktok-cyan text-xs font-mono mb-1 uppercase tracking-widest">Selected Module</p>
        <p className="text-white text-lg font-bold">{selectedNode || 'N/A'}</p>
      </div>

      <svg ref={svgRef} className="cursor-grab active:cursor-grabbing" />
      
      {/* HUD scanning effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,244,238,0.2)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]" />
      </div>
    </div>
  );
}
