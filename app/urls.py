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
    "/ssh/download": views.download
}
