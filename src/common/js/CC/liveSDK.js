/**
 * CC live video
 * v2.3.3 2018/04/19
 */
import $ from '../../../api/jquery-vendor';

(function () {

    function isSupportFlash() {
        var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
        var hasFlash = true;

        if (isIE) {
            try {
                var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            } catch (e) {
                hasFlash = false;
            }
        } else {
            if (!navigator.plugins["Shockwave Flash"]) {
                hasFlash = false;
            }
        }
        return hasFlash;
    }

    var DWLive = {
        init: function (option) {
            if (typeof option == "undefined") {
                option = {};
            }
            this.userid = $.trim(option.userid);
            this.roomid = $.trim(option.roomid);
            this.viewername = $.trim(option.viewername);
            this.viewertoken = $.trim(option.viewertoken);
            this.forcibly = $.trim(option.forcibly);
            this.viewercustomua = $.trim(option.viewercustomua);
            this.language = $.trim(option.language);

            var _this = this;
            var scripts = [
                "//static.csslcloud.net/js/socket.io.js"
            ];
            if (MobileLive.isMobile() == 'isMobile') {
                if ($('#drawPanel').length > 0) {
                    scripts.push("//static.csslcloud.net/js/module/drawingBoard-2.0.0.js");
                }
            } else {
                if (!isSupportFlash()) {

                    if (typeof DWLive.onNotSupportFlash === "function") {
                        DWLive.onNotSupportFlash();
                    }

                    if (this.userid == '18452D400D6B81D5') {
                        var lpph = $('#' + LivePlayer.id).parent().height();
                        var lppw = $('#' + LivePlayer.id).parent().width();

                        var tip = '<div style="z-index: 999999;"><p style="color: #0e0e0e; width: 260px;">鎮ㄨ繕娌℃湁瀹夎flash鎾斁鍣�,璇风偣鍑�'
                            + '<a href="http://www.adobe.com/go/getflash" style="color: red;" target="_blank">杩欓噷'
                            + '</a>瀹夎</p></div>';

                        $('#' + LivePlayer.id).append(tip).parent().css('z-index', '999999');

                        var lpdh = $($('#' + LivePlayer.id + ' div p')[0]).height();
                        var lpdw = $($('#' + LivePlayer.id + ' div p')[0]).width();

                        $('#' + LivePlayer.id + ' div').css({
                            'margin-left': ((lppw - lpdw - 60) / 2) + 'px',
                            'margin-top': ((lpph - lpdh) / 2) + 'px'
                        });

                        setInterval(function () {
                            $('#' + LivePlayer.id).parent().show();
                        }, 3000);
                    }
                }

                scripts.push(
                    "//static.csslcloud.net/js/swfobject.js",
                    "//static.csslcloud.net/js/json3.min.js"
                );
            }
            this.loadScript(scripts, function () {
                _this.login();
                _this.history = new History();
                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
                    var dp = '<canvas id="drawPanel" width="1200" height="1200"></canvas>'
                        + '<iframe id="dpa" src="" frameborder="0"></iframe>';
                    $('#drawPanel').parent().append(dp);
                    $('div#drawPanel').remove();
                    $.DrawingBoard.config();
                }
            });

        },

        login: function () {
            $.ajax({
                url: "//view.csslcloud.net/api/room/login",
                type: "GET",
                dataType: "jsonp",
                data: {
                    roomid: this.roomid,
                    userid: this.userid,
                    viewername: this.viewername,
                    viewertoken: this.viewertoken,
                    forcibly: this.forcibly,
                    viewercustomua: this.viewercustomua
                },
                success: function (data) {
                    if (!data.success) {
                        if (typeof DWLive.onLoginError === "function") {
                            DWLive.onLoginError(data);
                        }
                        return;
                    }

                    var isHttps = window.location.protocol === 'https:';
                    var host = data.datas.pusherNode.primary;
                    if (isHttps && host && host.indexOf(':')) {
                        var s = host.split(':');
                        if (s.length == 2) {
                            var port = parseInt(s[1]);
                            if (!isNaN(port)) {
                                var httpsPort = port + 400;
                                host = s[0] + ':' + httpsPort;
                            }
                        }
                    }

                    var url = document.location.protocol + '//' + host + '/' + data.datas.pusher.nsp;
                    var key = data.datas.viewer.key;
                    Pusher.options.pusherUrl = url;
                    Pusher.options.key = key;
                    DWLive.viewerid = data.datas.viewer.id;
                    DWLive.viewername = data.datas.viewer.name;

                    DWLive.multiQuality = data.datas.room.multiQuality;
                    DWLive.documentDisplayMode = data.datas.room.documentDisplayMode;
                    DWLive.liveCountdown = data.datas.room.liveCountdown;

                    var delay = data.datas.room.delayTime,
                        foreignPublish = data.datas.room.foreignPublish;
                    LivePlayer.delay = delay;
                    LivePlayer.foreignPublish = foreignPublish;

                    LivePlayer.openHostMode = data.datas.room.openHostMode;
                    LivePlayer.dvr = data.datas.room.dvr;
                    LivePlayer.barrageData = data.datas.room.barrage;
                    LivePlayer.warmVideoId = data.datas.room.encryptWarmVideoId;

                    var playerBackgroundImageUri = data.datas.room.playerBackgroundImageUri;
                    if (!playerBackgroundImageUri) {
                        playerBackgroundImageUri = '';
                    }
                    LivePlayer.backgroundImageUri = playerBackgroundImageUri;

                    if (typeof DWLive.playerBackgroundImageUri === 'function') {
                        DWLive.playerBackgroundImageUri(playerBackgroundImageUri);
                    }

                    var playerBackgroundHint = data.datas.room.playerBackgroundHint;
                    if (!playerBackgroundHint) {
                        playerBackgroundHint = '';
                    }
                    LivePlayer.backgroundHint = playerBackgroundHint;

                    if (typeof DWLive.playerBackgroundHint === 'function') {
                        DWLive.playerBackgroundHint(playerBackgroundHint);
                    }

                    var announcement = data.datas.announcement;
                    if (typeof DWLive.onAnnouncementShow === 'function' && announcement) {
                        DWLive.onAnnouncementShow(announcement);
                    }

                    var desc = data.datas.room.desc;
                    if (typeof DWLive.onLiveDesc === 'function') {
                        DWLive.onLiveDesc(desc);
                    }

                    var count = data.datas.room.showUserCount;
                    if (typeof DWLive.showUserCount === 'function') {
                        DWLive.showUserCount(count);
                    }

                    var marquee = data.datas.viewer.marquee;
                    if (typeof DWLive.getMarquee === 'function') {
                        DWLive.getMarquee(marquee);
                    }

                    if (typeof DWLive.onLoginSuccess === "function") {
                        DWLive.onLoginSuccess();
                    }

                    Pusher.init();

                    if (MobileLive.isMobile() == 'isMobile') {
                        MobileLive.init();
                    } else {
                        LivePlayer.init();
                    }

                    switch (data.datas.template.type) {
                        case 6:
                            Qa.init();
                            DWLive.sendPublicChatMsg = DWLive.sendPrivateChatMsg = function () {
                                return false;
                            };
                            break;
                        case 5:
                            Chat.init();
                            Qa.init();
                            DrawPanel.init();
                            break;
                        case 4:
                            Chat.init();
                            DrawPanel.init();
                            DWLive.sendQuestionMsg = function () {
                                return false;
                            };
                            break;
                        case 3:
                            Chat.init();
                            DWLive.sendQuestionMsg = function () {
                                return false;
                            };
                            break;
                        case 2:
                            Chat.init();
                            Qa.init();
                            break;
                        default:
                            Chat.init();
                            Qa.init();
                            DrawPanel.init();
                    }

                }
            });
        },

        logout: function () {
            $.ajax({
                url: '//view.csslcloud.net/api/live/logout',
                type: "GET",
                dataType: "json",
                timeout: 5000,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                },
                error: function (xhr, status, error) {
                }
            });
        },

        getScript: function (url, success) {

            var readyState = false,
                script = document.createElement('script');
            script.src = url;

            script.onload = script.onreadystatechange = function () {
                if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    readyState = true;
                    success && success();
                }
            };
            document.body.appendChild(script);

        },

        loadScript: function (res, callback) {

            if (typeof res === 'string') {
                var _res = res;
                res = [];
                res.push(_res);
            }
            var _this = this,
                queue = function (fs, cb) {
                    _this.getScript(fs.shift(), function () {
                        fs.length ? queue(fs, cb) : cb && cb();
                    });
                };

            queue(res, callback);

        },

        sendPublicChatMsg: function (msg) {
            if (!msg || msg.length > 300) {
                return;
            }
            Pusher.socket.emit('chat_message', msg);
        },

        sendPrivateChatMsg: function (touserid, tousername, msg) {
            var h = new Date().getHours(),
                m = new Date().getMinutes(),
                s = new Date().getSeconds();
            m = m > 9 ? m : '0' + m;
            s = s > 9 ? s : '0' + s;
            var j = {
                'fromuserid': this.viewerid,
                'fromusername': this.viewername,
                'touserid': touserid,
                'tousername': tousername,
                'msg': $.trim(msg),
                'time': h + ":" + m + ":" + s
            };
            Pusher.socket.emit('private_chat', JSON.stringify(j));
        },

        sendQuestionMsg: function (content) {
            if (!content || content.length > 300) {
                return;
            }

            var j = {
                'action': 'question',
                'value': {
                    'userId': this.viewerid,
                    'userName': this.viewername,
                    'content': content
                }
            };

            try {
                Pusher.socket.emit('question', JSON.stringify(j));
            } catch (e) {
            }
        },

        barrage: function (msg, color) {
            // 绉诲姩H5鏆備笉鏀寔寮瑰箷鍔熻兘
            if (MobileLive.isMobile() == 'isMobile') {
                return;
            }

            var newm = $.trim(msg);
            if (!newm) {
                return;
            }
            newm = msg.replace(/\[em2?_([0-9]*)\]/g, '');

            LivePlayer.barrage({
                'txt': newm,
                'color': color == null ? 0xffffff : color
            });
        },

        getLine: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                var l = MobileLive.src;
                return l;
            } else {
                return LivePlayer.getLine();
            }
        },

        changeLine: function (line) {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.changeLine(line);
            } else {
                LivePlayer.changeLine(line);
            }
        },

        onlyAudio: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.onlyAudio();
            } else {
                LivePlayer.onlyAudio();
            }
        },

        setSound: function (n) {
            if (MobileLive.isMobile() == 'isMobile') {
                return;
            }
            LivePlayer.setSound(n);
        },

        answerRollcall: function (rid, pid) {
            var j = {
                'rollcallId': rid,
                'userId': this.viewerid,
                'userName': this.viewername,
                'publisherId': pid
            };
            Pusher.socket.emit('answer_rollcall', JSON.stringify(j));
        },

        replyVote: function (voteid, option, pid) {
            var j = {
                'voteId': voteid,
                'voteOption': option,
                'publisherId': pid
            };
            Pusher.socket.emit('reply_vote', JSON.stringify(j));
        },

        docBarrage: function (msg, color) {
            if (!$.trim(msg)) {
                return;
            }
            DrawPanel.barrage({
                'txt': msg,
                'color': color == null ? 0xffffff : color
            });
        },

        openBarrage: function (b) {
            LivePlayer.openBarrage(b);
        },

        showControl: function (b) {
            LivePlayer.showControl(b);
        },

        livePlayerInit: function () {
            LivePlayer.init();
        },

        openSound: function () {
            LivePlayer.openSound();
        },

        closeSound: function () {
            LivePlayer.closeSound();
        },

        docAdapt: function (t) {
            live.adapt = t;
        },

        // 璇锋眰璇煶浜掑姩
        requestInteraction: function (t) {
            live.interaction.requestInteraction(t);
        },

        // 鎸傛柇鍙屽悜瑙嗛
        hangupInteraction: function () {
            live.interaction.hangupInteraction();
        },

        // 杩涘叆浜掑姩鎴块棿
        enterInteractionRoom: function (callback) {
            var err = undefined;
            try {
                Pusher.socket.emit('speak_enter');
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 鍙戦€佷簰鍔ㄤ俊鎭�
        sendInteractionMessage: function (p, toId, event, data, callback) {
            var type = 'audio';
            if (p.video) {
                type = 'audiovideo';
            }

            var j = {
                type: type,
                fromname: this.viewername,
                fromid: this.viewerid,
                fromrole: 'student',
                toid: toId,
                event: event,
                data: JSON.stringify(data)
            };

            var err = undefined;
            try {
                Pusher.socket.emit('speak_message', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 璺戦┈鐏�
        showMarquee: function (m) {
            LivePlayer.showMarquee(m);
        },
        showMarqueeDoc: function (m) {
            DrawPanel.showMarquee(m);
        },

        getPublishingQuestionnaire: function () {
            $.ajax({
                url: '//eva.csslcloud.net/api/questionnaire/info',
                type: "GET",
                dataType: "jsonp",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if (!data.success) {
                        return;
                    }

                    if (typeof DWLive.onQuestionnairePublish === 'function') {
                        DWLive.onQuestionnairePublish(data);
                    }
                }
            });
        }

    };

    // Pusher
    var Pusher = {
        options: {
            pusherUrl: '',
            key: '',
            maxMessageCount: 300, // 淇濆瓨鑱婂ぉ鏉℃暟
            userId: '',
            roomId: '',
            livePlayerId: '',
            drawPanel: ''
        },
        drawjson: [],
        pagechangedata: [],

        init: function () {

            var t = MobileLive.isMobile() == 'isMobile' ? 1 : 0;

            this.socket = io.connect(this.options.pusherUrl, {
                query: {
                    sessionid: Pusher.options.key,
                    platform: 1,
                    terminal: t
                }
            });
            this.bind();
        },

        bind: function () {

            // 缈婚〉鍥炶皟
            this.socket.on('page_change', function (j) {
                if (j && typeof(j) === "string") {
                    Pusher.pagechangedata.push(JSON.parse(j));
                }
                if (typeof window.on_cc_live_dw_page_change === 'function') {
                    window.on_cc_live_dw_page_change(j);
                }
            });

            // 鍔ㄧ敾缈婚〉
            this.socket.on('animation_change', function (j) {
                if (typeof window.on_cc_live_dw_animation_change === 'function') {
                    window.on_cc_live_dw_animation_change(j);
                }
            });

            // 鐢绘澘鍥炶皟
            this.socket.on('draw', function (j) {
                if (j && typeof(j) === "string") {
                    Pusher.drawjson.push(JSON.parse(j));
                }
                if (typeof window.on_cc_live_dw_draw === 'function') {
                    window.on_cc_live_dw_draw(j);
                }
            });

            this.socket.on('room_user_count', function (j) {
                if (typeof DWLive.onUserCountMessage === "function") {
                    DWLive.onUserCountMessage(j);
                }
            });

            this.socket.on('publish_stream', function (j) {
                if (LivePlayer) {
                    LivePlayer.isPublishing = 1;
                }
                if (LivePlayer && LivePlayer.start) {
                    LivePlayer.start();
                }
                if (typeof DWLive.onLiveStart === "function") {
                    DWLive.onLiveStart(j);
                }
            });

            this.socket.on('end_stream', function (j) {
                if (LivePlayer) {
                    LivePlayer.isPublishing = 0;
                }
                if (LivePlayer && LivePlayer.end) {
                    LivePlayer.end();
                }
                if (DrawPanel && DrawPanel.clear) {
                    DrawPanel.clear();
                }
                if (typeof DWLive.onLiveEnd === "function") {
                    DWLive.onLiveEnd(j);
                }
            });

            this.socket.on('kick_out', function (j) {
                if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {
                    LivePlayer.getFlash()._kickOff();
                }
                if (typeof DWLive.onKickOut === "function") {
                    DWLive.onKickOut(j);
                }
            });

            this.socket.on('announcement', function (data) {
                data = toJson(data);

                if (data.action == 'release') {
                    if (typeof DWLive.onAnnouncementRelease === 'function') {
                        DWLive.onAnnouncementRelease(data.announcement);
                    }
                } else if (data.action == 'remove') {
                    if (typeof DWLive.onAnnouncementRemove === 'function') {
                        DWLive.onAnnouncementRemove(data);
                    }
                }
            });

            // 绛惧埌鍔熻兘
            this.socket.on('start_rollcall', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartRollCall === 'function') {
                    DWLive.onStartRollCall(data);
                }
            });

            // 寮€濮嬫娊濂�
            this.socket.on('start_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartLottery === 'function') {
                    DWLive.onStartLottery(data);
                }
            });

            // 涓
            this.socket.on('win_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onWinLottery === 'function') {
                    DWLive.onWinLottery(data);
                }
            });

            // 缁撴潫鎶藉
            this.socket.on('stop_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStopLottery === 'function') {
                    DWLive.onStopLottery(data);
                }
            });

            // 寮€濮嬬瓟棰�
            this.socket.on('start_vote', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartVote === 'function') {
                    DWLive.onStartVote(data);
                }
            });

            // 缁撴潫绛旈
            this.socket.on('stop_vote', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStopVote === 'function') {
                    DWLive.onStopVote(data);
                }
            });

            // 绛旈缁撴灉
            this.socket.on('vote_result', function (data) {
                data = toJson(data);
                if (typeof DWLive.onVoteResult === 'function') {
                    DWLive.onVoteResult(data);
                }
            });

            // 绂佹挱
            this.socket.on('ban_stream', function (data) {
                data = toJson(data);
                if (typeof DWLive.onBanStream === 'function') {
                    DWLive.onBanStream(data);
                }
            });
            // 瑙ｇ
            this.socket.on('unban_stream', function (data) {
                data = toJson(data);
                if (typeof DWLive.onUnBanStream === 'function') {
                    DWLive.onUnBanStream(data);
                }
            });
            this.socket.on('room_setting', function (data) {
                data = toJson(data);
                if (typeof DWLive.onRoomSetting === 'function') {
                    DWLive.onRoomSetting(data);
                }
            });

            // 璁插笀鎺ュ彈浜掑姩淇℃伅
            this.socket.on('accept_speak', function (data) {
                if (typeof window.on_cc_live_accept_interaction === 'function') {
                    window.on_cc_live_accept_interaction(toJson(data));
                }
            });

            // 浜掑姩淇℃伅
            this.socket.on('speak_message', function (data) {
                if (typeof window.on_cc_live_interaction_message === 'function') {
                    window.on_cc_live_interaction_message(toJson(data));
                }
            });

            // 宸茬粡鍦ㄨ亰澶╃殑鍒楄〃淇℃伅
            this.socket.on('speak_peer_list', function (data) {
                if (typeof window.on_cc_live_interaction_chatusers === 'function') {
                    window.on_cc_live_interaction_chatusers(toJson(data));
                }
            });

            // 鎸傛柇浜掑姩淇℃伅
            this.socket.on('speak_disconnect', function (data) {
                if (typeof window.on_cc_live_interaction_disconnect === 'function') {
                    window.on_cc_live_interaction_disconnect(toJson(data));
                }
            });

            // 骞挎挱淇℃伅
            this.socket.on('broadcast_msg', function (data) {
                if (typeof DWLive.onBroadcastMsg === 'function') {
                    DWLive.onBroadcastMsg(toJson(data).value);
                }
            });

            // 鍙戝竷鎻愰棶
            this.socket.on('publish_question', function (data) {
                if (typeof DWLive.onQaPublish === 'function') {
                    DWLive.onQaPublish(toJson(data));
                }
            });

            /**
             * 鍙戝竷闂嵎
             * */
            this.socket.on('questionnaire_publish', function (data) {
                data = toJson(data);

                if (typeof DWLive.onQuestionnairePublish === 'function') {
                    DWLive.onQuestionnairePublish(data);
                }
            });

            /**
             * 缁撴潫鍙戝竷闂嵎
             * */
            this.socket.on('questionnaire_publish_stop', function (data) {
                data = toJson(data);

                if (typeof DWLive.onQuestionnairePublishStop === 'function') {
                    DWLive.onQuestionnairePublishStop(data);
                }
            });

            this.socket.on('room_teachers', function (data) {
                if (typeof DWLive.onOnlineTeachers === 'function') {
                    DWLive.onOnlineTeachers(toJson(data));
                }
            });

            this.socket.on('external_questionnaire_publish', function (data) {
                if (typeof DWLive.onExternalQuestionnairePublish === 'function') {
                    DWLive.onExternalQuestionnairePublish(toJson(data));
                }
            });

            this.socket.on('ban_chat', function (data) {
                if (typeof DWLive.onBanChat === 'function') {
                    DWLive.onBanChat(toJson(data));
                }
            });

            this.socket.on('unban_chat', function (data) {
                if (typeof DWLive.onUnBanChat === 'function') {
                    DWLive.onUnBanChat(toJson(data));
                }
            });

            var _this = this;
            setTimeout(function () {
                try {
                    _this.socket.emit('room_user_count');
                } catch (e) {
                }
                try {
                    _this.socket.emit('room_teachers');
                } catch (e) {
                }
            }, 1500);
            setInterval(function () {
                try {
                    _this.socket.emit('room_user_count');
                } catch (e) {
                }
                try {
                    _this.socket.emit('room_teachers');
                } catch (e) {
                }
            }, 15000);
        },

        // 璇锋眰浜掑姩
        requestInteraction: function (p, callback) {

            var t = 'audio';

            if (p.video) {
                t += 'video';
            }

            var j = {
                'viewerId': DWLive.viewerid,
                'viewerName': DWLive.viewername,
                'type': t
            };

            var err = undefined;
            try {
                this.socket.emit('request_speak', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 鍙栨秷鐢宠
        cancelRequestInteraction: function (type, callback) {
            var j = {
                'viewerId': this.viewerid,
                'viewerName': this.viewername,
                'type': type
            };

            debug('interaction', '鍙栨秷鐢宠锛�' + JSON.stringify(j));

            var err = undefined;
            try {
                this.socket.emit('cancel_request_speak', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        //鎸傛柇浜掑姩
        hangupInteraction: function (type, callback) {
            var j = {
                'viewerId': DWLive.viewerid,
                'viewerName': DWLive.viewername,
                'type': type
            };

            debug('interaction', '鎸傛柇浜嬩欢锛�' + JSON.stringify(j));

            var err = undefined;
            try {
                this.socket.emit('hangup_interaction', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        }
    };

    /**
     * 璇煶浜掑姩鏀寔
     *
     * */
    var Interaction = function (opts) {
        try {
            window.PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
            window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
            window.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            window.nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
            window.nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
        } catch (e) {
        }

        this.usersPcs = {
            length: 0
        };

        // 鏈湴娴佷俊鎭�
        this.local = {
            type: {
                video: false,
                audio: false
            },
            video: {},
            audio: {}
        };

        this.isRequesting = false;

        /**
         * 璇锋眰璇煶浜掑姩
         *
         * t = {
         *  video: true,
         *  audio: true
         * }
         * */
        this.requestInteraction = function (t, callback) {
            debug('Interaction', '璇锋眰浜掑姩');

            this.local.type = t;

            this.isRequesting = true;

            // 璇锋眰浜掑姩瓒呮椂璁℃椂鍣�
            this.setRequestTimeoutTimer();

            // 鍒涘缓闊宠棰戜俊鎭�
            this.createLocalMedia(function (error) {
                if (error) {
                    if (typeof window.on_cc_live_interaction_error === 'function') {
                        window.on_cc_live_interaction_error(live.interaction.local.type, error, '鍒涘缓闊宠棰戜俊鎭嚭閿�');
                    }
                    return;
                }

                Pusher.requestInteraction(t, callback);
            });
        };


        // 璇煶閫氳瘽璁℃椂鍣�
        this.setCallingTimer = function () {
            live.interaction.interactionTime = 0;
            live.interaction.interactionTimeInterval = setInterval(function () {
                ++live.interaction.interactionTime;
                if (typeof window.on_cc_live_interaction_interval === 'function') {
                    var p = live.interaction.local.type;
                    var t = live.interaction.interactionTime;
                    window.on_cc_live_interaction_interval(p, t);
                }
            }, 1000);
        };
        // 娓呴櫎璇煶閫氳瘽璁℃椂鍣�
        this.clearCallingTimer = function () {
            live.interaction.interactionTime = 0;
            clearInterval(live.interaction.interactionTimeInterval);
        };

        // 浜掑姩璇锋眰瓒呮椂瀹氭椂鍣�
        this.setRequestTimeoutTimer = function () {
            /**
             * 璇锋眰浜掑姩锛�60s鍐呮病鏈夋帴鍙楋紝鍒欒嚜鍔ㄦ柇寮€
             *
             * 閫氱煡pusher鏂紑
             * */
            live.interaction.REQUEST_INTERACTION_TIMEOUT = setTimeout(function () {
                live.interaction.REQUEST_INTERACTION_TIMEOUT = -1;

                // 瓒呮椂鎸傛柇璇煶閫氳瘽
                live.interaction.hangupInteraction(DWLive.viewerid);
                live.interaction.stopLocalStream();

                live.interaction.isRequesting = false;

                $('#interactionLocalVideo')[0].src = '';
                $('#videoInteraction').hide();

                if (typeof window.on_cc_live_interaction_request_timeout === 'function') {
                    window.on_cc_live_interaction_request_timeout(live.interaction.local.type);
                }
            }, 60000);
        };
        // 娓呯┖浜掑姩璇锋眰瓒呮椂瀹氭椂鍣�
        this.clearRequestTimeoutTimer = function () {
            if (live.interaction.REQUEST_INTERACTION_TIMEOUT > 0) {
                clearTimeout(live.interaction.REQUEST_INTERACTION_TIMEOUT);
                live.interaction.REQUEST_INTERACTION_TIMEOUT = -1;
            }
        };

        // 鍋滄鏈湴娴�
        this.stopLocalStream = function () {
            if (live.interaction.local.video.stream) {
                try {
                    live.interaction.local.video.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                } catch (e) {
                }
            }

            if (live.interaction.local.audio.stream) {
                try {
                    live.interaction.local.audio.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                } catch (e) {
                }
            }
        };

        this.cancelInteraction = function () {
            live.interaction.isRequesting = false;

            if (typeof window.on_cc_live_interaction_cancal === 'function') {
                window.on_cc_live_interaction_cancal(live.interaction.local.type);
            }
        };

        // 鏂紑杩炴帴
        this.disconnectInteraction = function (uId) {
            DWLive.openSound();

            this.clearRequestTimeoutTimer();

            // 鍒犻櫎鎵€鏈�
            if (uId == DWLive.viewerid) {
                $.each(live.interaction.usersPcs, function (userId, up) {
                    var pc = up.pc;
                    if (pc == null) {
                        return true;
                    }

                    pc.close();
                    pc = null;

                    if (live.interaction.usersPcs[userId]) {
                        delete live.interaction.usersPcs[userId];
                        var l = live.interaction.usersPcs.length - 1;
                        live.interaction.usersPcs.length = l < 0 ? 0 : l;
                    }

                });
            } else {
                $.each(live.interaction.usersPcs, function (userId, up) {
                    var pc = up.pc;
                    if (!pc) {
                        return true;
                    }

                    if (userId != uId) {
                        return true;
                    }

                    pc.close();
                    pc = null;

                    if (live.interaction.usersPcs[userId]) {
                        delete live.interaction.usersPcs[userId];
                        var l = live.interaction.usersPcs.length - 1;
                        live.interaction.usersPcs.length = l < 0 ? 0 : l;
                    }
                });
            }

            if (live.interaction.usersPcs.length == 0) {
                this.stopLocalStream();
            }

            live.interaction.isInteractioning = false;
            live.interaction.isRequesting = false;
        };

        // 鍒涘缓鏈湴闊宠棰戞祦
        this.createLocalAudioAndVideoMedia = function (c) {
            var that = this;
            getUserMedia.call(navigator, {
                video: true,
                audio: true
            }, function (stream) {
                that.local.video.stream = stream;

                if (c && typeof c === 'function') {
                    c(stream);
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        // 鍒涘缓鏈湴闊抽娴�
        this.createLocalAudioMedia = function (c) {
            var that = this;
            getUserMedia.call(navigator, {
                video: false,
                audio: true
            }, function (stream) {
                that.local.audio.stream = stream;

                if (c && typeof c === 'function') {
                    c(stream);
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        this.createLocalMedia = function (c) {
            var that = this;
            var p = that.local.type;
            getUserMedia.call(navigator, p, function (stream) {
                if (p.video) {
                    that.local.video.stream = stream;
                } else {
                    that.local.audio.stream = stream;
                }

                if (typeof window.on_cc_live_interaction_local_media === 'function') {
                    window.on_cc_live_interaction_local_media(p, stream);
                }

                if (c && typeof c === 'function') {
                    c();
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        this.iceServers = {
            "iceServers": [{
                url: 'stun:turn.csslcloud.net:3478',
                credential: 'bokecc',
                username: 'cc'
            }, {
                url: 'turn:turn.csslcloud.net:3478',
                credential: 'bokecc',
                username: 'cc'
            }]
        };

        // 鍒涘缓琚姩鍒涘缓杩炴帴鐨凱C
        this.createAnswerPeerConnection = function (chatuser) {
            var pc = new PeerConnection(this.iceServers);

            if (chatuser.type == 'audio') {
                if (!live.interaction.local.audio.stream) {
                    this.createLocalAudioMedia();
                }
                pc.addStream(live.interaction.local.audio.stream);
            } else {
                if (!live.interaction.local.video.stream) {
                    this.createLocalAudioAndVideoMedia();
                }
                pc.addStream(live.interaction.local.video.stream);
            }

            // 濡傛灉妫€娴嬪埌濯掍綋娴佽繛鎺ュ埌鏈湴锛屽皢鍏剁粦瀹氬埌涓€涓猘udio鏍囩涓婅緭鍑�
            pc.onaddstream = function (event) {
                if (typeof window.on_cc_live_interaction_remote_media === 'function') {
                    window.on_cc_live_interaction_remote_media(live.interaction.local.type, chatuser, event.stream);
                }
            };

            pc.createAnswer(function (desc) {
                pc.setLocalDescription(desc);
                DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, 'answer', desc);
            }, function (error) {
                debug('Interaction', 'Failure callback: ' + error);
            });

            pc.onicecandidate = function (event) {
                if (event.candidate !== null) {
                    DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, '', event.candidate);
                }
            };

            live.interaction.usersPcs[chatuser.id] = {
                pc: pc,
                user: chatuser
            };

            live.interaction.usersPcs.length += 1;
        };

        // 鍒涘缓涓诲姩鍒涘缓杩炴帴鐨凱C
        this.createOfferPeerConnection = function (chatuser) {
            var pc = new PeerConnection(this.iceServers);

            var p = live.interaction.local.type;
            if (p.video) {
                pc.addStream(live.interaction.local.video.stream);
            } else {
                pc.addStream(live.interaction.local.audio.stream);
            }

            // 濡傛灉妫€娴嬪埌濯掍綋娴佽繛鎺ュ埌鏈湴锛屽皢鍏剁粦瀹氬埌涓€涓猘udio鏍囩涓婅緭鍑�
            pc.onaddstream = function (event) {
                if (typeof window.on_cc_live_interaction_remote_media === 'function') {
                    window.on_cc_live_interaction_remote_media(live.interaction.local.type, chatuser, event.stream);
                }
            };

            pc.oniceconnectionstatechange = function (d) {
                debug('Interaction', 'iceConnectionState ...' + pc.iceConnectionState);

                if (pc.iceConnectionState == 'failed') {
                    debug('Interaction', 'iceConnectionState failed');

                    live.interaction.hangupInteraction();

                    if (typeof window.on_cc_live_interaction_disconnect === 'function') {
                        window.on_cc_live_interaction_disconnect({
                            disconnectid: DWLive.viewerid
                        });
                    }
                }
            };

            pc.createOffer(function (desc) {
                pc.setLocalDescription(desc);

                DWLive.sendInteractionMessage(p, chatuser.id, 'offer', desc);
            }, function (error) {
                if (typeof window.on_cc_live_interaction_error === 'function') {
                    window.on_cc_live_interaction_error(live.interaction.local.type, error, 'createOfferPeerConnection');
                }
            });

            pc.onicecandidate = function (event) {
                if (event.candidate !== null) {
                    DWLive.sendInteractionMessage(p, chatuser.id, '', event.candidate);
                }
            };

            live.interaction.usersPcs[chatuser.id] = {
                pc: pc,
                user: chatuser
            };

            live.interaction.usersPcs.length += 1;
        };

        this.id = opts.interaction.id;

        // 褰撳墠娴忚鍣ㄦ槸鍚︽敮鎸佷簰鍔ㄥ姛鑳�
        this.isSupportInteraction = function () {
            return window.location.protocol === 'https:' && !!(PeerConnection && URL && getUserMedia && nativeRTCIceCandidate && nativeRTCSessionDescription);
        };

        // 鎸傛柇浜掑姩
        this.hangupInteraction = function (callback) {
            if (this.isInteractioning) {
                Pusher.hangupInteraction(this.type, callback);
            } else if (this.isRequesting) {
                Pusher.cancelRequestInteraction(this.type, callback);
                this.stopLocalStream();
                this.cancelInteraction();
            } else {
                this.stopLocalStream();
                this.cancelInteraction();
            }
        };
    };

    // LivePlayer
    var LivePlayer = {
        id: 'livePlayer',

        swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

        isReady: false,

        isPublishing: 0,

        delay: '',

        foreignPublish: '',

        init: function () {
            var flashvars = {
                "userid": DWLive.userid,
                "roomid": DWLive.roomid,
                "foreignPublish": this.foreignPublish,
                "warmvideoid": this.warmVideoId,
                'openhostmode': this.openHostMode, // 澶氫富璁�
                'dvr': this.dvr,
                'barrage': this.barrageData,
                'backgroundImageUri': this.backgroundImageUri,
                'backgroundHint': this.backgroundHint,
                'countDownTime': DWLive.liveCountdown,
                'openMultiQuality':DWLive.multiQuality,
                'language': DWLive.language || '',
                'type': 'liveplayer'
            };

            var buffer = this.delay;
            if (buffer > 0) {
                flashvars.buffer = buffer;
            }

            var params = {
                allowFullscreen: 'true',
                allowScriptAccess: 'always',
                wmode: 'transparent'
            };

            swfobject.embedSWF(this.swfUrl, this.id, "100%", "100%", '10.0.0',
                '/flash/expressInstall.swf', flashvars, params);

        },

        getFlash: function () {
            return swfobject.getObjectById(this.id);
        },

        getPlayerTime: function () {
            var t = parseInt(this.getFlash()._time());
            if (isNaN(t) || t < 0) {
                return 0;
            }
            return t;
        },

        start: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.init();
            } else {

                if (!this.getFlash()) {
                    return;
                }
                this.isPublishing = 1;
                this.getFlash()._streamStart();
            }
        },

        end: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.end();
            } else {

                if (!this.getFlash()) {
                    return;
                }
                this.isPublishing = 0;
                this.getFlash()._streamEnd();
            }
        },

        // 寮瑰箷
        barrage: function (m) {
            if (!m) {
                return;
            }

            if (!this.getFlash()) {
                return;
            }

            if (this.getFlash()._jsTOASbarrage) {
                this.getFlash()._jsTOASbarrage(m);
            }
        },

        getLine: function () {
            var lines = this.getFlash().getLine();
            if (lines) {
                lines = JSON.parse(lines);
            }
            return lines;
        },

        changeLine: function (line) {
            this.getFlash().changeLine(line);
        },

        onlyAudio: function () {
            this.getFlash()._onlyAudio();
        },

        setSound: function (n) {
            this.getFlash()._SetSound(n);
        },

        // 鎵撳紑澹伴煶
        openSound: function () {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._onSound();
        },

        // 鍏抽棴澹伴煶
        closeSound: function () {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._unSound();
        },

        // 寮€鍚叧闂脊骞�
        openBarrage: function (b) {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._barrage(b);
        },

        showControl: function (b) {
            if (!this.getFlash()) {
                return;
            }
            this.getFlash()._ShowControl(b);
        },

        // 鏄剧ず璺戦┈鐏姛鑳�
        showMarquee: function (marquee) {
            if (!marquee) {
                return;
            }

            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._showMarqueePlugin(marquee);
        }
    };

    // window.LivePlayer = LivePlayer;

    window._onStart = function () {
//		鐩存挱鎾斁鍣ㄥ噯澶囧紑濮嬫挱鏀�
        LivePlayer.isReady = true;
    };

    function initDrawPanelInfo() {
        if (!isHistoryReady) {
            setTimeout(function () {
                initDrawPanelInfo();
            }, 3000);
            return;
        }

        if (draws.length) {
            DrawPanel.draws(draws);
            draws = [];
        }

        // 鏄剧ず鏈€鍚庝竴寮犲浘鐗�
        if (pageChanges.length) {
            var ppc = pageChanges.pop();
            if (!ppc) {
                return;
            }

            DrawPanel.filp(ppc);
            if (animations.length) {
                var animation = animations.pop();

                var animationJ = toJson(animation);
                var ppcJ = toJson(ppc);

                if (ppcJ.docid == animationJ.docid && ppcJ.time <= animationJ.time) {
                    DrawPanel.animationFilp(animation);
                }
            }

            pageChanges = [];
        }
    }

    // DrawPanel
    var DrawPanel = {
        id: 'drawPanel',

        isReady: false,

        isProcessing: false,

        getWidth: function () {
            return "100%";
        },

        getHeight: function () {
            return "100%";
        },

        swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

        init: function () {
            var flashvars = {
                'type': 'drawpanel'
            };
            var params = {
                allowFullscreen: 'true',
                allowScriptAccess: "always",
                wmode: 'transparent'
            };
            var attributes = {};

            if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {

                swfobject.embedSWF(this.swfUrl, this.id, this.getWidth(), this.getHeight(), "10.0.0", "/flash/expressInstall.swf", flashvars, params, attributes);

            }
        },

        getSwf: function () {
            if (!this.isReady) {
                return;
            }

            return swfobject.getObjectById(this.id);
        },

        clear: function () {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }
            swf._streamEnd();

            Pusher.pagechangedata = [];
            Pusher.drawjson = [];
        },

        // 鐢诲浘
        draw: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }
            swf.draw(j);
        },

        draws: function (js) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            (function (jstr) {
                setTimeout(function () {
                    swf.drawList(jstr);
                });
            })(js);
        },

        // 缈婚〉
        filp: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            var documentDisplayMode = DWLive.documentDisplayMode;
            if (documentDisplayMode == 1) {
                this.displayMode = 'auto';
            } else if (documentDisplayMode == 2) {
                this.displayMode = 'width';
            } else {
                this.displayMode = 'auto';
            }

            if (live.adapt !== undefined) {
                this.displayMode = live.adapt ? 'auto' : 'width';
            }

            var jj = JSON.parse(j);
            var u = jj.url;
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                jj.url = u.replace(/http:/g, 'https:');
            }

            swf.filp(JSON.stringify(jj), this.displayMode);
        },

        // 鍔ㄧ敾
        animationFilp: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            swf.animation(j);
        },


        // 寮瑰箷
        barrage: function (m) {
            if (!m) {
                return;
            }

            if (!this.getSwf()) {
                return;
            }

            if (this.getSwf()._jsTOASbarrage) {
                this.getSwf()._jsTOASbarrage(m);
            }
        },

        // 鏄剧ず璺戦┈鐏姛鑳�
        showMarquee: function (marquee) {
            if (!marquee) {
                return;
            }

            if (!this.getSwf()) {
                return;
            }

            this.getSwf().showMarqueeLight(marquee);
        }
    };


    var draws = [];
    var pageChanges = [];
    var animations = [];
    var isHistoryReady = false;

    // 鍘嗗彶鏁版嵁
    var History = function () {
        $.ajax({
            url: "//view.csslcloud.net/api/view/info?userid=" + DWLive.userid + '&roomid=' + DWLive.roomid,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if (!data.success) {
                    return;
                }

                if (!data.datas) {
                    return;
                }
                var datas = data.datas;
                var meta = datas.meta;
                if (!meta) {
                    return;
                }

                LivePlayer.isPublishing = meta.isPublishing;

                // 娌℃湁鎺ㄦ祦
                if (meta.isPublishing != 1) {
                    return;
                }

                var answers = meta.answer ? meta.answer : [];
                var questions = meta.question ? meta.question : [];
                for (var i = 0; i < answers.length; i++) {
                    var answer = answers[i];
                    for (var ii = 0; ii < questions.length; ii++) {
                        var question = questions[ii];
                        if (question.encryptId == answer.encryptId) {
                            answer.questionUserId = question.questionUserId;
                        }
                    }
                }

                if (questions && questions.length) {
                    for (var i = 0; i < questions.length; i++) {
                        var question = questions[i];
                        if (typeof DWLive.onQuestion === 'function') {
                            DWLive.onQuestion(JSON.stringify({
                                "action": "question",
                                "value": {
                                    "id": question.encryptId,
                                    "content": question.content,
                                    "userId": question.questionUserId,
                                    "userName": question.questionUserName,
                                    "isPublish": question.isPublish,
                                    "triggerTime": question.triggerTime,
                                    "userAvatar": question.userAvatar
                                }
                            }));
                        }
                    }
                }

                if (answers && answers.length) {
                    for (var i = 0; i < answers.length; i++) {
                        var answer = answers[i];
                        if (typeof DWLive.onAnswer === 'function') {
                            DWLive.onAnswer(JSON.stringify({
                                "action": "answer",
                                "value": {
                                    "questionId": answer.encryptId,
                                    "isPrivate": answer.isPrivate,
                                    "content": answer.content,
                                    "userId": answer.answerUserId,
                                    "userName": answer.answerUserName,
                                    "questionUserId": answer.questionUserId,
                                    "triggerTime": answer.triggerTime,
                                    "userAvatar": answer.userAvatar
                                }
                            }));
                        }
                    }
                }

                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
                    $.DrawingBoard.history(meta);
                }

                var chatLogs = meta.chatLog;
                if (chatLogs && chatLogs.length) {
                    var cls = [];
                    for (var i = 0; i < chatLogs.length; i++) {
                        var chatLog = chatLogs[i];

                        cls.push({
                            "userid": chatLog.userId,
                            "username": chatLog.userName,
                            "userrole": chatLog.userRole,
                            "useravatar": chatLog.userAvatar,
                            "msg": chatLog.content,
                            "time": "",
                            "usercustommark": chatLog.userCustomMark
                        });
                    }

                    if (typeof DWLive.onPublicChatMessage === 'function') {
                        for (var idx = 0; idx < cls.length; idx++) {
                            DWLive.onPublicChatMessage(JSON.stringify(cls[idx]));
                        }
                    }
                }

                var pageChange = meta.pageChange;
                if (pageChange && pageChange.length) {
                    pageChange.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    var lastPage = pageChange.pop();
                    pageChanges.push(JSON.stringify({
                        "fileName": lastPage.docName,
                        "totalPage": lastPage.docTotalPage,
                        "docid": lastPage.encryptDocId,
                        "url": lastPage.url,
                        "page": lastPage.pageNum,
                        "time": lastPage.time,
                        "useSDK": lastPage.useSDK
                    }));
                }

                var animation = meta.animation;
                if (animation && animation.length) {
                    animation.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    var lastAnimation = animation.pop();
                    animations.push(JSON.stringify({
                        "fileName": lastAnimation.docName,
                        "totalPage": lastAnimation.docTotalPage,
                        "docid": lastAnimation.encryptDocId,
                        "url": lastAnimation.url,
                        "page": lastAnimation.pageNum,
                        "time": lastAnimation.time,
                        "step": lastAnimation.step
                    }));
                }

                var draw = meta.draw;
                if (draw && draw.length) {
                    for (var i = 0; i < draw.length; i++) {
                        draws.push(draw[i].data);
                    }
                }

                isHistoryReady = true;
            }
        });
    };


    var opts = {
        // 浜掑姩淇℃伅
        interaction: {
            id: 'interactionPlayer',
            width: '100%',
            height: '100%'
        }
    };
    var Live = function (opts) {
        this.interaction = new Interaction(opts);
    };
    var live = new Live(opts);


    window.on_drampanel_ready = function () {
        // 鐢绘澘Flash鍔犺浇瀹屾垚鍥炶皟
        DrawPanel.isReady = true;
        setTimeout(function () {
            initDrawPanelInfo();
        }, 1500);
    };


    // 鐢诲浘浜嬩欢
    window.on_cc_live_dw_draw = function (data) {
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.draw(JSON.stringify(j.value.data));
        }, getDeltaTime());
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };

    // 缈婚〉浜嬩欢
    window.on_cc_live_dw_page_change = function (data) {
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.filp(JSON.stringify(j.value));
        }, getDeltaTime());
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };

    // 鍔ㄧ敾缈婚〉浜嬩欢
    window.on_cc_live_dw_animation_change = function (data) {
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.animationFilp(JSON.stringify(j.value));
        }, getDeltaTime());
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };


    // Chat
    var Chat = {
        init: function () {
            Pusher.socket.on('chat_message', function (j) {
                if (typeof DWLive.onPublicChatMessage === "function") {
                    DWLive.onPublicChatMessage(j);
                }
            });

            // 娑堟伅鎻愰啋
            Pusher.socket.on('notification', function (j) {
                if (typeof DWLive.onNotification === "function") {
                    DWLive.onNotification(j);
                }
            });

            Pusher.socket.on('information', function (j) {
                if (typeof DWLive.onInformation === "function") {
                    DWLive.onInformation(j);
                }
            });

            // 鎺ユ敹鍙戦€佺鑱婂嚱鏁�
            Pusher.socket.on('private_chat_self', function (j) {
                if (typeof DWLive.onPrivateChatMessage === "function") {
                    DWLive.onPrivateChatMessage(j);
                }
            });

            // 鎺ユ敹鍥炵瓟绉佽亰鍑芥暟
            Pusher.socket.on('private_chat', function (j) {
                if (typeof DWLive.onPrivateAnswer === "function") {
                    DWLive.onPrivateAnswer(j);
                }
            });

            // 鍦ㄧ嚎鍒楄〃
            Pusher.socket.on('room_context', function (msg) {

            });

            // 鑷畾涔夋秷鎭�
            Pusher.socket.on('custom_message', function (j) {
                if (typeof DWLive.onCustomChatMessage === "function") {
                    DWLive.onCustomChatMessage(j);
                }
            });
        }
    };

    // Qa
    var Qa = {
        init: function () {

            // 闂瓟->鎻愪氦闂
            Pusher.socket.on('question', function (j) {
                if (typeof DWLive.onQuestion === "function") {
                    DWLive.onQuestion(j);
                }
                if (typeof DWLive.onQuestionSend === "function") {
                    DWLive.onQuestionSend(j);
                }
            });

            // 闂瓟->杩斿洖绛旀
            Pusher.socket.on('answer', function (j) {
                if (typeof DWLive.onAnswer === "function") {
                    DWLive.onAnswer(j);
                }
                if (typeof DWLive.onAnswerSend === "function") {
                    DWLive.onAnswerSend(j);
                }
            });
        }
    };


    var MobileLive = {

        src: '',
        audio: false,
        line: 0,

        init: function () {
            var _this = this;
            $.ajax({
                url: "//zeus.csslcloud.net/api/hls/play",
                type: "GET",
                dataType: "json",
                data: {roomid: DWLive.roomid, userid: DWLive.userid},
                success: function (data) {
                    var status = data.live.status;
                    if (status == 0) {
                        _this.m3u8 = data.live.m3u8;
                        _this.src = data.live.m3u8;

                        _this.secureHosts = data.live.secureHosts || [];
                        _this.audioM3u8 = data.live.audioM3u8 || [];
                        _this.audioSecureHosts = data.live.audioSecureHosts || [];
                        _this.isHttps = window.location.protocol === 'https:';
                        if (_this.isHttps && _this.secureHosts && _this.secureHosts.length) {
                            _this.m3u8 = _this.secureHosts;
                        }

                        _this.appendVideo(_this.m3u8[0]);

                        if (typeof DWLive.onLiveStarting === 'function') {
                            DWLive.onLiveStarting();
                        }
                    }

                }
            });
        },

        appendVideo: function (s) {
            var v = '<video webkit-playsinline playsinline controls autoplay x-webkit-airplay="allow" x5-playsinline width="100%" height="100%" src="' + s + '"></video>';
            $("#" + LivePlayer.id).html(v);

            DWLive.onKickOut = function () {
                $("#" + LivePlayer.id).html('');
            };

        },

        end: function () {
            $("#" + LivePlayer.id).html('');
        },

        appendDoc: function (s) {
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                s = s.replace(/http:/g, 'https:');
            }

            var img = '<img src="' + s + '" />';
            $("#" + DrawPanel.id).html(img);
        },

        changeLine: function (line) {
            $("#" + LivePlayer.id).find("video").attr('src', this.m3u8[line]);
            this.line = line;

            if (MobileLive.audio) {
                audio.src = '';
                audio.src = this.m3u8[this.line];
                audio.play();
            }
        },

        onlyAudio: function () {
            var v = $("#" + LivePlayer.id).find("video");
            MobileLive.audio = !MobileLive.audio;
            if (MobileLive.audio) {
                if (this.isHttps && this.audioSecureHosts && this.audioSecureHosts.length) {
                    this.m3u8 = this.audioSecureHosts;
                } else {
                    this.m3u8 = this.audioM3u8;
                }
                audio = new Audio();
                audio.src = this.m3u8[this.line];
                audio.play();
            } else {
                if (this.isHttps && this.secureHosts && this.secureHosts.length) {
                    this.m3u8 = this.secureHosts;
                } else {
                    this.m3u8 = this.src;
                }
                audio.src = '';
                v.attr('src', this.m3u8[this.line]);
            }
        },

        isMobile: function () {
            if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
                return 'isMobile';
            }
        },

        isIPad: function () {
            return navigator.userAgent.match(/iPad/i) != null;
        },

        isIPhone: function () {
            return navigator.userAgent.match(/iPhone/i) != null;
        },

        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) != null;
        },

        isWindowsPhone: function () {
            return navigator.userAgent.match(/Windows Phone/i) != null;
        }

    };

    // 鎺ュ彈璇煶浜掑姩璇锋眰
    window.on_cc_live_accept_interaction = function (data) {
        DWLive.closeSound();

        // 娓呴櫎璇锋眰瓒呮椂璁℃椂鍣�
        live.interaction.clearRequestTimeoutTimer();

        DWLive.enterInteractionRoom();

        live.interaction.isInteractioning = true;

        live.interaction.setCallingTimer();

        if (typeof window.on_cc_live_interaction_accept === 'function') {
            window.on_cc_live_interaction_accept(live.interaction.local.type, toJson(data));
        }
    };

    // 涓诲姩杩炴帴璇煶鑱婂ぉ淇℃伅
    window.on_cc_live_interaction_chatusers = function (data) {
        data = toJson(data);
        $.each(data, function (index, chatuser) {
            if (chatuser.id == DWLive.viewerid) {
                return true;
            }

            // 瀹㈡埛绔彧鏄拰涓绘挱杩涜璇煶浜掑姩
            if (chatuser.role == 'publisher' && !chatuser.isMainSpeaker) {
                return true;
            }

            live.interaction.createOfferPeerConnection(chatuser);
        });

    };

    // 鎺ユ敹浜掑姩淇℃伅
    window.on_cc_live_interaction_message = function (d) {
        var d = toJson(d);

        debug('Interaction', 'rtc浜掑姩淇℃伅:' + JSON.stringify(d));

        var toId = d.toid;
        var fromId = d.fromid;
        var fromName = d.fromname;
        var type = d.type;
        var data = d.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        var event = d.event;

        if (event === 'offer') {
            data.type = event;

            live.interaction.createAnswerPeerConnection({
                id: fromId,
                name: fromName,
                type: type
            });

            var pc = live.interaction.usersPcs[fromId].pc;
            if (!pc) {
                return;
            }

            pc.setRemoteDescription(new nativeRTCSessionDescription(data));
            pc.createAnswer(function () {
            }, function (error) {
                debug('Interaction', 'Failure callback: ' + error);
            });

        } else if (event === 'answer') {
            var pc = live.interaction.usersPcs[fromId].pc;
            if (!pc) {
                return;
            }

            data.type = event;

            debug('Interaction', 'answer spark_message淇℃伅:' + data);
            pc.setRemoteDescription(new nativeRTCSessionDescription(data));

            pc.receivedAnswer = true;
            if (!pc.hasAddIce && pc.RTCICE) {
                pc.addIceCandidate(pc.RTCICE);
            }

        } else {
            var u = live.interaction.usersPcs[fromId];
            if (!u) {
                u = live.interaction.usersPcs[toId];
            }
            var pc = u ? u.pc : null;

            if (!pc) {
                return;
            }

            // 鏀跺埌answer涔嬪悗鍐峚ddIce
            var ice = new RTCIceCandidate(data);
            if (pc.receivedAnswer) {
                pc.hasAddIce = true;
                pc.addIceCandidate(ice);
            } else {
                pc.hasAddIce = false;
                pc.RTCICE = ice;
            }

        }
    };

    // 鎵撳嵃debug淇℃伅
    var debug = function (t, d) {
        var isDegbug = false;
        if (!isDegbug) {
            return;
        }

        if (console && typeof console.log === 'function') {
            console.log(t, d);
        }
    };

    function toJson(data) {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return {};
            }
        }

        return data;
    }

    window.DWLive = DWLive;
    window.live = live;

    // live player ready
    window._swfInit = function () {
        if (typeof window.on_cc_live_player_ready === 'function') {
            window.on_cc_live_player_ready();
        }
    };

    /**
     * Flash 鍔犺浇瀹屾垚
     * */
    window._swfOk = function (id) {
        if (typeof window.on_cc_swf_loading_completed === 'function') {
            window.on_cc_swf_loading_completed(id);
        }
    };

    function getDeltaTime() {
        var b = LivePlayer.delay;
        if (isNaN(b) || b < 0) {
            b = 0;
        }
        b = b * 1000;

        // 浣庡欢杩�
        if (MobileLive.isMobile() == 'isMobile') {
            if (b === 0) {
                return 5000;
            } else {
                return 10000;
            }
        } else {
            if (b === 0) {
                return 1300;
            } else {
                return 3000;
            }
        }
    }

})(window);