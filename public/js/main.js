function loadImage(url) {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
const contex = canvas.getContext('2d');

contex.fillRect(0, 0, 50, 50);

loadImage('/img/tiles.png')
    .then((image) => contex.drawImage(image, 0, 0));