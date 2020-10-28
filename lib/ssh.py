import paramiko
import os

class SSH:

    def __init__(self, host, username, password):
        self.host = host
        self.username = username
        self.password = password
        self.client = paramiko.client.SSHClient()
        self.connected = False
        self.sftp = None

    def connect(self):
        try:
            self.client.load_system_host_keys()
            self.client.connect(hostname=self.host, username=self.username, password=self.password)
            self.sftp = self.client.open_sftp()
        except Exception as e:
            return e
        self.connected = True
        return True

    def disconnect(self):
        if(self.client != None):
            self.client.close()
        if(self.sftp != None):
            self.sftp.close()

    def exec(self, command):
        stdin, stdout, stderr = self.client.exec_command(command)
        content = stdout.read()
        try:
            content = content.decode("utf8")
        except:
            pass

        if("ls" in command.split(" ")):
            content = content.split("\n")
            content.pop(len(content) - 1)
            filter(lambda a : a != "", content) #remove empty indexes

        return content

    def read_file(self, path):
        return self.exec("cat " + path)

    def write_file(self, path, content = ""):
        content = content.replace('"', '\\"')
        self.exec('echo "' + content + '" > ' + path)

    def list_directory(self, path):
        folders = self.exec("cd " + path + "; ls -d */")
        files = self.exec("cd " + path + "; ls")
        return combine_files(files, folders)

    def delete(self, path):
        self.exec("rm -r " + path)

    def upload_folders(self, location, folders):
        for folder in folders:
            filename = get_name(folder)
            mkdir = location + "/" + filename
            self.sftp.mkdir(mkdir)
            for root, dirs, files in os.walk(folder):
                for dir in dirs:
                    split = (root + "/" + dir).replace("\\", "/").split(folder)
                    split = split[len(split) - 1]
                    self.sftp.mkdir(mkdir + split)
                for file in files:
                    split = (root).replace("\\", "/").split(folder)
                    split = split[len(split) - 1]
                    self.upload(mkdir + split, root + "/" + file)

    def upload(self, location, file):
        filename = get_name(file)
        remote = location + "/" + filename
        self.sftp.put(localpath=file, remotepath=remote)

    def upload_files(self, location, files):
        for f in files:
            self.upload(location, f)

def get_name(path):
    split = path.split("/")
    filename = split[len(split) - 1]
    return filename

def remove_dash(file):
    return file[:-1]

def combine_files(files, folders):

    results = []

    for a in range(0, len(folders)):
        folders[a] = folders[a][:-1] #remove dash
        results.append({
            "type": "folder",
            "name": folders[a]
        }) #remove dash

    _files = []
    for a in range(0, len(files)):
        #Remove folders
        if(files[a] not in folders):
            results.append({
                "type": "file",
                "name": files[a]
            })

    return results
