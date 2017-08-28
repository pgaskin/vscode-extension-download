// DownloadVSIX 2.0
(function DownloadVSIX () {
    var metadata = {
        version: "",
        publisher: "",
        identifier: "",
        getDownloadUrl: function() {
            return [
                'https://',
                this.identifier.split(".")[0],
                '.gallery.vsassets.io/_apis/public/gallery/publisher/',
                this.identifier.split(".")[0],
                '/extension/',
                this.identifier.split(".")[1],
                '/',
                this.version,
                '/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage'
            ].join("");
        },
        getFileName: function() {
            return [
                this.identifier,
                '_',
                this.version,
                '.vsix'
            ].join("");
        },
        getDownloadButton: function() {
            var a = document.createElement("a");
            a.innerHTML = "Download VSIX";
            a.href = "javascript:void(0);";
            a.style.fontFamily = "wf_segoe-ui,Helvetica Neue,Helvetica,Arial,Verdana";
            a.style.display = "inline-block";
            a.style.padding = "2px 5px";
            a.style.background = "darkgreen";
            a.style.color = "white";
            a.style.fontWeight = "bold";
            a.style.margin = "2px 5px";
            a.setAttribute("data-url", this.getDownloadUrl());
            a.setAttribute("data-filename", this.getFileName());
            a.onclick = function(event) {
                event.target.onclick = null;
                event.target.innerHTML = "Downloading VSIX...";
                var xhr = new XMLHttpRequest();
                console.log(event.target.getAttribute("data-url"));
                xhr.open('GET', event.target.getAttribute("data-url"), true);

                xhr.responseType = 'blob';

                xhr.onprogress = function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        event.target.innerHTML = "Downloading VSIX..." + percentComplete.toString() + "%";
                    }
                }

                xhr.onload = function(e) {
                    if (this.status == 200) {
                        var blob = this.response;
                        var l = document.createElement("a");
                        l.href = window.URL.createObjectURL(blob);
                        l.download = event.target.getAttribute("data-filename");
                        l.click();
                        event.target.href = l.href;
                        event.target.download = l.download;
                        event.target.innerHTML = "Download VSIX";
                    } else {
                        event.target.innerHTML = "Error. Please reload the page amd try again.";
                        alert("Error " + this.status + " error receiving the document.");
                    }
                };

                xhr.onerror = function(e) {
                    event.target.innerHTML = "Error. Please reload the page amd try again.";
                    alert("Error " + e.target.status + " occurred while receiving the document. ");
                };

                xhr.send();
            };
            return a;
        }
    };
    var columnMetaMap = {
        "Version": "version",
        "Publisher": "publisher",
        "Unique Identifier": "identifier"
    };
    var rows = document.querySelectorAll(".ux-table-metadata tr");
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var columns = row.querySelectorAll("td");
        if (columns.length == 2) {
            var key = columns[0].innerText.replace(/^\s+|\s+$/g, '');
            var value = columns[1].innerText.replace(/^\s+|\s+$/g, '');
            if (columnMetaMap.hasOwnProperty(key)) {
                metadata[columnMetaMap[key]] = value;
            }
        }
    }

    document.querySelector(".vscode-moreinformation").parentElement.appendChild(metadata.getDownloadButton()).scrollIntoView();
    return metadata;
})();
