function f(x) {
    if (Math.abs(x % Math.PI) < 0.1) return NaN; 
    return Math.tan(x); 
}

window.onload = function () {
    var WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
    };

    var graph = new Graph({
        WIN: WIN,
        onUpdate: renderGraph,
    });
    function renderGraph() {
        graph.context.clearRect(0, 0, graph.context.canvas.width, graph.context.canvas.height);
        graph.drawGrid();
        graph.drawAxes();
        renderFunction(f, 'blue', 2);
        drawAsymptotes();
        drawLabels();
    }
    function renderFunction(f, color, width) {
        var x = WIN.LEFT;
        var dx = WIN.WIDTH / 100;
        while (x < WIN.WIDTH + WIN.LEFT) {
            const y1 = f(x);
            const y2 = f(x + dx);

            if (!isNaN(y1) && !isNaN(y2) && Math.abs(y1 - y2) < WIN.HEIGHT) {
                graph.line(x, y1, x + dx, y2, color, width);
            }

            x += dx;
        }
    }
    function drawAsymptotes() {
        const step = Math.PI;
        graph.context.strokeStyle = 'pink'; 
        graph.context.lineWidth = 1;

        for (let x = Math.ceil(WIN.LEFT / step) * step; x < WIN.LEFT + WIN.WIDTH; x += step) {
            graph.line(x, WIN.BOTTOM, x, WIN.BOTTOM + WIN.HEIGHT, 'pink', 1);
        }
    }
    function drawLabels() {
        const labelX = 1; 
        const labelY = 2; 
        const screenX = graph.context.canvas.width * (labelX - WIN.LEFT) / WIN.WIDTH;
        const screenY = graph.context.canvas.height * (1 - (labelY - WIN.BOTTOM) / WIN.HEIGHT);
        graph.context.fillStyle = 'black'; 
        graph.context.font = '14px Arial';
        graph.context.fillText("y = tan(x)", screenX, screenY);
    }
    renderGraph();
};
