import os
from jinja2 import Template
import json
import tkinter as tk
from tkinter import filedialog

def response(content = "", status = 200, content_type = "text/html"):
    if("json" in content_type):
        content = json.dumps(content)
    return {
        "headers": {
            "Content-type": content_type
        },
        "status": status,
        "data": content
    }

def redirect(url):
    return {
        "headers": {
            "location": url
        },
        "status": 307,
        "data": ""
    }

__image_formats = ["png", "jpg", "jpeg", "webp", "gif"]

def render(file, data = {}):
    extension = file.split(".")[-1].lower()
    content_type = "text/html"
    if(extension == "css"):
        content_type = "text/css"
    elif(extension == "js"):
        content_type = "text/javascript"
    elif(extension == "ico"):
        content_type = "image/vnd.microsoft.ico"
    elif(extension == "json"):
        content_type == "application/json"
    elif(extension in __image_formats):
        content_type == "image/" + extension

    if(file[0] != "/"):
        file = "/" + file
    path = file

    #Make absolute path to the file
    if(extension == "html"):
        path = os.getcwd() + "/app/resource/html" + file
    else:
        path = os.getcwd() + "/app" + file
    
    status = 200
    try:
        with open(path, 'rb') as f:
            content = f.read()
            f.close()

        tm = Template(content.decode("utf8"))
        content = tm.render(data=data)
    except Exception as e:
        print(file + ": " + str(e))
        content = ""
        status = 404

    return {
        "headers": {
            "Content-type": content_type
        },
        "status": status,
        "data": content
    }

def is_bytes(data):
    try:
        data = data.encode()
        return False
    except(UnicodeDecodeError, AttributeError):
        #Bytes like object (images). Can't be encoded
        pass
    return True

def select_files(folder = False):
    # Make a top-level instance and hide since it is ugly and big.
    root = tk.Tk()
    root.withdraw()

    # Make it almost invisible - no decorations, 0 size, top left corner.
    #root.overrideredirect(True)
    root.geometry('0x0+0+0')

    # Show window again and lift it to top so it can get focus,
    # otherwise dialogs will end up behind the terminal.
    root.deiconify()
    root.lift()
    filenames = None
    if(folder == True):
        filenames = filedialog.askdirectory(parent=root)
        if(filenames):
            filenames = (filenames,)
    else:
        filenames = filedialog.askopenfilenames(parent=root) # Or some other dialog

    # Get rid of the top-level instance once to make it actually invisible.
    root.destroy()
    
    if(filenames == None):
        return tuple()

    return {
        "folders": folder,
        "selected": filenames
    }
