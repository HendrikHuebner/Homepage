window.onload = function () {
    const canvas = document.getElementById("background");
    const ctx = canvas.getContext("2d");
    let blobs = []

    //style
    const background = "#240c03";
    const blobColor = "#ff7b45";

    const blobRadius = 3;

    function adjustCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    function spawnRandomBlobs() {
        const blobCount = 300;

        for (let i = 0; i < blobCount; i++) {
            let rx = 20 + Math.floor(Math.random() * (canvas.width - 20));
            let ry = 20 + Math.floor(Math.random() * (canvas.height - 20));
            let blob = {"x": rx, "y": ry, "vx": 0, "vy": 0}

            blobs.push(blob)
        }
    }

    function init() {
        adjustCanvas();
        spawnRandomBlobs();

        document.addEventListener("click", (e) => {
            if (blobs.length < 200) {
                blobs.push({"x": e.clientX, "y": e.clientY, "vx": 0, "vy": 0});
            }
        });

        document.addEventListener("mousemove", (e) => {
            blobs.forEach((b) => {
                let dist = (b.x - e.clientX) ** 2 + (b.y - e.clientY) ** 2;

                if (dist < 400) {
                    b.vx += 0.001 * (b.x - e.clientX);
                    b.vx = Math.min(b.vx, 0.1);

                    b.vy += 0.001 * (b.y - e.clientY);
                    b.vy = Math.min(b.vy, 0.1);
                }
            });
        });

        window.addEventListener("resize", (e) => {
            adjustCanvas();
        })
    }

    let prevTime = Date.now();

    function draw() {
        let time = Date.now();
        let dt = time - prevTime;
        let w = canvas.width;
        let h = canvas.height;

        // clear canvas
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);

        // update blob positions
        blobs.forEach((b) => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
        });

        // delete blobs outside of canvas
        blobs = blobs.filter((b) => {
            return b.x >= -blobRadius && b.x <= canvas.width + blobRadius
            && b.y >= -blobRadius && b.y <= canvas.height + blobRadius
        });

        // draw edges
        ctx.strokeStyle = blobColor;

        for (let i = 0; i < blobs.length; i++) {
            for (let j = i + 1; j < blobs.length; j++) {
                let dist = (blobs[i].x - blobs[j].x) ** 2 + (blobs[i].y - blobs[j].y) ** 2;

                if(dist > 16000) continue;

                let alpha = Math.max(0, 1.0 - (1 / 16000) * ((blobs[i].x - blobs[j].x) ** 2 + (blobs[i].y - blobs[j].y) ** 2));

                ctx.globalAlpha = alpha;

                ctx.beginPath();
                ctx.moveTo(blobs[i].x, blobs[i].y);
                ctx.lineTo(blobs[j].x, blobs[j].y);
                ctx.stroke();
            }
        }

        // draw blobs
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = blobColor;

        blobs.forEach((b) => {
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, blobRadius, blobRadius, 0, 0, 360);
            ctx.fill();
        });

        prevTime = time;
    }

    init();
    setInterval(draw, 50);
}
