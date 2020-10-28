let path = "/root";
let loading = false;
let selected = [];
let selectedPaths = [];
const spinner = $('<div class="spinner spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>')
const icons = {
    "folder": '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>',
    "file": '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/><path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/></svg>'
}
function update_dir(data) {

    const dir = $("#directory").empty()

    removeSelection($("#directory").find("li"), true);
    if(data.length == 0) {
        //No files to display
        dir.html('<li class="empty"><h4>Empty directory</h4></li>')
        return;
    }
    
    for(let a = 0; a < data.length; a++) {
        const file = data[a];
        const dom = buildDom(file.type, file.name);
        dir.append(dom);
    }
}

function buildDom(type, name) {
    const el = $('<li class="list-group-item" data-type="' + type + '" data-name="' + name + '"></li>')
    if(type in icons) {
        const icon = $(icons[type]).addClass("main-icon")
        el.append(icon)
    }
    el.append('<span class="text">' + name + '</span>');
    el.append('<span class="icon-right delete-btn"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/></svg></span>');
    el.append('<span class="icon-right download-btn"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></span>')
    return el
}

function update_route() {
    let split = path.split("/")
    split[0] = "/";
    split = split.filter(value => value != "")
    const el = $("#route")
    el.empty()
    for(let a = 0; a < split.length; a++) {
        let b = split[a]
        if(b == "") continue;
        const e = $('<li class="breadcrumb-item" data-id="' + (a + 1) + '"></li>')
        if(a == split.length - 1) {
            e.attr("aria-current", "page").addClass("active").text(b)
        } else {
            e.append('<a href="#">' + b + '</a>')
        }
        $("#route").append(e)
    }
}

function addLoader(el) {
    $(el).find(".main-icon").hide()
    $(el).prepend(spinner.clone())
}

function removeLoader(el) {
    el.find(".spinner").remove()
    el.find(".main-icon").show()
}

$("#directory").on("dblclick", "li", function(e) {
    e.preventDefault();
    if(loading) return;
    const type = $(this).attr("data-type");
    const name = $(this).attr("data-name");
    const el = $(this);
    addLoader($(this))
    if(type == "folder"){
        loading = true
        if(path[path.length - 1] != "/") {
            path += "/";
        }
        path += name
        request_dir(
            path,
            function(data) {
                removeLoader(el)
                el.removeClass("selected")
                update_dir(data)
                update_route()
            }
        )
    } else {
        const abs_path = path + "/" + name
        const url = "http://" + window.location.hostname + ":" + window.location.port + "/file?path=" + abs_path;
        window.open(url, "_blank");
        removeLoader(el)
    }
    
}).on("click", "li", function(e) {
    console.log(e)
    if($(this).hasClass("selected")) {
        removeSelection($(this))
        return;
    }
    if(!e.ctrlKey) {
        removeSelection($(this).parent().find("li"))
    }
    addSelection($(this))
})

$("#update").click(function() {
    const html = $(this).html()
    $(this).html(spinner)
    const el = $(this)
    request_dir(path,function(data) {
        el.html(html)
        update_dir(data)
        update_route()
    })
})

$(".breadcrumb").on("click", "li a", function() {
    const parent = $(this).parent()
    const id = parseInt(parent.attr("data-id"))
    const els = parent.parent().find("li")
    path = "/"
    if(id > 1) {
        for(let a = 1; a < els.length; a++) {
            const li = $(els[a]);
            path += li.text()
            if(a < id - 1) {
                path += "/"
            }
            if(li.attr("data-id") == id) {
                break;
            }
        }
    }
    request_dir(path, function(data) {
        update_dir(data)
        update_route()
    })
})

function request_dir(_path = "/", success = function(data){}, error = function(data){}, dpath=false) {
    $.ajax({
        type: "POST",
        url: "/ssh/get/dir",
        data: {path: _path},
        success: function(data) {
            loading = false
            success(data)
        },
        error: function(data) {
            loading = false
            error(data)
        }
    })
}

function delete_files(file, success = function(data){}, error = function(data){}) {
    $.ajax({
        type: "POST",
        url: "/ssh/delete/files",
        data: {file: file},
        success: function(data) {
            success(data)
        },
        error: function(data) {
            error(data)
        }
    })
}

function syncReq(method, url, data) {
    return $.ajax({
        type: method,
        url: url,
        data: data,
        async: false
    }).responseText;
}

function download(data=[]) {

    //Must include the type (file or folder) and the file name

    const zip = new JSZip();
    let ab_path = path; //Absolute path. Used to query ssh directories
    let _path = ""; //Used inside the zip

    const addFile = function(ab_path, _path, fileName) {
        let data = syncReq("post", "/ssh/get/file", {path:ab_path + "/" + fileName});
        let options = {}
        try {
            JSON.parse("{content: '" + data + "'}")
        } catch(e) {
            options["binary"] = true
            console.log(data)
        }
        zip.file(_path + fileName, data, options);
    }

    const addFolder = function(ab_path, _path, name) {
        ab_path += "/" + name
        _path += name + "/"
        let files = syncReq("post", "/ssh/get/dir", {path: ab_path});
        files = JSON.parse(files);
        for(let b = 0; b < files.length; b++) {
            if(files[b].type == "file") {
                addFile(ab_path, _path, files[b].name);
            } else {
                addFolder(ab_path, _path, files[b].name)
            }
        }
    }

    for(let a = 0; a < data.length; a++) {
        _path = "";
        ab_path = path;
        const file = data[a];
        if(file.type == "file") {
            addFile(ab_path, _path, file.name);
        } else if(file.type == "folder") {
            addFolder(ab_path, _path, file.name)
        }
        removeLoader($("#directory").find("li[data-name='" + file.name + "']"));
    }

    //Force download
    zip.generateAsync({type: "blob"}).then(function(content) {
        FileSaver.saveAs(content, host + ".zip");
    });
}

$("#directory").on("click", "li > .delete-btn", function(e) {
    edited = true;
    const name = $(this).parent().attr("data-name");
    const file = path + "/" + name
    delete_files(file)
    $(this).parent().remove()

}).on("click", ".download-btn", function(e) {
    const target = $(this).parent()
    addLoader(target);
    setTimeout(function() {
        //Delay to make it fancy
        download([{
            "type": target.attr("data-type"),
            "name": target.attr("data-name")
        }])
    }, 500);
})

$("#delete").click(function() {
    let files = "";
    for(let a = 0; a < selected.length; a++) {
        const dom = selected[a]
        files += path + "/" + dom.attr("data-name") + " "
        dom.remove()
    }
    files = files.replace(/ /g, "%20")
    delete_files(files);
})
$("#download").click(function() {
    const list = []
    for(let a = 0; a < selected.length; a++) {
        const dom = selected[a];
        addLoader(dom);
        list.push({
            "type": dom.attr("data-type"),
            "name": dom.attr("data-name")
        })
    }
    setTimeout(function() {
        download(list);
    }, 500);
})
$(document).click(function(e) {
    const target = $(e.target)
    const parents = target.parents(".list-group-item")
    if(!target.hasClass("list-group-item") && parents.length == 0) {
        removeSelection($("#directory li"), true)
    }
})

function addSelection(dom) {
    $(dom).addClass("selected")
    selected.push($(dom));
    selectedPaths.push(path + "/" + $(dom).attr("data-name"));
    $("#delete").show();
    $("#download").show();
}

function removeSelection(dom, all = false) {
    $(dom).removeClass("selected");
    if(all) {
        selected = []
        selectedPaths = []
    } else {
        const index = selectedPaths.indexOf(path + "/" + $(dom).attr("data-name"));
        if(index > -1 && !all) {
            selected.splice(index, 1);
            selectedPaths.splice(index, 1);
        }
    }
    if(selected.length == 0) {
        $("#delete").hide();
        $("#download").hide();
    }
}
const read_file = (file, callback) => {
    $.ajax({
        type: "POST",
        url: "/ssh/get/file",
        data: {path:file},
        success: function(data) {
            let content = data
            try {
                content = JSON.parse(content)
            } catch(e) {
                
            }
            if(callback && typeof callback == "function") callback(content);
        }
    })
    return false
}

$("#upload, #upload-folder").click(function() {
    let endpoint = "/upload_files"
    if($(this).text().toLowerCase().includes("folder")) {
        endpoint = "/upload_folder"
    }
    const targetButton = $(this)
    const btnHtml = targetButton.html()
    targetButton.html(spinner)
    $.ajax({
        type: "post",
        data: {
            path: path
        },
        url: endpoint,
        success: function() {
            request_dir(path, (data) => {
                update_dir(data)
                targetButton.html(btnHtml)
            })
        },
        error: function() {
            targetButton.html(btnHtml)
        }
    })
})