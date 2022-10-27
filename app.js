/*
 * @Descripttion:
 * @version:
 * @Author: Yuhj
 * @Date: 2022-10-16 22:19:13
 */
const video = document.getElementById('video');
// console.log('video', video);
// console.log('faceapi', faceapi);
const startvideo = () => {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startvideo());

let detections = [];
let timer = '';

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  console.log('canvas', canvas);
  document.body.append(canvas);
  const displaySize = {
    width: video.width,
    height: video.height,
  };
  faceapi.matchDimensions(canvas, displaySize);
  timer = setInterval(async () => {
    detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log(detections);
    console.log(detections.length);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    // if (detections.length === 1) {
    // clearInterval(timer);
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // video.removeEventListener('play', () => {
    //   console.log('remove OK');
    // });
    // }
  }, 100);
  // clearInterval(timer);
  if (detections.length > 0) {
    // video.removeEventListener('play', () => {
    //   console.log('remove OK');
    // });
  }
});
