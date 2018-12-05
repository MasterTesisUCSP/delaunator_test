
const baricentrosX = [];
const baricentrosY = [];


function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }
function triangleOfEdge(e)  { return Math.floor(e / 3); }

function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
function prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }

function forEachTriangleEdge(points, delaunay, callback) {
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e > delaunay.halfedges[e]) {
            const p = points[delaunay.triangles[e]];
            const q = points[delaunay.triangles[nextHalfedge(e)]];
            callback(e, p, q);
        }
    }
}
  
function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

function pointsOfTriangle(delaunay, t) {
    return edgesOfTriangle(t)
        .map(e => delaunay.triangles[e]);
}

function forEachTriangle(points, delaunay, callback) {
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
    }
}

function triangleOfEdge(e)  { return Math.floor(e / 3); }

function trianglesAdjacentToTriangle(delaunay, t) {
    const adjacentTriangles = [];
    for (const e of edgesOfTriangle(t)) {
        const opposite = delaunay.halfedges[e];
        if (opposite >= 0) {
            adjacentTriangles.push(triangleOfEdge(opposite));
        }
    }
    return adjacentTriangles;
}

function circumcenter(a, b, c) {
    const ad = a[0] * a[0] + a[1] * a[1];
    const bd = b[0] * b[0] + b[1] * b[1];
    const cd = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    return [
        1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
        1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
    ];
}

function baricenter(a, b, c) {
    
    const centerX = (a[0] + b[0] + c[0])/3;
    const centerY = (a[1] + b[1] + c[1])/3;
    return [
        centerX,
        centerY,
    ];
}

function triangleCenter(points, delaunay, t) {
    const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
    return circumcenter(vertices[0], vertices[1], vertices[2]);
}

function triangleCenter2(points, delaunay, t) {
    const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
    return baricenter(vertices[0], vertices[1], vertices[2]);
}

function forEachVoronoiEdge(points, delaunay, callback) {
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e < delaunay.halfedges[e]) {
            const p = triangleCenter(points, delaunay, triangleOfEdge(e));
            const q = triangleCenter(points, delaunay, triangleOfEdge(delaunay.halfedges[e]));
            callback(e, p, q);
        }
    }
}
   
function edgesAroundPoint(delaunay, start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}
   
function forEachVoronoiCell(points, delaunay, callback) {
    const seen = new Set();  // of point ids
    for (let e = 0; e < delaunay.triangles.length; e++) {
        const p = delaunay.triangles[nextHalfedge(e)];
        if (!seen.has(p)) {
            seen.add(p);
            const edges = edgesAroundPoint(delaunay, e);
            const triangles = edges.map(triangleOfEdge);
            const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
            callback(p, vertices);
        }
    }
}

function forEachVoronoiCell(points, delaunay, callback) {
    const index = new Map(); // point id to half-edge id
    for (let e = 0; e < delaunay.triangles.length; e++) {
        const endpoint = delaunay.triangles[nextHalfedge(e)];
        if (!index.has(endpoint) || delaunay.halfedges[e] === -1) {
            index.set(endpoint, e);
        }
    }
    for (let p = 0; p < points.length; p++) {
        const incoming = index.get(p);
        const edges = edgesAroundPoint(delaunay, incoming);
        const triangles = edges.map(triangleOfEdge);
        const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
        callback(p, vertices);
    }
}

//////////////////////////////////////////////////////////////



function tangent(a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.sqrt(dx * dx + dy * dy);
    return [dx / d, dy / d];
}

function normal(a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.sqrt(dx * dx + dy * dy);
    return [dy / d, -dx / d];
}


function redPointsSvg(points) {
    const results = ['<g class="seed-points">'];
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        results.push(`<circle class="point-${i}" cx="${p[0]}" cy="${p[1]}" r="2"/>`);
    }
    results.push('</g>');
    return results.join('');
}

function bluePointsSvg(points, delaunay) {
    const results = ['<g class="vertices">'];
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        const point = triangleCenter(points, delaunay, t);
        results.push(`<circle  stroke="black" cx="${point[0]}" cy="${point[1]}" r="2" fill="rgb(255,255,255)"/>`);
    }
    results.push('</g>');
    return results.join('');
}
function getRandomInt(max,min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function baricenterPointsSvg(points, delaunay, color,colors1) {
    const results = ['<g class="vertices">'];   
    const color_node =  [255,255,255];
    for (var ci = 0; ci < colors1.length; ci++) {
        //console.log(colors1[ci][0],colors1[ci][1],colors1[ci][2]);
    }
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        const point = triangleCenter2(points, delaunay, t);
        //console.log("point:",point);
        baricentrosX.push(Math.round(point[0]) );
        baricentrosY.push(Math.round(point[1]) );
        
        //results.push(`<circle  stroke="rgba(100,100,100,0.3)" stroke-width= "0.5" cx="${point[0]}" cy="${point[1]}" r="2" fill="rgb(${colors1[t][2]},${colors1[t][1]},${colors1[t][0]})"/>`);
            //results.push(`<circle  stroke="rgba(100,100,100,0.3)" stroke-width= "0.5" cx="${point[0]}" cy="${point[1]}" r="1" fill="rgb(${getRandomInt(255,0)},${getRandomInt(255,0)},${getRandomInt(255,0)})"/>`);
            //results.push(`<circle  stroke="rgba(100,100,100,0.3)" stroke-width= "0.5" cx="${point[0]}" cy="${point[1]}" r="1" fill="rgb(${getRandomInt()},${getRandomInt()},${getRandomInt()})"/>`);
        results.push(`<circle  stroke="rgba(${color[0]},${color[1]},${color[2]},1)"   cx="${point[0]}" cy="${point[1]}" r="2" fill="rgba(${color_node[0]},${color_node[1]},${color_node[2]},1)"/>`);
    }
    console.log(baricentrosX);
    console.log(baricentrosY);
    results.push('</g>');
    return results.join('');
}

function baricenterPointsSvg_(points, delaunay, colors_node) {
    const results = ['<g class="vertices">'];   
    const color =  [255,255,255];
    
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        const point = triangleCenter2(points, delaunay, t);
        //console.log("point:",point);
        baricentrosX.push(Math.round(point[0]) );
        baricentrosY.push(Math.round(point[1]) );
        results.push(`<circle  stroke="rgba(${color[0]},${color[1]},${color[2]},1)" stroke-width= "0.5"  cx="${point[0]}" cy="${point[1]}" r="2" fill="rgba(${colors_node[t][2]},${colors_node[t][1]},${colors_node[t][0]},1)"/>`);
    }
    results.push('</g>');
    return results.join('');
}



function trianglesSvg(points, delaunay,colors_node, fill = () => 'white') {
    const results = ['<g class="delaunay-draw">'];

    forEachTriangle(points, delaunay, (t, p) => {
        //t: indice
        //p: triangulo
        results.push(`<polygon data-id="${t}" points="${p}" fill="rgba(${colors_node[t][2]},${colors_node[t][1]},${colors_node[t][0]},1)"/>`);
    });
    results.push('</g>');
    return results.join('');
}

function delaunaySvg(points, delaunay, color) {
    const results = ['<g class="edges">'];
    forEachTriangleEdge(points, delaunay, (e, p, q) => {
        results.push(`<line stroke-width="0.5" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="rgba(${color[0]},${color[1]},${color[2]},1)" />`);
    });
    results.push('</g>');
    return results.join('');
}


function voronoiSvg(points, delaunay, color) {
    const results = ['<g class="edges">'];
    for (let e = 0; e < delaunay.halfedges.length; e++) {
        if (e < delaunay.halfedges[e]) {
            const a = triangleCenter2(points, delaunay, Math.floor(e / 3));
            const b = triangleCenter2(points, delaunay, Math.floor(delaunay.halfedges[e] / 3));
            results.push(`<line stroke-width="1.5" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="rgba(${color[0]},${color[1]},${color[2]},1)"/>`);
        }
    }
    results.push('</g>');
    return results.join('');
}

function cellsSvg(points, delaunay) {
    const results = ['<g class="voronoi-draw">'];
    forEachVoronoiCell(points, delaunay, (p, vertices) => {
        const hue = (2 * p) % 360;
        results.push(`<polygon data-id="${p}" points="${vertices}" fill="hsl(${hue},20%,50%)"/>`);
    });
    results.push('</g>');
    return results.join('');
}

function halfedgeSvg(points, delaunay, filter = () => true) {
    const dn = 4, dt = 15;
    const results = ['<g class="edges arrowhead">'];
    for (let e1 = 0; e1 < delaunay.halfedges.length; e1++) {
        if (!filter(e1)) { continue; }
        const e2 = nextHalfedge(e1);
        const a = points[delaunay.triangles[e1]];
        const b = points[delaunay.triangles[e2]];
        const n = normal(a, b);
        const t = tangent(a, b);
        results.push(`<line class="edge-${e1}" x1="${a[0] + dn * n[0] + dt * t[0]}" y1="${a[1] + dn * n[1] + dt * t[1]}" x2="${b[0] + dn * n[0] - dt * t[0]}" y2="${b[1] + dn * n[1] - dt * t[1]}" />`);
    }
    results.push('</g>');
    return results.join('');
}