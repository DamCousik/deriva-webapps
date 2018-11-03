define(["jstree", "jstreegrid", "jquery-ui"], function(jstree, jstreegrid) {
    $(document).ready(function() {
      $("#number").selectmenu().selectmenu("menuWidget").addClass("overflow");
      document.getElementById('TSDropdownDiv').style.visibility = "visible";
      document.getElementById('mainDiv').style.visibility = "visible";
        var offset = 250;

        var duration = 300;

        $(".tree-panel").scroll(function() {
            if ($(this).scrollTop() > offset) {
                $(".back-to-top").fadeIn(duration);
            } else {
                $(".back-to-top").fadeOut(duration);
            }
        });
        $(".back-to-top").click(function(event) {
            event.preventDefault();
            $("html, .tree-panel").animate({
                scrollTop: 0
            }, duration);
            return false;
        })
        var TSDataURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attributegroup/M:=Vocabulary:Developmental_Stage/stage:=left(Stage_Type)=(Vocabulary:Stage_Type:id)/name=Theiler%20Stage/M:Ordinal,M:description@sort(Ordinal)'
        var $el = $("#number");
        $el.empty(); // remove old options
        $.getJSON(TSDataURL, function(TSData) {
            $.each(TSData, function(index, data) {
                $el.append($("<option></option>")
                    .attr("value", data['Ordinal']).text(data['description']));
            });
            $el.append($("<option></option>")
                .attr("value", "All").text("All Theiler Stages"));
            $('#number').val('28');
            $("#number").selectmenu("refresh");
            // buildPresentationData(showAnnotation, filter_prefix, '28')
            $("#number").on('selectmenuchange', function() {
                document.getElementsByClassName('loader')[0].style.display = "block";
                document.getElementById('jstree').style.visibility = "hidden";
                $("#number").prop("disabled", true);
                $('#plugins4_q').prop("disabled", true);
                $("#search_btn").prop("disabled", true);
                $("#expand_all_btn").prop("disabled", true);
                $("#collapse_all_btn").prop("disabled", true);
                $("#reset_text").prop("disabled", true);

                var TS_ordinal = $("#number").val()
                buildPresentationData(showAnnotation, filter_prefix, TS_ordinal)
            })
        })
        $("#reset_text").click(function() {
            document.getElementById('plugins4_q').value = "";
            $("#jstree").jstree('clear_search');
            $("#jstree").jstree('close_all');
        })

        $("#search_btn").click(function() {
            var v = $('#plugins4_q').val();
            $('#jstree').jstree(true).search(v);
        })
        $("#expand_all_btn").click(function() {
            document.getElementsByClassName('loader')[0].style.display = "visible";
            document.getElementById('jstree').style.visibility = "none";
            $("#number").prop("disabled", true);
            $('#plugins4_q').prop("disabled", true);
            $("#search_btn").prop("disabled", true);
            $("#expand_all_btn").prop("disabled", true);
            $("#collapse_all_btn").prop("disabled", true);
            $("#reset_text").prop("disabled", true);
            $("#jstree").jstree('open_all');
        })
        $("#collapse_all_btn").click(function() {
            document.getElementsByClassName('loader')[0].style.display = "visible";
            document.getElementById('jstree').style.visibility = "none";
            $("#number").prop("disabled", true);
            $('#plugins4_q').prop("disabled", true);
            $("#search_btn").prop("disabled", true);
            $("#expand_all_btn").prop("disabled", true);
            $("#collapse_all_btn").prop("disabled", true);
            $("#reset_text").prop("disabled", true);
            $("#jstree").jstree('close_all');
        })
        $(".form-control-feedback span").click(function() {
            document.getElementById('plugins4_q').value = "";
            $("#jstree").jstree('clear_search');
            $("#jstree").jstree('close_all');
        })
        var location = window.location.href;
        var JSONData, showAnnotation, filter_prefix, isCacheEnabled, cacheData;
        if (location.indexOf("prefix_filter=") !== -1) {
            var prefix_filter_value = findGetParameter('prefix_filter')
            filter_prefix = prefix_filter_value;
        } else {
            filter_prefix = "";
        }
        if (location.indexOf("specimen_rid=") !== -1) {
            var specimen_rid = findGetParameter('specimen_rid')
            showAnnotation = true;
        } else {
            showAnnotation = false;
        }
        //if (location.indexOf("refresh_tree=true") !== -1) //{
            var TS_ordinal = "28"
            buildPresentationData(showAnnotation, filter_prefix, TS_ordinal)
        // } else {
        //     $("#number").prop("disabled", true);
        //     $.getJSON("cache/tree_data.json", function(treeData) {
        //         setAnnotationAndFilter(treeData, showAnnotation, specimen_rid, filter_prefix)
        //     });
        // }
        if (showAnnotation == false) {
            // $("#left").hide();
            // $("#right").css('margin-left', '10px');
            $(".tree-panel").css('width', '99.5%');
            $("#left").removeClass("col-md-2 col-lg-2 col-sm-2 col-2");
            $("#right").removeClass("col-md-10 col-lg-10 col-sm-10 col-10");
            $("#right").addClass("col-md-12 col-lg-12 col-sm-12 col-12");
        }

        function checkIfSearchItemExists() {
            $("#jstree").jstree('close_all');
            if ($('#plugins4_q').val() !== '') {
                var v = $('#plugins4_q').val();
                $('#jstree').jstree(true).search(v);
            }
        }

        function buildTreeAndAssignEvents(presentationData) {
            tree = $("div#jstree").jstree({
                    plugins: ["themes", "json", "grid", "search", "sort"],
                    core: {
                        data: presentationData,
                        "themes": {
                            "icons": false
                        }
                    },
                    grid: {
                        columns: [{
                            width: 1000
                        }]
                    },
                    search: {
                        show_only_matches: false,
                        show_only_matches_children: false,
                        close_opened_onclear: true
                    },
                    sort: function(a, b) {
                        return this.get_text(a) > this.get_text(b) ? 1 : -1;
                    }
                })
                .on('search.jstree', function(e, data) {
                    if (data.nodes.length) {
                        e.preventDefault()
                        setTimeout(function() {
                            $('#jstree').jstree(true).get_node(data.nodes[0].id, true).children('.jstree-anchor').get(0).scrollIntoView();
                        }, 100);
                    }
                })
                .on('refresh.jstree', function() {
                    checkIfSearchItemExists()
                })
                .on('open_all.jstree', function() {
                    setTimeout(function() {
                        $("#number").prop("disabled", false);
                        $('#plugins4_q').prop("disabled", false);
                        $("#search_btn").prop("disabled", false);
                        $("#expand_all_btn").prop("disabled", false);
                        $("#collapse_all_btn").prop("disabled", false);
                        $("#reset_text").prop("disabled", false);
                        document.getElementsByClassName('loader')[0].style.display = "none";
                        document.getElementById('jstree').style.visibility = "visible";
                    }, 100);
                })
                .on('close_all.jstree', function() {
                    setTimeout(function() {
                        $("#number").prop("disabled", false);
                        $('#plugins4_q').prop("disabled", false);
                        $("#search_btn").prop("disabled", false);
                        $("#expand_all_btn").prop("disabled", false);
                        $("#collapse_all_btn").prop("disabled", false);
                        $("#reset_text").prop("disabled", false);
                        document.getElementsByClassName('loader')[0].style.display = "none";
                        document.getElementById('jstree').style.visibility = "visible";
                    }, 100);
                });
            // .on('open_node.jstree', function (e, data) {
            //   setTimeout(function(){
            //     $('#jstree').jstree(true).get_node(data.node.id, true).children('.jstree-anchor').get(0).scrollIntoView();
            //   },100);
            // })
            document.getElementsByClassName('loader')[0].style.display = "none";
            document.getElementById('jstree').style.visibility = "visible";
            $("#number").prop("disabled", false);
            $('#plugins4_q').prop("disabled", false);
            $("#search_btn").prop("disabled", false);
            $("#expand_all_btn").prop("disabled", false);
            $("#collapse_all_btn").prop("disabled", false);
            $("#reset_text").prop("disabled", false);

            $("a#change").click(function() {
                var tree = $("div#jstree").jstree(),
                    nodename = tree.get_node("#").children[0],
                    node = tree.get_node(nodename),
                    val = parseInt(node.data.size);

                node.data.size = node.data.size * 2;
                tree.trigger("change_node.jstree", nodename);

                return (false);
            });
        }

        function buildPresentationData(showAnnotation, prefixVal, TS_val) {
            var presentationData = [];
            // Returns json - Query 1 : https://dev.rebuildingakidney.org/ermrest/catalog/2/attribute/M:=Vocabulary:Anatomy_Part_Of/F1:=left(subject_dbxref)=(Anatomy_terms:dbxref)/$M/F2:=left(object_dbxref)=(Anatomy_terms:dbxref)/$M/subject_dbxref:=M:subject_dbxref,object_dbxref,subject:=F1:name,object:=F2:name
            // Returns extraAttributes - Query 2 : https://dev.rebuildingakidney.org/ermrest/catalog/2/attribute/M:=Gene_Expression:Specimen_Expression/RID=Q-PQ16/$M/RID:=M:RID,Region:=M:Region,strength:=M:Strength,pattern:=M:Pattern,density:=M:Density,densityChange:=M:Density_Direction,densityNote:=M:Density_Note
            // Returns isolated nodes - Query 3 : https://dev.rebuildingakidney.org/ermrest/catalog/2/attribute/t:=Vocabulary:Anatomy_terms/s:=left(dbxref)=(Vocabulary:Anatomy_Part_Of:subject_dbxref)/subject_dbxref::null::/$t/o:=left(dbxref)=(Vocabulary:Anatomy_Part_Of:object_dbxref)/object_dbxref::null::/$t/dbxref:=t:dbxref,name:=t:name
            if (TS_val != "" && TS_val != "All") {
                var json;
                var treeDataURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attribute/M:=Vocabulary:Anatomy_Part_Of_Relationship/F1:=left(Subject)=(Vocabulary:Anatomy:id)/Subject_Starts_at_Ordinal:=left(Starts_At)=(Vocabulary:Developmental_Stage:name)/Ordinal::leq::' + TS_val + '/$F1/Subject_Ends_At_Ordinal:=left(Ends_At)=(Vocabulary:Developmental_Stage:name)/Ordinal::geq::' + TS_val + '/$M/F2:=left(Object)=(Vocabulary:Anatomy:id)/Object_Starts_at_Ordinal:=left(Starts_At)=(Vocabulary:Developmental_Stage:name)/Ordinal::leq::' + TS_val + '/$F2/Object_Ends_At_Ordinal:=left(Ends_At)=(Vocabulary:Developmental_Stage:name)/Ordinal::geq::' + TS_val + '/$M/subject_dbxref:=M:Subject,object_dbxref:=M:Object,subject:=F1:name,object:=F2:name'

                $.getJSON(treeDataURL, function(data) {
                    json = data
                }).done(function() {
                    forest = processData(json, [], showAnnotation, [], prefixVal);
                    var presentationData = [];
                    for (var g = 0; g < forest.trees.length; g++)
                        presentationData.push(forest.trees[g].node);
                    var finalData = buildTree(presentationData);
                    console.log("**END**");
                    if ($('#jstree').jstree(true) == false) {
                        buildTreeAndAssignEvents(finalData)
                    } else {
                        $('#jstree').jstree(true).settings.core.data = finalData;
                        $('#jstree').jstree(true).refresh();
                        document.getElementsByClassName('loader')[0].style.display = "none";
                        document.getElementById('jstree').style.visibility = "visible";
                        $("#number").prop("disabled", false);
                        $('#plugins4_q').prop("disabled", false);
                        $("#search_btn").prop("disabled", false);
                        $("#expand_all_btn").prop("disabled", false);
                        $("#collapse_all_btn").prop("disabled", false);
                        $("#reset_text").prop("disabled", false);
                    }
                });
            } else {
                var treeDataURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attribute/M:=Vocabulary:Anatomy_Part_Of_Relationship/F1:=left(Subject)=(Vocabulary:Anatomy:id)/$M/F2:=left(Object)=(Vocabulary:Anatomy:id)/$M/subject_dbxref:=M:Subject,object_dbxref:=M:Object,subject:=F1:name,object:=F2:name';
                var extraAttributesURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attribute/M:=Gene_Expression:Specimen_Expression/RID=Q-PQ16/$M/RID:=M:RID,Region:=M:Region,strength:=M:Strength,pattern:=M:Pattern,density:=M:Density,densityChange:=M:Density_Direction,densityNote:=M:Density_Note';
                var isolatedNodesURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attribute/t:=Vocabulary:Anatomy/s:=left(id)=(Vocabulary:Anatomy_Part_Of_Relationship:Subject)/Subject::null::/$t/o:=left(id)=(Vocabulary:Anatomy_Part_Of_Relationship:Object)/Object::null::/$t/dbxref:=t:id,name:=t:name';
                var json = [],
                    extraAttributes, isolatedNodes;
                $.getJSON(treeDataURL, function(data) {
                    json = data
                }).done(function() {
                    $.getJSON(isolatedNodesURL, function(data) {
                        isolatedNodes = data
                    }).done(function() {
                        $.getJSON(extraAttributesURL, function(data) {
                            extraAttributes = data
                        }).done(function() {
                            var Region = extraAttributes[0].Region;
                            forest = processData(json, extraAttributes[0], showAnnotation, isolatedNodes, prefixVal);
                            var presentationData = [];
                            for (var g = 0; g < forest.trees.length; g++)
                                presentationData.push(forest.trees[g].node);
                            var finalData = buildTree(presentationData);
                            console.log("**END**");
                            if (TS_val == "All") {
                                $('#jstree').jstree(true).settings.core.data = finalData;
                                $('#jstree').jstree(true).refresh();
                                document.getElementsByClassName('loader')[0].style.display = "none";
                                document.getElementById('jstree').style.visibility = "visible";
                                $("#number").prop("disabled", false);
                                $('#plugins4_q').prop("disabled", false);
                                $("#search_btn").prop("disabled", false);
                                $("#expand_all_btn").prop("disabled", false);
                                $("#collapse_all_btn").prop("disabled", false);
                                $("#reset_text").prop("disabled", false);
                            } else {
                                buildTreeAndAssignEvents(finalData)
                            }
                        })
                    })
                });
            }
        }

        function setAnnotationAndFilter(treeData, showAnnotation, specimen_rid, prefixVal) {
            if (prefixVal != '') {
                tree_data = []
                tree_data = treeData.filter(function(node) {
                    if (node.dbxref.startsWith(prefixVal) == false)
                        return node
                })
                treeData = tree_data
            }
            if (showAnnotation == true) {
                var extraAttributes;
                var extraAttributesURL = 'https://'+window.location.hostname+'/ermrest/catalog/2/attribute/M:=Gene_Expression:Specimen_Expression/RID=' + specimen_rid + '/$M/RID:=M:RID,Region:=M:Region,strength:=M:Strength,pattern:=M:Pattern,density:=M:Density,densityChange:=M:Density_Direction,densityNote:=M:Density_Note';
                $.getJSON(extraAttributesURL, function(data) {
                    extraAttributes = data
                }).done(function() {
                    var densityIcon = getDensityIcon(extraAttributes[0].density),
                        densityChangeIcon = getDensityChangeIcon(extraAttributes[0].densityChange),
                        densityNoteIcon = getDensityNoteIcon(extraAttributes[0].densityNote),
                        densityNote = extraAttributes[0].densityNote,
                        patternIcon = getPatternIcon(extraAttributes[0].pattern),
                        strengthIcon = getStrengthIcon(extraAttributes[0].strength),
                        densityImgSrc = densityIcon != '' ? "<img src=" + densityIcon + "></img>" : "",
                        patternImgSrc = patternIcon != '' ? "<img src=" + patternIcon + "></img>" : "",
                        strengthImgSrc = strengthIcon != '' ? "<img src=" + strengthIcon + "></img>" : "",
                        densityChangeImgSrc = densityChangeIcon != '' ? "<img src=" + densityChangeIcon + "></img>" : "",
                        densityNoteImgSrc = densityNote != '' && densityNote != null ? "<img src=" + densityNoteIcon + " title='" + densityNote + "'></img>" : "";
                    treeData.forEach(function(node) {
                        if (node.dbxref == extraAttributes[0].Region) {
                            node.text = "<span>" + strengthImgSrc + "<span>" + node.text + "</span>" + densityImgSrc + patternImgSrc + densityChangeImgSrc + densityNoteImgSrc + "</span>"
                        }
                    });
                    buildTreeAndAssignEvents(treeData)
                });
            } else {
                buildTreeAndAssignEvents(treeData)
            }
        }

        function removeParent(presentationData) {

            if (presentationData.children.length == 0) {
                presentationData['type'] = 'file';
            }
            for (var c = 0; c < presentationData.children.length; c++) {
                presentationData['type'] = 'folder';
                removeParent(presentationData.children[c]);
            }
            delete presentationData.parent;
        }

        function buildTree(presentationData) {
            for (var z = 0; z < presentationData.length; z++) {
                removeParent(presentationData[z]);
            }
            return presentationData;
        }

        function processData(data, extraAttributes, showAnnotation, isolatedNodes, prefixVal) {
            var subjectText = data[0].subject,
                objectText = data[0].object;
            if (showAnnotation && data[0].object_dbxref == extraAttributes.Region) {
                var densityIcon = getDensityIcon(extraAttributes.density),
                    densityChangeIcon = getDensityChangeIcon(extraAttributes.densityChange),
                    densityNoteIcon = getDensityNoteIcon(extraAttributes.densityNote),
                    densityNote = extraAttributes.densityNote,
                    patternIcon = getPatternIcon(extraAttributes.pattern),
                    strengthIcon = getStrengthIcon(extraAttributes.strength),
                    densityImgSrc = densityIcon != '' ? "<img src=" + densityIcon + "></img>" : "",
                    patternImgSrc = patternIcon != '' ? "<img src=" + patternIcon + "></img>" : "",
                    strengthImgSrc = strengthIcon != '' ? "<img src=" + strengthIcon + "></img>" : "",
                    densityChangeImgSrc = densityChangeIcon != '' ? "<img src=" + densityChangeIcon + "></img>" : "",
                    densityNoteImgSrc = densityNote != '' && densityNote != null ? "<img src=" + densityNoteIcon + " title='" + densityNote + "'></img>" : ""
                objectColumnData = "<span>" + strengthImgSrc + "<span>" + objectText + "</span>" + densityImgSrc + patternImgSrc + densityChangeImgSrc + densityNoteImgSrc + "</span>"
            } else {
                objectColumnData = "<span>" + objectText + "</span>"
            }
            if (showAnnotation && data[0].subject_dbxref == extraAttributes.Region) {
                var densityIcon = getDensityIcon(extraAttributes.density),
                    densityChangeIcon = getDensityChangeIcon(extraAttributes.densityChange),
                    densityNoteIcon = getDensityNoteIcon(extraAttributes.densityNote),
                    densityNote = extraAttributes.densityNote,
                    patternIcon = getPatternIcon(extraAttributes.pattern),
                    strengthIcon = getStrengthIcon(extraAttributes.strength),
                    densityImgSrc = densityIcon != '' ? "<img src=" + densityIcon + "></img>" : "",
                    patternImgSrc = patternIcon != '' ? "<img src=" + patternIcon + "></img>" : "",
                    strengthImgSrc = strengthIcon != '' ? "<img src=" + strengthIcon + "></img>" : "",
                    densityChangeImgSrc = densityChangeIcon != '' ? "<img src=" + densityChangeIcon + "></img>" : "",
                    densityNoteImgSrc = densityNote != '' && densityNote != null ? "<img src=" + densityNoteIcon + " title='" + densityNote + "'></img>" : ""
                subjectColumnData = "<span>" + strengthImgSrc + "<span>" + objectText + "</span>" + densityImgSrc + patternImgSrc + densityChangeImgSrc + densityNoteImgSrc + "</span>"
            } else {
                subjectColumnData = "<span>" + subjectText + "</span>"
            }

            var parent = {
                text: objectColumnData,
                parent: [],
                children: [],
                dbxref: data[0].object_dbxref,
                a_attr: {
                    'href': '/chaise/record/#2/Vocabulary:Anatomy/id=' + data[0].object_dbxref.replace(/:/g, '%3A'),
                    'style': 'display:inline;'
                }
            };
            var child = {
                text: subjectColumnData,
                parent: [],
                children: [],
                dbxref: data[0].subject_dbxref,
                a_attr: {
                    'href': '/chaise/record/#2/Vocabulary:Anatomy/id=' + data[0].subject_dbxref.replace(/:/g, '%3A'),
                    'style': 'display:inline;'
                }
            };
            var forest = new Forest(parent);
            // console.log(parent.dbxref)
            if ((prefixVal != "" && parent.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                var tree = new Tree(parent);
                if (child.dbxref.startsWith("UBERON") == false) {
                    // console.log(child.dbxref)
                    var tree1 = new Tree(child);
                    parent.children.push(child);
                    child.parent.push(parent);
                }
                forest.trees.push(tree);
            }
            // Get all isolated nodes as parent nodes
            for (var j = 0; j < isolatedNodes.length; j++) {
                var parent = {
                    text: "<span>" + isolatedNodes[j].name + "</span>",
                    parent: [],
                    children: [],
                    dbxref: isolatedNodes[j].dbxref,
                    a_attr: {
                        'href': '/chaise/record/#2/Vocabulary:Anatomy/id=' + isolatedNodes[j].dbxref.replace(/:/g, '%3A'),
                        'style': 'display:inline;'
                    },
                    li_attr: {
                        "class": "jstree-leaf"
                    }
                };
                //console.log(parent)
                if ((prefixVal != "" && parent.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                    // console.log(parent.dbxref)
                    var tree = new Tree(parent);
                    forest.trees.push(tree);
                }
            }


            for (var i = 1; i < data.length; i++) {
                // if(data[i].object_dbxref == "UBERON:0010536:" || data[i].subject_dbxref == "UBERON:0010536:")
                //     console.log('found');
                var subjectText = data[i].subject,
                    objectText = data[i].object;
                if (showAnnotation && data[i].object_dbxref == extraAttributes.Region) {
                    var densityIcon = getDensityIcon(extraAttributes.density),
                        densityChangeIcon = getDensityChangeIcon(extraAttributes.densityChange),
                        densityNoteIcon = getDensityNoteIcon(extraAttributes.densityNote),
                        densityNote = extraAttributes.densityNote,
                        patternIcon = getPatternIcon(extraAttributes.pattern),
                        strengthIcon = getStrengthIcon(extraAttributes.strength),
                        densityImgSrc = densityIcon != '' ? "<img src=" + densityIcon + "></img>" : "",
                        patternImgSrc = patternIcon != '' ? "<img src=" + patternIcon + "></img>" : "",
                        strengthImgSrc = strengthIcon != '' ? "<img src=" + strengthIcon + "></img>" : "",
                        densityChangeImgSrc = densityChangeIcon != '' ? "<img src=" + densityChangeIcon + "></img>" : "",
                        densityNoteImgSrc = densityNote != '' && densityNote != null ? "<img src=" + densityNoteIcon + " title='" + densityNote + "'></img>" : ""
                    objectColumnData = "<span>" + strengthImgSrc + "<span>" + objectText + "</span>" + densityImgSrc + patternImgSrc + densityChangeImgSrc + densityNoteImgSrc + "</span>"
                } else {
                    objectColumnData = "<span>" + objectText + "</span>"
                }
                if (showAnnotation && data[i].subject_dbxref == extraAttributes.Region) {
                    var densityIcon = getDensityIcon(extraAttributes.density),
                        densityChangeIcon = getDensityChangeIcon(extraAttributes.densityChange),
                        densityNoteIcon = getDensityNoteIcon(extraAttributes.densityNote),
                        densityNote = extraAttributes.densityNote,
                        patternIcon = getPatternIcon(extraAttributes.pattern),
                        strengthIcon = getStrengthIcon(extraAttributes.strength),
                        densityImgSrc = densityIcon != '' ? "<img src=" + densityIcon + "></img>" : "",
                        patternImgSrc = patternIcon != '' ? "<img src=" + patternIcon + "></img>" : "",
                        strengthImgSrc = strengthIcon != '' ? "<img src=" + strengthIcon + "></img>" : "",
                        densityChangeImgSrc = densityChangeIcon != '' ? "<img src=" + densityChangeIcon + "></img>" : "",
                        densityNoteImgSrc = densityNote != '' && densityNote != null ? "<img src=" + densityNoteIcon + " title='" + densityNote + "'></img>" : ""
                    subjectColumnData = "<span>" + strengthImgSrc + "<span>" + objectText + "</span>" + densityImgSrc + patternImgSrc + densityChangeImgSrc + densityNoteImgSrc + "</span>"
                } else {
                    subjectColumnData = "<span>" + subjectText + "</span>"
                }

                var parent = {
                    text: objectColumnData,
                    parent: [],
                    children: [],
                    dbxref: data[i].object_dbxref,
                    a_attr: {
                        'href': '/chaise/record/#2/Vocabulary:Anatomy/id=' + data[i].object_dbxref.replace(/:/g, '%3A'),
                        'style': 'display:inline;'
                    }
                };
                var child = {
                    text: subjectColumnData,
                    parent: [],
                    children: [],
                    dbxref: data[i].subject_dbxref,
                    a_attr: {
                        'href': '/chaise/record/#2/Vocabulary:Anatomy/id=' + data[i].subject_dbxref.replace(/:/g, '%3A'),
                        'style': 'display:inline;'
                    }
                };
                if ((prefixVal != "" && parent.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                    var tree = new Tree(parent);
                    // console.log(parent.dbxref)
                    if ((prefixVal != "" && child.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                        // console.log(child.dbxref)
                        var tree1 = new Tree(child);
                        parent.children.push(child);
                        child.parent.push(parent);
                    }
                }
                var added = false;
                var parentNode = false;
                var childNode = false;
                var childIndex = -1;
                var parentIndex = -1;
                for (var f = 0; f < forest.trees.length && !added; f++) {
                    var tree = forest.trees[f];

                    if (!parentNode) {
                        parentNode = tree.contains(tree, data[i].object_dbxref);
                        if (parentNode)
                            parentIndex = f;
                    }
                    if (!childNode) {
                        childNode = tree.contains(tree, data[i].subject_dbxref);
                        if (childNode)
                            childIndex = f;
                    }
                }
                //parent and child both not found
                // add this as a new tree and add to forest
                if (!parentNode && !childNode) {
                    if ((prefixVal != "" && parent.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                        var tree = new Tree(parent);
                        forest.trees.push(tree);
                    }
                }
                //parent node exist, add child to parent node
                else if (parentNode && !childNode) {
                    if ((prefixVal != "" && child.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                        parentNode.children.push(child);
                    }
                }
                //child node exist, add parent to child node
                //delete child from the forest as child is no longer root
                else if (!parentNode && childNode) {
                    if ((prefixVal != "" && parent.dbxref.startsWith("UBERON") == false) || prefixVal == "") {
                        parent.children.pop();
                        parent.children.push(childNode);
                        childNode.parent.push(parent);
                        tree = new Tree(parent);
                        jloop:
                            for (var t = 0; t < forest.trees.length; t++) {
                                if (forest.trees[t].node.dbxref == childNode.dbxref) {
                                    //console.log(forest.trees[t].node.text);
                                    forest.trees.splice(t, 1);
                                    break jloop;
                                }
                            }
                        forest.trees.push(tree);
                    }
                }
                //child and parent node, both are present then add child to parent
                //and remove the child form the forest
                else if (parentNode && childNode) {
                    parentNode.children.push(childNode);
                    ploop:
                        for (var q = 0; q < forest.trees.length; q++) {
                            if (forest.trees[q].node.dbxref == childNode.dbxref) {
                                //console.log(forest.trees[q].node.text);
                                forest.trees.splice(q, 1);
                                break ploop;
                            }
                        }
                }
            }

            return (forest);

        }

        function Queue() {
            var a = [],
                b = 0;
            this.getLength = function() {
                return a.length - b
            };
            this.isEmpty = function() {
                return 0 == a.length
            };
            this.enqueue = function(b) {
                a.push(b)
            };
            this.dequeue = function() {
                if (0 != a.length) {
                    var c = a[b];
                    2 * ++b >= a.length && (a = a.slice(b), b = 0);
                    return c
                }
            };
            this.peek = function() {
                return 0 < a.length ? a[b] : void 0
            }
        };

        function Tree(node) {
            var linkId = node.dbxref.replace(/:/g, '%3A');
            var s = node.a_attr;
            var l = "'/chaise/record/#2/Vocabulary:Anatomy/id=" + linkId + "','_blank'";
            s["onClick"] = "window.open(" + l + ");";
            var node = {
                text: node.text,
                dbxref: node.dbxref,
                children: node.children,
                parent: node.parent,
                a_attr: s
            };
            this.node = node;
        }
        var tress = [];

        function Forest(node) {
            var tree = new Tree(node);
            this.trees = [];
        }

        function getDensityIcon(density) {
            switch (density) {
                case 'High':
                    return "resources/images/NerveDensity/RelativeToTotal/high.png";
                case 'Low':
                    return "resources/images/NerveDensity/RelativeToTotal/low.png";
                case 'Medium':
                    return "resources/images/NerveDensity/RelativeToTotal/medium.png";
                default:
                    return "";
            }
        }

        function getDensityChangeIcon(densityChange) {
            switch (densityChange) {
                case 'Decreased':
                    return "resources/images/NerveDensity/RelativeToP0/dec_small.png";
                case 'Increased':
                    return "resources/images/NerveDensity/RelativeToP0/inc_small.png";
                    // case 'No Change':
                    //     return "resources/images/NerveDensity/RelativeToP0/medium.png";
                default:
                    return '';
            }
        }

        function getDensityNoteIcon(densityNote) {
            if (densityNote != null)
                return "resources/images/NerveDensity/note.gif";
            else
                return "";
        }

        function getPatternIcon(pattern) {
            switch (pattern) {
                case 'graded':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/Graded.png";
                case 'homogeneous':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/homogeneous.png";
                case 'regional':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/Regional.png";
                case 'restricted':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/Restricted.png";
                case 'single cell':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/SingleCell.png";
                case 'spotted':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/Spotted.png";
                case 'ubiquitous':
                    return "resources/images/ExpressionMapping/ExpressionPatternKey/Ubiquitous.png";
                default:
                    return "";
            }
        }

        function getStrengthIcon(strength) {
            switch (strength) {
                case 'not detected':
                    return "resources/images/ExpressionMapping/ExpressionStrengthsKey/notDetected.gif";
                case 'uncertain':
                    return "resources/images/ExpressionMapping/ExpressionStrengthsKey/Uncertain.gif";
                case 'present':
                    return "resources/images/ExpressionMapping/ExpressionStrengthsKey/Present(unspecifiedStrength).gif";
                default:
                    return "";
            }
        }
        Tree.prototype.traverseBF = function(dbxref) {
            var queue = new Queue();
            queue.enqueue(this.node);
            currentNode = queue.dequeue();

            while (currentNode) {
                for (var i = 0, length = currentNode.children.length; i < length; i++) {
                    queue.enqueue(currentNode.children[i]);
                }
                if (currentNode.dbxref == dbxref)
                    return currentNode;
                currentNode = queue.dequeue();
            }
        };
        Tree.prototype.contains = function(tree, dbxref) {
            return tree.traverseBF(dbxref);
        };

        Tree.prototype.add = function(data, toData, traversal) {
            var child = {
                text: data,
                children: [],
                parent: [],
                callback: function(node) {
                    if (node.text === toData.text) {
                        parent = node;
                    }
                }
            };
            this.contains(child.callback, traversal);
            if (parent) {
                parent.children.push(child);
                child.parent = parent;
            } else {
                throw new Error('Cannot add node to a non-existent parent.');
            }
        };

        $(function() {
            $("#plugins4").jstree({
                "plugins": ["search"]
            });
            var to = false;
            $('#plugins4_q').keyup(function() {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    var v = $('#plugins4_q').val();
                    $('#jstree').jstree(true).search(v);
                }, 1400);
            });
        });


        function findGetParameter(parameterName) {
            var result = null,
                tmp = [];
            var items = window.location.search.substr(1).split("&");
            for (var index = 0; index < items.length; index++) {
                tmp = items[index].split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            }
            return result;
        }
    });
})
