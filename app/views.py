from lib.shortcuts import render, redirect, response, is_bytes, select_files
import lib.ssh as ssh
from urllib.parse import unquote

client = None
def index(request):
    global client
    if(client != None and client.connected):
        return redirect("/server")
    return render("index.html")

def ssh_connect(data):
    if(data["method"] != "POST"):
        return response(status=404)

    global client
    client = ssh.SSH(
        host = data["body"]["host"],
        username = data["body"]["username"],
        password = data["body"]["password"]
    )
    connect = client.connect()
    if(connect == True):
        return response("true")
    return response(str(connect))

def ssh_close(request):
    global client
    if(client != None and client.connected):
        client.disconnect()
        client = None
    return redirect("/")

def list_directory(request):
    global client
    if(request["method"] != "POST" or client == None or client.connected != True):
        return response("false")

    abs_path = request["body"]["path"]

    files = client.list_directory(abs_path)
    return response(files, content_type="application/json")

def delete_files(request):
    global client
    if(client != None and client.connected):
        res = client.delete(request["body"]["file"])
        return response("true")
    else:
        return response("false")

def view_file(request):
    global client
    if(client != None and client.connected):
        return render("file.html", {
            "host": client.host,
            "content": client.read_file(request["query"]["path"]).replace("<", "&lt;"),
            "path": request["query"]["path"]
        })
    else:
        return redirect("/")

def read_file(request):
    global client
    if(client != None and client.connected):
        content = client.read_file(request["body"]["path"])
        return response(str(content))
    return response(status=404)

def write_file(request):
    global client
    if(client != None and client.connected):
        client.write_file(request["body"]["path"], request["body"]["content"])
        return response("true")
    return response(status=404)

def download(request):
    global client
    if(client != None and client.connected):
        client.download("app.js", request["body"]["file"])
        return response()
    return response(status=404)

def upload_files(request):
    return upload(request)

def upload_folder(request):
    return upload(request, True)

def upload(request, folder=False):
    global client
    if(client != None and client.connected):
        files = select_files(folder=folder)
        location = request["body"]["path"]
        if(type(files["selected"]) == tuple and len(files["selected"]) > 0):
            if(files["folders"]):
                client.upload_folders(location, files["selected"])
            else:
                client.upload_files(location, files["selected"])
        return response()
    return response(status=404)

def server(request):
    global client
    if(client != None and client.connected):
        #List files
        folders = client.exec("ls -d */")
        for a in range(0, len(folders)):
            folders[a] = folders[a][:-1]

        _files = client.exec("ls")
        files = []
        for a in range(0, len(_files)):
            #Remove folders
            if(_files[a] not in folders):
                files.append(_files[a])

        return render("server.html", {
            "host": client.host,
            "user": client.username,
            "folders": folders,
            "files": files
        })
    else:
        return redirect("/")
    
    