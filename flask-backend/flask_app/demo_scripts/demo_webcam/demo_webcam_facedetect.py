# requires 'pip install opencv-python' for gui support
import cv2

# define a video capture object
video = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')


def findFaces(frame):
    # face detection only works on grayscale frames
    frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame_gray = cv2.equalizeHist(frame_gray)
    return face_cascade.detectMultiScale(frame_gray)


def autoBrighten(frame):
    # shift the alpha and beta values the same amount
    cv2.normalize(frame, frame, 0, 255, cv2.NORM_MINMAX)


while True:
    # Read in each frame
    ret, frame = video.read()

    # face detect
    faces = findFaces(frame)

    # auto brighten
    autoBrighten(frame)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Use cv2's pyQT frame to display frames
    cv2.imshow('frame', frame)

    # pressing 'q' key ends loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# After the loop release the cap object
video.release()

# Destroy all the windows
cv2.destroyAllWindows()
