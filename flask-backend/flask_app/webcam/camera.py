# requires 'opencv-python-headless' without gui support
import cv2
from flask_app.webcam.base_camera import BaseCamera


########################################################################################################################
#                                              WEBCAM OBJECT USED BY FLASK                                             #
########################################################################################################################
class Camera(BaseCamera):
    video_source = 0
    face_cascade = None

    def __init__(self):
        Camera.face_cascade = cv2.CascadeClassifier('flask_app/webcam/haarcascade_frontalface_alt.xml')
        super(Camera, self).__init__()

    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def frames():
        camera = cv2.VideoCapture(Camera.video_source)

        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            # Read in each frame
            ret, frame = camera.read()

            # face detect
            faces = Camera.findFaces(frame)

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (44, 199, 255), 2)

            yield cv2.imencode('.jpg', frame)[1].tobytes()

    @staticmethod
    def findFaces(frame):
        # face detection only works on grayscale frames
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_gray = cv2.equalizeHist(frame_gray)
        return Camera.face_cascade.detectMultiScale(frame_gray)

    @staticmethod
    def autoBrighten(frame):
        # shift the alpha and beta values the same amount
        cv2.normalize(frame, frame, 0, 255, cv2.NORM_MINMAX)
