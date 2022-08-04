#!/bin/bash -x

echo "running flask"

venv/bin/flask run --debugger --host=192.168.1.211

exec $SHELL
