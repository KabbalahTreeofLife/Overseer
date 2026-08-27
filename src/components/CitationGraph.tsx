"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CitationNode, CitationEdge } from "@/lib/types";

interface Props {
  nodes: CitationNode[];
  edges: CitationEdge[];
}

export function CitationGraph({ nodes, edges }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<CitationNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !nodes.length) return;

    const width = containerRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    const nodeData = nodes.map((n) => ({ ...n }));
    const linkData = edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(nodeData as any)
      .force(
        "link",
        d3
          .forceLink(linkData as any)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

    const link = g
      .append("g")
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1)
      .attr("marker-end", "url(#arrowhead)");

    const maxCitations = d3.max(nodeData, (d) => d.citationCount) || 1;
    const radiusScale = d3.scaleSqrt().domain([0, maxCitations]).range([4, 20]);

    const node = g
      .append("g")
      .selectAll("circle")
      .data(nodeData)
      .join("circle")
      .attr("r", (d) => radiusScale(d.citationCount))
      .attr("fill", (d) => {
        const yearNorm = Math.max(0, Math.min(1, (d.year - 2000) / 26));
        return d3.interpolateViridis(yearNorm);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }),
      );

    g.append("g")
      .selectAll("text")
      .data(nodeData)
      .join("text")
      .text(
        (d) =>
          d.title.length > 40 ? d.title.slice(0, 40) + "..." : d.title,
      )
      .attr("font-size", 10)
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "currentColor")
      .attr("opacity", 0.7);

    node
      .on("mouseover", (event, d) => {
        setHoveredNode(d as CitationNode);
        d3.select(event.target)
          .attr("stroke", "#000")
          .attr("stroke-width", 3);
        link
          .attr("stroke-opacity", (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.1,
          )
          .attr("stroke-width", (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 2 : 1,
          );
      })
      .on("mouseout", (event) => {
        setHoveredNode(null);
        d3.select(event.target)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5);
        link.attr("stroke-opacity", 0.4).attr("stroke-width", 1);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      g.selectAll<SVGTextElement, any>("text")
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  return (
    <div className="relative" ref={containerRef}>
      <svg
        ref={svgRef}
        className="w-full border rounded-lg bg-background"
        style={{ height: 500 }}
      />
      {hoveredNode && (
        <div className="absolute top-2 right-2 p-3 border rounded-lg bg-card shadow-lg max-w-xs">
          <p className="font-semibold text-sm line-clamp-2">
            {hoveredNode.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {hoveredNode.year} &middot;{" "}
            {hoveredNode.citationCount.toLocaleString()} citations
          </p>
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Scroll to zoom &middot; Drag to pan &middot; Hover for details
      </div>
    </div>
  );
}
