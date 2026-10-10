import "server-only";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-50m.json";

/**
 * Projects map data on the server so the client receives plain SVG path
 * strings and x/y coordinates — no d3 or topology in the browser bundle.
 */

const BANGLADESH = "050";
const NEIGHBOURS = new Set(["356", "104", "064"]); // India, Myanmar, Bhutan

export interface ProjectedMap {
  width: number;
  height: number;
  bangladesh: string;
  neighbours: string;
  project: (coords: [number, number]) => [number, number];
}

const cache = new Map<string, ProjectedMap>();

/**
 * @param bounds [[west, south], [east, north]] area to fit.
 */
export function projectedMap(
  width: number,
  height: number,
  bounds: [[number, number], [number, number]] = [
    [87.9, 20.6],
    [92.8, 26.7],
  ],
  padding = 16,
): ProjectedMap {
  const key = `${width}x${height}:${bounds.flat().join(",")}:${padding}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
  const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;

  const [[w, s], [e, n]] = bounds;
  const frame: Feature = {
    type: "Feature",
    properties: {},
    geometry: { type: "MultiPoint", coordinates: [[w, s], [e, n], [w, n], [e, s]] },
  };
  const projection = geoMercator()
    .fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      frame,
    )
    // Clip neighbouring countries to the viewport so their paths stay small.
    .clipExtent([
      [0, 0],
      [width, height],
    ]);
  const path = geoPath(projection);

  const bd = countries.features.find((f) => String(f.id) === BANGLADESH);
  const near = countries.features.filter((f) => NEIGHBOURS.has(String(f.id)));

  const result: ProjectedMap = {
    width,
    height,
    bangladesh: bd ? (path(bd) ?? "") : "",
    neighbours: near.map((f) => path(f) ?? "").join(" "),
    project: (c) => {
      const p = projection(c) ?? [0, 0];
      return [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];
    },
  };
  cache.set(key, result);
  return result;
}
