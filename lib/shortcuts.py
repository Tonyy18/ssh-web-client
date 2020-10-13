import os
from jinja2 import Template
import json

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
        if(extension == "html"):
            tm = Template(content.decode("utf8"))
            content = tm.render(data=data)
    except Exception as e:
        content = ""
        status = 404

    return {
        "headers": {
            "Content-type": content_type
        },
        "status": status,
        "data": content
    }