# requires 'opencv-python-headless' without gui support
import cv2


########################################################################################################################
#                                              WEBCAM OBJECT USED BY FLASK                                             #
########################################################################################################################
class Camera(object):
    def __init__(self):
        # define a video capture object
        self.video = cv2.VideoCapture(0)
        self.face_cascade = cv2.CascadeClassifier('flask_app/webcam/haarcascade_frontalface_alt.xml')

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
