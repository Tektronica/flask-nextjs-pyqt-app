# requires 'pip install opencv-python' for gui support
import cv2

# define a video capture object
vid = cv2.VideoCapture(0)

while True:
    # Read in each frame
    ret, frame = vid.read()

    # Use cv2's pyQT frame to display frames
    cv2.imshow('frame', frame)

    # pressing 'q' key ends loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# After the loop release the cap object
vid.release()

# Destroy all the windows
cv2.destroyAllWindows()
