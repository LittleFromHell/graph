function Graph(options) {
    options = options || {};
    var id = options.id;
    var width = options.width || 500;
    var height = options.height || 500;
    var WIN = options.WIN;
    var canvas;
    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    function xs(x) {
        return (x - WIN.LEFT) / WIN.WIDTH * canvas.width;
    }
    function ys(y) {
        return canvas.height - (y - WIN.BOTTOM) / WIN.HEIGHT * canvas.height;
    }

    this.line = function (x1, y1, x2, y2, color, width) {
        context.beginPath();
        context.strokeStyle = color || 'black';
        context.lineWidth = width || 1;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.closePath();
        context.stroke();
    };

    this.drawGrid = function () {
        context.strokeStyle = '#e0e0e0';
        context.lineWidth = 1;

        for (let x = Math.ceil(WIN.LEFT); x <= WIN.LEFT + WIN.WIDTH; x++) {
            this.line(x, WIN.BOTTOM, x, WIN.BOTTOM + WIN.HEIGHT, '#e0e0e0');
        }

        for (let y = Math.ceil(WIN.BOTTOM); y <= WIN.BOTTOM + WIN.HEIGHT; y++) {
            this.line(WIN.LEFT, y, WIN.LEFT + WIN.WIDTH, y, '#e0e0e0');
        }
    };

    this.drawAxes = function () {
        this.line(WIN.LEFT, 0, WIN.LEFT + WIN.WIDTH, 0, 'black', 2);
        this.line(0, WIN.BOTTOM, 0, WIN.BOTTOM + WIN.HEIGHT, 'black', 2);

        context.fillStyle = 'black';
        context.font = '14px Arial';

        this.line(WIN.LEFT + WIN.WIDTH, 0, WIN.LEFT + WIN.WIDTH - 0.5, 0.2, 'black', 2);
        this.line(WIN.LEFT + WIN.WIDTH, 0, WIN.LEFT + WIN.WIDTH - 0.5, -0.2, 'black', 2);
        context.fillText("X", canvas.width - 20, ys(0) - 10);

        this.line(0, WIN.BOTTOM + WIN.HEIGHT, 0.2, WIN.BOTTOM + WIN.HEIGHT - 0.5, 'black', 2);
        this.line(0, WIN.BOTTOM + WIN.HEIGHT, -0.2, WIN.BOTTOM + WIN.HEIGHT - 0.5, 'black', 2);
        context.fillText("Y", xs(0) + 10, 20);

        context.fillText("0", xs(0) + 5, ys(0) - 5);
    };
    var zoom = false;
    var startX, startY;

    canvas.addEventListener('mousedown', (event) => {
        zoom = true;
        startX = event.offsetX;
        startY = event.offsetY;
    });

    canvas.addEventListener('mousemove', (event) => {
        if (zoom) {
            var dx = (event.offsetX - startX) * WIN.WIDTH / canvas.width;
            var dy = (event.offsetY - startY) * WIN.HEIGHT / canvas.height;
            WIN.LEFT -= dx;
            WIN.BOTTOM += dy;
            startX = event.offsetX;
            startY = event.offsetY;

            if (options.onUpdate) {
                options.onUpdate();
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        zoom = false;
    });

    canvas.addEventListener('wheel', (event) => {
        const scale = event.deltaY > 0 ? 1.1 : 0.9;
        WIN.WIDTH *= scale;
        WIN.HEIGHT *= scale;

        if (options.onUpdate) {
            options.onUpdate();
        }
    });

    this.context = context;
}
