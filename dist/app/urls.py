from . import views

paths = {
    "/": views.index,
    "/ssh/connect": views.ssh_connect,
    "/ssh/close": views.ssh_close,
    "/server": views.server,
    "/ssh/get/dir": views.list_directory,
    "/ssh/delete/files": views.delete_files,
    "/file": views.view_file,
    "/ssh/get/file": views.read_file,
    "/ssh/write/file": views.write_file,
    "/ssh/download": views.download,
    "/upload_files": views.upload_files,
    "/upload_folder": views.upload_folder,
    "/ssh/rename": views.rename,
    "/create/file": views.create_file,
    "/create/folder": views.create_folder,
    "/shell": views.shell,
    "/exec": views.exec,
    "/resource/js/app.js": views.appjs #To use render variabled
}
