import paramiko
import os

class SSH:

    def __init__(self, host, username, password):
        self.host = host
        self.username = username
        self.password = password
        self.client = paramiko.client.SSHClient()
        self.connected = False

    def connect(self):
        try:
            self.client.load_system_host_keys()
            self.client.connect(hostname=self.host, username=self.username, password=self.password)
        except Exception as e:
            return e
        self.connected = True
        return True

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

    def download(self, path, file):
        sftp = self.client.open_sftp()
        sftp.get(file, path)
        sftp.close()

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
