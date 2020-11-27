let path = '{{ data["dir"] }}';
console.log(path);
let loading = false;
let selected = [];
let selectedPaths = [];
const spinner = $('<div class="spinner spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>')
const icons = {
    "folder": '<svg class="main-icon" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>',
    "file": '<svg class="main-icon" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/><path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/></svg>'
}
function update_dir(data) {

    const dir = $("#directory").empty()

    remove_selection($("#directory").find("li"), true);
    if(data.length == 0) {
        //No files to display
        dir.html('<li class="empty"><h4>Empty directory</h4></li>')
        return;
    }
    
    for(let a = 0; a < data.length; a++) {
        const file = data[a];
        const dom = build_dom(file.type, file.name);
        dir.append(dom);
    }
}

function build_dom(type, name) {
    const el = $('<li class="list-group-item interactive" data-type="' + type + '" data-name="' + name + '"></li>')
    if(type in icons) {
        const icon = $(icons[type]).addClass("main-icon")
        el.append(icon)
    }
    el.append('<span class="text">' + name + '</span>');
    el.append('<input type="text" value="' + name + '">')
    el.append('<span class="icon-right delete-btn"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/></svg></span>');
    el.append('<span class="icon-right download-btn"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></span>')
    el.append('<span class="icon-right rename-btn"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg</span>')
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
    $("title").text(host + ":" + path);
}
update_route()

function add_loader(el) {
    $(el).find(".main-icon").hide()
    $(el).prepend(spinner.clone())
}

function remove_loader(el) {
    el.find(".spinner").remove()
    el.find(".main-icon").show()
}

$("#directory").on("dblclick", "li.interactive", function(e) {
    e.preventDefault();
    if(loading) return;
    const type = $(this).attr("data-type");
    const name = $(this).attr("data-name");
    const el = $(this);
    add_loader($(this))
    if(type == "folder"){
        loading = true
        if(path[path.length - 1] != "/") {
            path += "/";
        }
        path += name
        request_dir(
            path,
            function(data) {
                remove_loader(el)
                el.removeClass("selected")
                update_dir(data)
                update_route()
            }
        )
    } else {
        const abs_path = path + "/" + name
        const url = "http://" + window.location.hostname + ":" + window.location.port + "/file?path=" + abs_path;
        window.open(url, "_blank");
        remove_loader(el)
    }
    
}).on("click", "li.interactive", function(e) {
    remove_fileinput()
    if(e.target.tagName == "SPAN" || $(e.target).parents(".icon-right").length > 0) {
        //Icons
        return
    }
    if($(this).hasClass("selected")) {
        remove_selection($(this))
        return;
    }
    if(!e.ctrlKey) {
        remove_selection($(this).parent().find("li"))
    }
    add_selection($(this))
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
        remove_loader($("#directory").find("li[data-name='" + file.name + "']"));
    }

    //Force download
    zip.generateAsync({type: "blob"}).then(function(content) {
        FileSaver.saveAs(content, host + ".zip");
    });
}

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
        add_loader(dom);
        list.push({
            "type": dom.attr("data-type"),
            "name": dom.attr("data-name")
        })
    }
    setTimeout(function() {
        download(list);
    }, 500);
})
function remove_fileinput() {
    const a = $("#directory li.file-input");
    if(a && !a.hasClass("loading")) {
        a.remove();
    }
}
$(document).click(function(e) {
    const target = $(e.target)
    const parents = target.parents(".list-group-item")
    if((!target.hasClass("list-group-item") && parents.length == 0)) {
        remove_selection($("#directory li"), true)
        if(!target.is("#new-folder") && !target.is("#new-file")) {
            remove_fileinput();
        }
    }
})

function rename(location, original, updated, callback) {
    $.ajax({
        url: "/ssh/rename",
        type: "post",
        data: {
            path: location,
            original: original,
            updated: updated
        }, success: function() {
            if(callback && typeof callback == "function") callback();
        }
    })
}

function disable_editing() {
    const lis = $("#directory li")
    lis.removeClass("editing").addClass("interactive")
    for(let a = 0; a < lis.length; a++) {
        const li = $(lis[a]);
        li.find("input").val(li.attr("data-name"));
    }
}

function add_selection(dom) {
    $(dom).addClass("selected")
    selected.push($(dom));
    selectedPaths.push(path + "/" + $(dom).attr("data-name"));
    $("#delete").show();
    $("#download").show();
    disable_editing()
}

function remove_selection(dom, all = false) {
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

$("#directory").on("click", "li > .delete-btn", function(e) {
    edited = true;
    const name = $(this).parent().attr("data-name");
    const file = path + "/" + name
    delete_files(file)
    remove_selection($("#directory li"), true)
    $(this).parent().remove()

}).on("click", ".download-btn", function(e) {
    const target = $(this).parent()
    add_loader(target);
    setTimeout(function() {
        //Delay to make it fancy
        download([{
            "type": target.attr("data-type"),
            "name": target.attr("data-name")
        }])
    }, 500);
}).on("click", ".rename-btn", function() {
    disable_editing()
    $(this).parent().addClass("editing").removeClass("interactive");
    $(this).parent().find("input").select();
    remove_selection($("#directory li"), true)
}).on("keypress", "li.editing:not(.file-input) > input", function(e) {
    if(e.keyCode != 13) {
        //Not a enter key
        return;
    }
    const target = $(this).parent();
    const old = target.attr("data-name");
    const updated = $(this).val();
    add_loader(target)
    rename(path, old, updated, function() {
        request_dir(path, function(data) {
            update_dir(data)
        })
    })
}).on("keypress", "li.file-input input", function(e) {
    if(e.keyCode != 13) return;
    const value = $.trim($(this).val())
    const type = $(this).attr("data-type");
    if(!value) return;
    const lis = $("#directory > li.interactive");
    let conf = false;
    const parent = $(this).parent()
    for(let a = 0; a < lis.length; a++) {
        let li = lis[a];
        let name = $(li).attr("data-name")
        if(name.toLowerCase() == value.toLowerCase()) {
            conf = true;
            break;
        }
    }
    if(conf) {
        let conf_res = confirm("The " + type + " already exists. Do you want to overwrite it?")
        if(!conf_res) {
            remove_fileinput();
            return;
        }
    }
    parent.addClass("loading");
    add_loader(parent);
    create_object(type, path, value, function() {
        request_dir(path, function(data) {
            remove_loader(parent)
            update_dir(data)
        })
    })
})

function create_object(type, location, name, callback = null) {
    let endpoint = "/create/file";
    if(type == true || type == "folder") {
        endpoint = "/create/folder"
    }
    $.ajax({
        type: "post",
        url: endpoint,
        data: {
            location: location,
            name: name
        },
        success: function() {
            if(callback != null && typeof callback == "function") {
                callback();
            }
        }
    })
}

$("#new-file, #new-folder").on("click", function() {
    remove_fileinput();
    let type = "file";
    const input = $('<li class="list-group-item editing file-input"></li>')
    let en = null;
    if($(this).text().toLowerCase().includes("folder")) {
        type = "folder"
        input.append($(icons["folder"]))
        en = $("<input type='text' placeholder='Folder name' id='create-object' data-type='folder'>");
    } else {
        input.append(icons["file"])
        en = $("<input type='text' placeholder='File name' data-type='file'>");
    }
    input.append(en)
    $("#directory").prepend(input);
    en.select();
})