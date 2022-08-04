# Raspberry Pi Hosted Automated Test Suite

A test automation frontend hosted on Raspberry Pi with instrument communication handled by a flask backend. 

## Features:
- Perform automation tests over GPIB or ethernet
- Monitor, review, and anlyze test data from react frontend
- Self-Hosted
- Free and Open Source ([GPLv3](LICENSE))

## TODO:
- Encrypt communication to the client
- client-side face detection
- thermal imager image processing
- easier setup and deployment

## Table of Contents
1. [Background](#backgroun)
2. [Block Diagram](#block-diagram)
3. [PiCal Setup](#setting-up-pical)
    1. [Cloning this Repository](#a-cloning-this-repository)
    2. [Install Python Dependencies](#b-install-python-dependencies)
    3. [Install linux-gpib](#c-install-linux-gpib)
    4. [Install Node for Raspberry Pi](#d-install-node-for-raspberry-pi)
    5. [Proxy API calls to backend](#e-setup-the-appropriate-address-routing-for-the-react-app)
    6. [Running in developer mode](#f-running-the-application-development-mode)

## Background
When users connect to the Raspberry Pi’s IP address through their web browser, they are greeted with CalPi’s dashboard page, which provides basic hardware stats for the raspberry pi including CPU, memory, and disk utilization.

The main goal of `CalPi` was to be flexible to the user. Whether on-site or remote, users can manage tests, request results, or observe on the status of a currently running test.

* The frontend is a Node.js enabled React-based web framework providing performant statically generated web pages with server-side rendering. 

* The backend is a flask endpoint running on Python. This means any api calls to our backend are routed back to the Raspberry Pi where Python handles hardware communication. 

Given the limited resources available on the Raspberry Pi, much of the post processing and data analytics occurs on the client-side while much of the server-side functions are visa communication to instruments, GPIO manipulation, and data logging to csv files.

A Qt interface will allow users a physical interface directly to the Raspberry Pi. For instance users will be able to use the touchscreen to run tests in the future, but for now, we are focusing on the web interface.

## Block diagram

![](/nextjs-frontend/public/blockdiagram.png)

## Setting up PiCal

`PiCal` is designed to be deployed flexibly.

### A. Cloning This Repository:

1. Make a *projects* directory:

    `$ mkdir ~/Documents/projects`

2. Change directory:

    `$ cd ~/Documents/projects`

3. Clone this repository:

    `$ git clone https://github.com/Tektronica/flask-nextjs-pyqt-app`


### B. Install Python Dependencies:

Creat the virtual environment the backend Flask app will run inside

1. Navigate to the cloned directory:

    `$ cd flask-nextjs-pyqt-app`

2. Navigate to the backend directory:

    `$ cd flask-backend`

3. Create a virtual environment called *venv*:

    `$ py -m venv venv`

4. Activate the environment:

    `$ source venv/bin/activate`
5. Update pip:

    `(venv) $ python -m pip install --upgrade pip`

6. Install python libraries to the environment:
    
    `(venv) $ pip install -r requirements.txt`

### C. Install linux-gpib:
GPIB resources requires to install a gpib driver. Unfortunately, there are no native solutions from National Instruments compatible with Raspbian OS. Fortunately, linux-gpib does the trick.

1. Follow the instructions and use their script by reviewing:

    https://xdevs.com/guide/ni_gpib_rpi/

2. The important piece is the shell script, `install_linux_gpib.sh`, located insde:

    `$ ~/Documents/projects/flask-nextjs-pyqt-app/flask-backend`

    1. Enter `yes` to update and install system software.
    2. `Yes` to reboot once the update finishes.
    3. `$ cd /boot`
    4. `$ sh install_linux_gpib.sh`
    5. `No` to update software
    6. `Yes` to install linux-gpib
    7. `No` to install teckit
    8. `No` to install samba
    9. `No` to install Pitft


### D. Install Node for Raspberry Pi:

The Nextjs is an opinionated framework built on top of React.js, which uses Node.js libraries

1. update the packages running on the Raspberry Pi OS:

    `$ sudo apt update`
    
    `$ sudo apt upgrade`

2. Add the repository for the current LTS release of NodeJS to the Raspberry Pi: 

    `$ curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -`

3. Install the Package:
    
    `$ sudo apt install nodejs`

4. Navigate to the `nextjs-frontend` directory of the react project and install the dependencies:

    `$ cd ~/Documents/projects/flask-nextjs-pyqt-app/nextjs-frontend`

    `$ npm i`


### E. Setup the appropriate address routing for the react app

The application is intended to run on your LAN by broadcasting from the Raspberry Pi's IP address. *Consider setting up a static IP for the Raspberry Pi*. However, in order for the frontend to talk to the backend, we need to proxy all frontend api calls to the backend. In this example, the Raspberry Pi is hosted on `192.168.1.211` and the flask backend is broadcasting off port `5000`.

1. open `package.json` from the `nextjs-frontend` directory. Replace the following address at `line 35` with your desired address:

    [ 35 ] `"proxy": "http://localhost:5000"`
    
    [ 35 ] `"proxy": "http://192.168.1.211:5000"`

2. Now open `next.config.js` from the same `nextjs-frontend` directory. Replace the following address at `line 14` with your desired address:

    [ 14 ] `destination: 'http://localhost:5000/:slug*'`
    
    [ 14 ] `destination: 'http://192.168.1.211:5000/:slug*'`


### F. Running the application (development mode)

Two running terminals are required for this process. A flask app runs in one terminal while the react app runs in the other. There are shell scripts available to help perform these steps faster, but we're covering the manual setup for completeness. In no particular order...

1. **First Terminal**:

    1. Navigate inside the `flask-backend` directory:

        `$ cd ~/Documents/projects/flask-nextjs-pyqt-app/flask-backend`

    2. Run the flask app using the Raspberry Pi IP address has the host argument

        `$ venv/bin/flask run --debugger --host=192.168.1.211`

2. **Second Terminal**:

    1. Navigate inside the `nextjs-frontend` directory:

        `$ cd ~/Documents/projects/flask-nextjs-pyqt-app/nextjs-frontend`

    2. Run the react app using the Raspberry Pi IP address has the host argument:

        `$ npm run dev`

3. Finally, in your browser, navigate to:

    `192.168.1.211:3000`
