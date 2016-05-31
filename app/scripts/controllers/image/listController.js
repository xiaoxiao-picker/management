define(function(require, exports, module) {
    var baseController = require('baseController');
    var template = require('template');
    var bC = new baseController();
    var ResourceService = require('ResourceService');
    var Helper = require("helper");
    var uploadify = require("uploadify");

    var session, skip, limit;
    var CurGroup, Group, Pictures;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "image.list";
        _controller.actions = {
            /* =================== 分组管理 =================== */
            /**
             *	显示新建分组弹出框
             */
            modalForAddGroup: function() {
                groupInputModal('新建分组', {}, addGroup);
            },
            /**
             *	显示重命名分组弹出框
             */
            modalForRenameGroup: function() {
                var _btn = this;
                var groupId = _btn.attr("data-value");

                var group = Groups.objOfAttr('id', groupId);

                groupInputModal('重命名分组', group, renameGroup);
            },
            /**
             *	选择分组
             */
            selectGroup: function() {
                var _btn = this;
                var groupId = _btn.attr("data-value");

                if (CurGroup.id == groupId) return;

                CurGroup = Groups.objOfAttr('id', groupId);

                $("#GroupBox li").removeClass('active');
                _btn.addClass('active');

                renderDetailBox();
            },
            /**
             *	删除分组
             */
            removeGroup: function() {
                var _btn = this;
                var groupId = _btn.attr("data-value");

                Helper.confirm("是否确定删除该分组，删除后分组下的所有图片将被删除。", {}, function() {
                    Helper.begin(_btn);
                    ResourceService.image.group.remove(groupId).done(function(data) {
                        Helper.successToast("删除分组成功！");
                        if (CurGroup.id == groupId) {
                            CurGroup.id = 0;
                        };
                        renderGroups();
                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                    });
                });
            },

            /* =================== 图片管理 =================== */
            /**
             *	删除一张或多张图片
             */
            removeImages: function() {
                var _btn = this;
                var selectedImages = $("input[name=imageOption]:checked");

                if (!selectedImages.length) {
                    Helper.errorToast("请至少选择一项");
                    return;
                };

                var pictureIds = [];
                $.each(selectedImages, function(idx, input) {
                    pictureIds.push($(input).attr("data-value"));
                });

                var curGroup = $("#Group_" + CurGroup.id + " .group-count");
                var groupCount = +curGroup.text();

                Helper.confirm("是否确定删除选中的" + pictureIds.length + "张图片？", {}, function() {
                    Helper.begin(_btn);
                    ResourceService.remove(pictureIds.join(',')).done(function(data) {
                        Helper.successToast("删除图片成功！");
                        $.each(pictureIds, function(idx, pictureId) {
                            $("#Image_" + pictureId).remove();
                        });

                        //数据重置
                        skip -= pictureIds.length;
                        groupCount -= pictureIds.length;
                        curGroup.text(groupCount);
                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                        //按钮回复默认
                        $("#OptionBox >.btn").prop('disabled', true);
                        $("input[name=AllImage]").prop('checked', false);
                    });
                });

            },
            /**
             *	删除对应图片
             */
            removeImage: function() {
                var _btn = this;
                var pictureId = _btn.attr("data-value");

                var curGroup = $("#Group_" + CurGroup.id + " .group-count");
                var groupCount = +curGroup.text();

                Helper.confirm("是否确定删除该图片？", {}, function() {
                    Helper.begin(_btn);
                    ResourceService.remove(pictureId).done(function(data) {
                        Helper.successToast("删除图片成功！");
                        $("#Image_" + pictureId).remove();
                        --skip;
                        --groupCount;
                        curGroup.text(groupCount);

                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                    });
                });
            },
            /**
             *	显示移动分组弹出框(多张图片)
             */
            modalForMoveImages: function() {
                groupsModal();
            },
            /**
             *	显示移动分组弹出框(单张图片)
             */
            modalForMoveImage: function() {
                var _btn = this;
                var pictureId = _btn.attr("data-value");

                groupsModal(pictureId, moveImage);
            },
            /**
             *	显示重命名图片弹出框
             */
            modalForRenamePic: function() {
                var _btn = this;
                var pictureId = _btn.attr("data-value");
                var picture = Pictures.objOfAttr('id', pictureId);

                var modal = Helper.modal({
                    title: "重命名图片",
                    actions: {
                        '.btn-save': {
                            event: 'click',
                            fnc: function(modal) {
                                var _btn = $(this);
                                var pictureId = _btn.attr("data-value");
                                var _input = modal.box.find('.input');
                                var pictureName = _input.val();

                                Helper.begin(_btn);
                                ResourceService.update(pictureId, pictureName).done(function(data) {
                                    Helper.successToast("重命名图片成功！");
                                    modal.close();
                                    renderDetailBox();
                                    // $("#Image_" + pictureId).find(".title-wrapper .input-text").text(pictureName);
                                }).fail(function(error) {
                                    Helper.alert(error);
                                }).always(function() {
                                    Helper.end(_btn);
                                });
                            }
                        }
                    }
                });
                modal.html(template('app/templates/public/single-input-modal', {
                    id: picture.id,
                    name: "图片名称",
                    value: picture.name||picture.fileName,
                }));
            },
            /**
             *	选中图片
             */
            selectImage: function() {

                var images = $("input[name=imageOption]");
                var selectedImages = $("input[name=imageOption]:checked");
                if (selectedImages.length) {
                    $("#OptionBox >.btn").prop('disabled', false);
                    //设置是否全选
                    if (images.length == selectedImages.length) {
                        $("input[name=AllImage]").prop('checked', true);
                    } else {
                        $("input[name=AllImage]").prop('checked', false);
                    }
                } else {
                    $("#OptionBox >.btn").prop('disabled', true);
                    $("input[name=AllImage]").prop('checked', false);
                }
            },
            /**
             *	全部选中
             */
            selectAll: function() {
                var _input = this;
                var checked = _input.prop('checked');

                var images = $("input[name=imageOption]");
                if (images.length) {
                    images.prop('checked', checked);
                    $("#OptionBox >.btn").prop('disabled', !checked);
                };
            },
            /**
             *	加载更多图片
             */
            loadMore: function() {
                var _btn = this;
                renderMoreImages(_btn);
            }
        }
    };

    bC.extend(Controller);
    Controller.prototype.init = function(callback) {
        this.callback = callback;

        session = Application.getSession();
        limit = +Helper.param.search("limit") || 12;
        CurGroup = {};
        Group = {};
        Pictures = [];

        this.render();
    };

    Controller.prototype.render = function() {
        Helper.globalRender(template('app/templates/image/list', {}));
        Helper.execute(this.callback);

        renderGroups();
    };

    /**
     *	渲染分组列表
     */
    function renderGroups() {
        Groups = [];

        ResourceService.image.group.getList().done(function(data) {
            $.each(data.result, function(idx, group) {
                if (group.type == "SYSTEM") {
                    Groups.push(group);
                }
            });

            if (Groups.length && !CurGroup.id) {
                CurGroup = Groups[0];
            };

            $("#GroupBox").html(template("app/templates/image/group-box", {
                groups: Groups,
                curGroupId: CurGroup.id
            }));

            renderDetailBox();
        }).fail(function(error) {
            Helper.alert(error);
        });
    }

    /**
     *	渲染对应分组内容
     */
    function renderDetailBox() {
        if (!CurGroup.id) return;

        ResourceService.image.group.get(CurGroup.id).done(function(data) {
            CurGroup = data.result;
            renderBox(CurGroup);

        }).fail(function(error) {
            Helper.alert(error);
        });

        function renderBox(group) {
            $("#DetailBox").html(template('app/templates/image/detail-box', {
                group: group
            }));
            uploadListenser();
            renderImages();
        }

    }

    /**
     *	渲染对应分组图片列表
     */
    function renderImages() {
        skip = 0;
        Pictures = [];
        $("#DetailBox .images-wrapper").html(template("app/templates/public/loading", {}));
        $("#DetailBox .more-wrapper").addClass('hide');

        ResourceService.image.getList(CurGroup.id, skip, limit).done(function(data) {
            var pictures = data.result.data;
            var count = data.result.total;
            var hasMore = count > skip + pictures.length;

            Pictures = Pictures.concat(pictures);
            skip = pictures.length;

            $("#DetailBox .images-wrapper").html(template('app/templates/image/pictures', {
                pictures: pictures,
                count: count,
                skip: skip,
                code: CurGroup.code
            }));

            if (hasMore) {
                $("#DetailBox .more-wrapper").removeClass('hide');
            }

        }).fail(function(error) {
            Helper.alert(error);
            $("#DetailBox .images-wrapper").html('<div class="text-gray center">' + error + '</div>');
        });
    }

    /**
     *	渲染更多图片列表
     */
    function renderMoreImages(btn) {

        btn && Helper.begin(btn);
        ResourceService.image.getList(CurGroup.id, skip, limit).done(function(data) {
            var pictures = data.result.data;
            var count = data.result.total;
            var hasMore = count > skip + pictures.length;

            Pictures = Pictures.concat(pictures);
            skip += pictures.length;

            $("#DetailBox .images-wrapper").append(template('app/templates/image/pictures', {
                pictures: pictures,
                count: count,
                skip: skip,
                code: CurGroup.code
            }));

            $("#DetailBox .more-wrapper")[hasMore ? 'removeClass' : 'addClass']('hide');

        }).fail(function(error) {
            Helper.alert(error);
        }).always(function() {
            btn && Helper.end(btn);
        });
    }

    /**
     *	监听图片上传事件
     */
    function uploadListenser() {
        var $input = $("#Resource_ImageUpload");
        var fileCount;

        var imagesTemp = "app/templates/image/pictures";
        uploadify.image($input, CurGroup.id||'', session, {
            onDialogClose: function(queueData) {
                fileCount = queueData.filesSelected;
            },
            start: function(file) {
                var imagesbox = $("#DetailBox .images-wrapper");

                //设置上传按钮禁用
                $input.uploadify("disable", true);
                $input.uploadify("settings", 'buttonText', '上传中&nbsp;(' + ++file.index + '/' + fileCount + ')');

                //添加一项并显示加载中
                var children = imagesbox.children(".wrapper");
                if (children.length) {
                    imagesbox.prepend(template(imagesTemp, {
                        pictures: [{
                            name: file.name
                        }],
                        count: 1
                    }));
                } else {
                    $("#DetailBox .list-empty").addClass('hide');
                    imagesbox.html(template(imagesTemp, {
                        pictures: [{
                            name: file.name
                        }],
                        count: 1
                    }));
                }
                var children = imagesbox.children(".wrapper");
                $(children[0]).find(".img-wrapper").addClass('loading');
            },
            progress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {

            },
            success: function(file, data, response) {
                var imagesbox = $("#DetailBox .images-wrapper");
                var children = imagesbox.children(".wrapper");

                data = $.parseJSON(data);
                if (data.status == "OK") {
                    Helper.successToast("图片上传成功");
                    var picture = data.result;
                    Pictures.splice(0, 0, picture);
                    $(children[0]).replaceWith(template(imagesTemp, {
                        pictures: [picture],
                        count: 1
                    }));
                    skip++;
                    //对应分组的图片数
                    var curGroup = $("#Group_" + CurGroup.id + " .group-count");
                    var groupCount = +curGroup.text();
                    curGroup.text(++groupCount);
                } else {
                    $(children[0]).remove();

                    Helper.alert(data.message);
                }
            },
            error: function(file, errorCode, errorMsg, errorString) {
                Helper.alert("图片 " + file.name + " 上传失败：" + errorString);
                var imagesbox = $("#DetailBox .images-wrapper");
                var children = imagesbox.children(".wrapper");
                $(children[0]).remove();
            },
            complate: function(queueData) {
                //设置上传按钮可用
                $input.uploadify("disable", false);
                $input.uploadify("settings", 'buttonText', '本地上传');
            }
        });
    };

    /**
     *	新建分组
     */
    function addGroup(modal) {
        var _btn = $(this);
        var input_name = modal.box.find('.name');
        var groupName = input_name.val();
        var input_code = modal.box.find('.code');
        var groupCode = input_code.val();

        if (!groupName.length) {
            Helper.errorToast("分组名称不能为空");
            return;
        }
        if (!groupCode.length) {
            Helper.errorToast("分组code不能为空");
            return;
        }

        Helper.begin(_btn);
        ResourceService.image.group.add(groupName, groupCode).done(function(data) {
            Helper.successToast("新建分组成功！");
            modal.close();
            renderGroups();
        }).fail(function(error) {
            Helper.alert(error);
        }).always(function() {
            Helper.end(_btn);
        });
    };

    /**
     *	重命名分组
     */
    function renameGroup(modal) {
        var _btn = $(this);
        var groupId = _btn.attr("data-value");
        var input_name = modal.box.find('.name');
        var groupName = input_name.val();
        var input_code = modal.box.find('.code');
        var groupCode = input_code.val();

        if (!groupName.length) {
            Helper.errorToast("分组名称不能为空");
            return;
        }
        if (!groupCode.length) {
            Helper.errorToast("分组code不能为空");
            return;
        }

        Helper.begin(_btn);
        ResourceService.image.group.update(groupId, groupName, groupCode).done(function(data) {
            Helper.successToast("重命名分组成功！");
            modal.close();
            renderGroups();
        }).fail(function(error) {
            Helper.alert(error);
        }).always(function() {
            Helper.end(_btn);
        });
    };


    /**
     *	设置新建、重命名分组弹出框
     */
    function groupInputModal(title, group, action) {
        var modal = Helper.modal({
            title: title,
            actions: {
                '.btn-save': {
                    event: 'click',
                    fnc: action
                }
            }
        });
        modal.html(template('app/templates/image/group-editor', {
            group: group
        }));
    }

    /**
     *	移动一张或多张图片到分组
     */
    function moveImages(modal) {
        var _btn = $(this);
        var selectedImages = $("input[name=imageOption]:checked");

        if (!selectedImages.length) {
            Helper.errorToast("请至少选择一项");
            return;
        };

        var pictureIds = [];
        $.each(selectedImages, function(idx, input) {
            pictureIds.push($(input).attr("data-value"));
        });

        var selectedGroupId = $("input[name=group]:checked").attr("data-value");

        var curGroup = $("#Group_" + CurGroup.id + " .group-count");
        var groupCount = +curGroup.text();
        var selectGroup = $("#Group_" + selectedGroupId + " .group-count");
        var selectGroupCount = +selectGroup.text();

        Helper.begin(_btn);
        ResourceService.image.move(pictureIds.join(','), selectedGroupId).done(function(data) {
            Helper.successToast("移动分组成功！");
            modal.close();
            $.each(pictureIds, function(idx, pictureId) {
                $("#Image_" + pictureId).remove();
            });
            //数据重置
            skip -= pictureIds.length;
            groupCount -= pictureIds.length;
            selectGroupCount += pictureIds.length;
            curGroup.text(groupCount);
            selectGroup.text(selectGroupCount);
            if (!groupCount) {
                $("#DetailBox .list-empty").removeClass('hide');
            }
        }).fail(function(error) {
            Helper.alert(error);
        }).always(function() {
            Helper.end(_btn);
            //按钮恢复默认
            $("#OptionBox >.btn").prop('disabled', true);
            $("input[name=AllImage]").prop('checked', false);
        });
    };

    /**
     *	移动对应图片到分组
     */
    function moveImage(modal) {
        var _btn = $(this);
        var pictureId = _btn.attr("data-value");
        var selectedGroupId = $("input[name=group]:checked").attr("data-value");

        var curGroup = $("#Group_" + CurGroup.id + " .group-count");
        var groupCount = +curGroup.text();
        var selectGroup = $("#Group_" + selectedGroupId + " .group-count");
        var selectGroupCount = +selectGroup.text();

        Helper.begin(_btn);
        ResourceService.image.move(pictureId, selectedGroupId).done(function(data) {
            Helper.successToast("移动分组成功！");
            modal.close();

            $("#Image_" + pictureId).remove();
            --skip;
            --groupCount;
            curGroup.text(groupCount);
            selectGroup.text(++selectGroupCount);
            if (!groupCount) {
                $("#DetailBox .list-empty").removeClass('hide');
            }
        }).fail(function(error) {
            Helper.alert(error);
        }).always(function() {
            Helper.end(_btn);
        });
    };

    /**
     *	分组选择弹出框
     */
    function groupsModal(pictureId, action) {
        var groups = [];
        $.each(Groups, function(idx, group) {
            if (!CurGroup.id && !group.id) {
                return;
            };
            if (group.id != CurGroup.id) {
                groups.push(group);
            };
        });

        if (!groups.length) {
            Helper.errorToast('没有可以移动的分组');
            return;
        };

        var options = {
            title: '移动分组',
            customGroups: groups,
            id: pictureId,
            actions: {
                '.btn-move': {
                    event: 'click',
                    fnc: action || moveImages
                }
            }
        };

        var modal = Helper.modal(options);
        modal.html(template('app/templates/image/groups-modal', options));

    }

    module.exports = Controller;

});
