
This folder is a test of flask with python to serve a table that can be edited.
(from: ChatGPT 2025-04-15)

You need to install:
openpyxl (python-openpyxl as Arch package)
python-geosupport https://github.com/ishiland/python-geosupport/tree/master
    (See notes in python-geosupport-MT fork-branch)
flask (python-flask on Arch)
pandas (python-pandas on Arch)
werkzeug.utils (python-werkzeug on Arch)

You can run it with `python flask-table-test-app.py`.
(Note: you need to have installed flask and openpyxl, on Arch: `sudo pacman -S python-flask python-openpyxl`.)
This will start a webserver on http://127.0.0.1:5000 which you can visit to interact with the test page.

Eventually:
You will want to move this to the RHEL server. There you will want to use the /opt/py-geosupport-env conda environment (install flask).
You will want to move to a WSGI server (gunicorn or mod_wsgi Apache module).





