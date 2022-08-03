# requires 'pip install opencv-python' for gui support
from flask import Flask, render_template_string, Response
import cv2


########################################################################################################################
#                                              WEBCAM OBJECT USED BY FLASK                                             #
########################################################################################################################
class VideoCamera(object):
    def __init__(self):
        # define a video capture object
        self.video = cv2.VideoCapture(0)
        self.face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

    def __del__(self):
        self.video.release()

    def get_frame(self):
        # Read in each frame
        ret, frame = self.video.read()

        # face detect
        faces = self.findFaces(frame)

        # auto brighten
        self.autoBrighten(frame)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)

        return jpeg.tobytes()

    def findFaces(self, frame):
        # face detection only works on grayscale frames
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_gray = cv2.equalizeHist(frame_gray)
        return self.face_cascade.detectMultiScale(frame_gray)

    def autoBrighten(self, frame):
        # shift the alpha and beta values the same amount
        cv2.normalize(frame, frame, 0, 255, cv2.NORM_MINMAX)


########################################################################################################################
#                                          FLASK APPLICATION AND DECLARATIONS                                          #
########################################################################################################################
app = Flask(__name__)
video_stream = VideoCamera()


@app.route('/')
def index():
    return render_template_string(
        """
        <!DOCTYPE html>
        <html>
            <head>
                <title>Video Stream</title>
            </head>
            <body>
                <h1>Video Stream</h1>
                <img src="{{ url_for('video_feed') }}" />
            </body>
        </html>
        """)


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    print('getting video feed')
    return Response(gen(video_stream),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True, port=5001)
