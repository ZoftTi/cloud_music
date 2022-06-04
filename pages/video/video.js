import request from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航标签数据
    navId: "", //导航的标识
    videoList: [], // 视频列表数据
    videoId: "",
    videoUpdateTime: [], // 记录 Video 播放的时长
    isTriggered: false, //标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据方法调用
    this.getVideoGroupListData()
  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request("/video/group/list")
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id,
    })

    this.getVideoList(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request("/video/group", { id: navId })
    // 关闭加载提示框
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map((item) => {
      item.id == index++
      return item
    })

    this.setData({
      videoList,
      isTriggered: false,
    })
  },

  // 点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id // 通过 id 向 currentTarget 传递参数是， number 会被自动转换为字符串(string)
    this.setData({
      videoList: [],
      navId: navId >>> 0,
    })
    wx.showLoading({ title: "正在加载" })
    this.getVideoList(navId)
  },

  handlePlay(event) {
    let vid = event.currentTarget.id
    // if (this.videoContext && this.vid !== vid) {
    //   this.videoContext.stop()
    // }
    // this.vid = vid;
    this.setData({
      videoId: vid,
    })

    this.videoContext = wx.createVideoContext(vid)
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find((item) => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  handleTimeUpdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime,
    }
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === videoTimeObj.vid
    )
    if (videoItem) {
      videoItem.currentTime = videoTimeObj.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime,
    })
  },

  handleEnded(event) {
    // 播放结束事件处理函数
    let { videoUpdateTime } = this.data
    videoUpdateTime.splice(
      videoUpdateTime.findIndex((item) => item.vid === event.currentTarget.id),
      1
    )
    this.setData({
      videoUpdateTime,
    })
  },

  // 自定义下拉刷新
  handleRefresher() {
    console.log("scroll-view 下拉刷新")
    this.getVideoList(this.data.navId)
  },

  // 自定义上拉加载
  handleTolower() {
    console.log('上拉加载')
    // 数据分页效果 1.前端分页，2.后端分页
    console.log('发送请求 || 在前端截取最新的数据 || 添加到视频列表的后方')
    console.log('网易云音乐没有提供分页的api');
    // 模拟数据
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_416038EEC24BA525E1621A4DD844FA29",
          "coverUrl": "https://p1.music.126.net/XzCtQf9pr8BAKJOZmRE_dg==/109951163953101558.jpg",
          "height": 1080,
          "width": 1920,
          "title": "【完整对比版】波西米亚狂想曲-拯救生命Live Aid",
          "description": "【完整对比版】#波西米亚狂想曲#-拯救生命#Queen#Live Aid ",
          "commentCount": 597,
          "shareCount": 4164,
          "resolutions": [
            { "resolution": 240, "size": 162366977 },
            { "resolution": 480, "size": 265269353 },
            { "resolution": 720, "size": 381089106 },
            { "resolution": 1080, "size": 499805440 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/UTZkGdW684RsykT993RkDA==/109951165465167346.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1004400,
            "birthday": 883584000000,
            "userId": 65963621,
            "userType": 207,
            "nickname": "duoliming13",
            "signature": "享受生活乐趣，总不能把生活想的太严肃，一切皆有可能!",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165465167340,
            "backgroundImgId": 18796151278683610,
            "backgroundUrl": "http://p1.music.126.net/B9Bil6W9FNUuDTKnjQT1hQ==/18796151278683608.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": { "1": "音乐视频达人", "2": "欧美音乐资讯达人" },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951165465167346",
            "backgroundImgIdStr": "18796151278683608"
          },
          "urlInfo": {
            "id": "416038EEC24BA525E1621A4DD844FA29",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/NFDJUJEP_2398860822_uhd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=dyxKwJefShBTXhDjdbsjVXuqKBQRkcaW&sign=6ba0a7b85adc44d28d78fada1b2a185b&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 499805440,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 9102, "name": "演唱会", "alg": null },
            { "id": 57106, "name": "欧美现场", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null },
            { "id": 107113, "name": "Queen", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Bohemian Rhapsody",
              "id": 1868553,
              "pst": 0,
              "t": 0,
              "ar": [{ "id": 41906, "name": "Queen", "tns": [], "alias": [] }],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 24,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 188637,
                "name": "Absolute Greatest",
                "picUrl": "http://p4.music.126.net/F8R535oP-V4UOa0O2n1Y9Q==/798245441818276.jpg",
                "tns": [],
                "pic": 798245441818276
              },
              "dt": 356626,
              "h": { "br": 320000, "fid": 0, "size": 14268125, "vd": -22543 },
              "m": { "br": 192000, "fid": 0, "size": 8560893, "vd": -19949 },
              "l": { "br": 128000, "fid": 0, "size": 5707276, "vd": -18463 },
              "a": null,
              "cd": "1",
              "no": 20,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7003,
              "mv": 5307670,
              "publishTime": 1257868800007,
              "privilege": {
                "id": 1868553,
                "fee": 8,
                "payed": 1,
                "st": 0,
                "pl": 999000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "416038EEC24BA525E1621A4DD844FA29",
          "durationms": 1293375,
          "playTime": 1140190,
          "praisedCount": 14258,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_ABF850E263F6E62F9EB3D97F60E6AB68",
          "coverUrl": "https://p1.music.126.net/aYGmQ2kusw94NUxhJVKuYw==/109951164021937379.jpg",
          "height": 1080,
          "width": 1920,
          "title": "BLACKPINK 美国科切拉音乐节第二场 JENNIE - SOLO",
          "description": "20190420 BLACKPINK 美国科切拉音乐节第二场 Coachella day2 JENNIE SOLO",
          "commentCount": 787,
          "shareCount": 1815,
          "resolutions": [
            { "resolution": 240, "size": 21598933 },
            { "resolution": 480, "size": 33027849 },
            { "resolution": 720, "size": 46187154 },
            { "resolution": 1080, "size": 68071492 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1010000,
            "birthday": 631202975999,
            "userId": 85203994,
            "userType": 0,
            "nickname": "用户85203994",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165647004060,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165647004069",
            "backgroundImgIdStr": "109951162868126486"
          },
          "urlInfo": {
            "id": "ABF850E263F6E62F9EB3D97F60E6AB68",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/vfBv3POq_2457743261_uhd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=vbKmYVAXdpLhzdOJofqiOgRlaVFtNOCz&sign=066034228f88a79b89f352b08ba361a3&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 68071492,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 1101, "name": "舞蹈", "alg": null },
            { "id": 57107, "name": "韩语现场", "alg": null },
            { "id": 57108, "name": "流行现场", "alg": null },
            { "id": 58104, "name": "音乐节", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null },
            { "id": 92105, "name": "BLACKPINK", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [101],
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "ABF850E263F6E62F9EB3D97F60E6AB68",
          "durationms": 196438,
          "playTime": 3238964,
          "praisedCount": 25250,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_63028C819652DF1CBBE1D65574451166",
          "coverUrl": "https://p1.music.126.net/DMO1FNZENhR2_TQFZeQvnA==/109951163574225329.jpg",
          "height": 720,
          "width": 1280,
          "title": "《篝火旁》马子林×吕大叶",
          "description": null,
          "commentCount": 373,
          "shareCount": 496,
          "resolutions": [
            { "resolution": 240, "size": 36781786 },
            { "resolution": 480, "size": 60808318 },
            { "resolution": 720, "size": 81478378 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 230000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/9l1I6psuhZAVdzdqcM47YQ==/109951166928082290.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 230100,
            "birthday": -2209017600000,
            "userId": 129957833,
            "userType": 0,
            "nickname": "赤楚卫卫二",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166928082290,
            "backgroundImgId": 109951165630114050,
            "backgroundUrl": "http://p1.music.126.net/qbl1m65D9OucnBgMJ5yhXA==/109951165630114046.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 10,
            "remarkName": null,
            "avatarImgIdStr": "109951166928082290",
            "backgroundImgIdStr": "109951165630114046"
          },
          "urlInfo": {
            "id": "63028C819652DF1CBBE1D65574451166",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/qH3DCxIt_1913976425_shd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=IagxDkXuhccjQjMppPXSRWoyVsyMrHZX&sign=eda5110f2401c91a586e5240c4b317ac&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 81478378,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 59101, "name": "华语现场", "alg": null },
            { "id": 57110, "name": "饭拍现场", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "篝火旁",
              "id": 518725853,
              "pst": 0,
              "t": 0,
              "ar": [
                { "id": 12606272, "name": "吕大叶", "tns": [], "alias": [] },
                { "id": 12798308, "name": "马子林Broma", "tns": [], "alias": [] },
                { "id": 49046111, "name": "陈觅Lynne", "tns": [], "alias": [] }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 1,
              "v": 59,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 36676066,
                "name": "313",
                "picUrl": "http://p4.music.126.net/sN5dTpmeJO1DhxIj1ogMLg==/109951163416453597.jpg",
                "tns": [],
                "pic_str": "109951163416453597",
                "pic": 109951163416453600
              },
              "dt": 219569,
              "h": { "br": 320000, "fid": 0, "size": 8785005, "vd": -47982 },
              "m": { "br": 192000, "fid": 0, "size": 5271021, "vd": -45381 },
              "l": { "br": 128000, "fid": 0, "size": 3514029, "vd": -43699 },
              "a": null,
              "cd": "01",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1403818,
              "mv": 0,
              "publishTime": 1508947200000,
              "privilege": {
                "id": 518725853,
                "fee": 208388736,
                "payed": 1,
                "st": 0,
                "pl": 999000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 999000,
                "toast": false,
                "flag": 2,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "63028C819652DF1CBBE1D65574451166",
          "durationms": 215637,
          "playTime": 1016692,
          "praisedCount": 6960,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_798A61E3D92A593BA6B08C8F2483C9F4",
          "coverUrl": "https://p1.music.126.net/KZKGvWVBWIF2TOzv_Q1jSg==/109951163574185316.jpg",
          "height": 1080,
          "width": 1920,
          "title": "摇滚史上最著名的三场雨之一：X Japan - Endless Rain",
          "description": "摇滚史上最著名的三场雨之一：X Japan - Endless Rain",
          "commentCount": 1146,
          "shareCount": 3073,
          "resolutions": [
            { "resolution": 240, "size": 112615523 },
            { "resolution": 480, "size": 199969611 },
            { "resolution": 720, "size": 299515243 },
            { "resolution": 1080, "size": 520517745 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 450000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/lVTaNtFdNVh2HhD0ORhAaA==/109951163601870551.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 450100,
            "birthday": 692121600000,
            "userId": 255096203,
            "userType": 0,
            "nickname": "John_分享",
            "signature": "用音乐点缀怒放的生命。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163601870540,
            "backgroundImgId": 109951163285208750,
            "backgroundUrl": "http://p1.music.126.net/lpOxaFlD6ems9969KHltcg==/109951163285208749.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": { "1": "音乐视频达人" },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163601870551",
            "backgroundImgIdStr": "109951163285208749"
          },
          "urlInfo": {
            "id": "798A61E3D92A593BA6B08C8F2483C9F4",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Umb0TLzY_1891743933_uhd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=zFgIegILdmQeCFvcTLxxGdDWGKoLqBDO&sign=28144af7017718adc4fc73aeaf114db4&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 520517745,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 60101, "name": "日语现场", "alg": null },
            { "id": 59108, "name": "巡演现场", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "ENDLESS RAIN",
              "id": 865251,
              "pst": 0,
              "t": 0,
              "ar": [{ "id": 161765, "name": "X JAPAN", "tns": [], "alias": [] }],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 9,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 86350,
                "name": "X JAPAN BEST 〜FAN'S SELECTION〜",
                "picUrl": "http://p3.music.126.net/n82BX-qXhybJniZp35w-yQ==/834529325482293.jpg",
                "tns": [],
                "pic": 834529325482293
              },
              "dt": 396000,
              "h": { "br": 320000, "fid": 0, "size": 15845985, "vd": -2 },
              "m": { "br": 192000, "fid": 0, "size": 9507634, "vd": -2 },
              "l": { "br": 128000, "fid": 0, "size": 6338459, "vd": -2 },
              "a": null,
              "cd": "1",
              "no": 3,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7001,
              "mv": 0,
              "publishTime": 1008691200000,
              "privilege": {
                "id": 865251,
                "fee": 8,
                "payed": 1,
                "st": 0,
                "pl": 320000,
                "dl": 320000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 0,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "798A61E3D92A593BA6B08C8F2483C9F4",
          "durationms": 848063,
          "playTime": 941492,
          "praisedCount": 7364,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_95A292A03A6597351276263E6FB92C30",
          "coverUrl": "https://p2.music.126.net/UZ0fTUFRadXeiI9ZxXo9Hg==/109951163689716415.jpg",
          "height": 360,
          "width": 640,
          "title": "十岁小女孩Anisa震惊全场.导师邀请她坐到自己座位Traffic Lights",
          "description": "德国儿童好声音",
          "commentCount": 934,
          "shareCount": 3690,
          "resolutions": [
            { "resolution": 720, "size": 114580328 },
            { "resolution": 480, "size": 98671197 },
            { "resolution": 240, "size": 58566984 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 420000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/u2UclkSLln_uY3cLodf32A==/7945071023153547.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 421300,
            "birthday": 591120000000,
            "userId": 77798117,
            "userType": 204,
            "nickname": "管管736",
            "signature": "传递快乐，治愈不开心。B站：管管丶",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 7945071023153547,
            "backgroundImgId": 2002210674180199,
            "backgroundUrl": "http://p1.music.126.net/VTW4vsN08vwL3uSQqPyHqg==/2002210674180199.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "7945071023153547",
            "backgroundImgIdStr": "2002210674180199"
          },
          "urlInfo": {
            "id": "95A292A03A6597351276263E6FB92C30",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/uD1qgeZi_2149033308_shd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=eeNgOZOdTWgsihwPfkfDOqjsfGzUoOXX&sign=b3862df96504339948c6087b7dd58d86&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 114580328,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null },
            { "id": 4101, "name": "娱乐", "alg": null },
            { "id": 3101, "name": "综艺", "alg": null },
            { "id": 75122, "name": "欧美综艺", "alg": null },
            { "id": 14212, "name": "欧美音乐", "alg": null },
            { "id": 76108, "name": "综艺片段", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "95A292A03A6597351276263E6FB92C30",
          "durationms": 509142,
          "playTime": 2679061,
          "praisedCount": 21017,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_27ED96334E4330F771D32E8031DB5C91",
          "coverUrl": "https://p1.music.126.net/nL7jSs6Uuio6a_f-BToTFQ==/109951163683160006.jpg",
          "height": 1080,
          "width": 1920,
          "title": "卢冠廷现场弹唱《一生所爱》，感动全场！",
          "description": "#国风极乐夜#\n极乐夜，潮国风\n看着大话西游经典电影片段，时过境迁，有一种说不来的感觉。卢冠廷的《一生所爱》，真是经典啊！",
          "commentCount": 62,
          "shareCount": 182,
          "resolutions": [
            { "resolution": 240, "size": 32198394 },
            { "resolution": 480, "size": 59484925 },
            { "resolution": 720, "size": 94350191 },
            { "resolution": 1080, "size": 215369519 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/BpzBMB6E2x-h2IvL-xkAtw==/109951164879712373.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 330100,
            "birthday": -2209017600000,
            "userId": 1651057385,
            "userType": 10,
            "nickname": "LOOK直播现场",
            "signature": "LOOK官方直播间",
            "description": "网易云音乐LOOK直播官方频道",
            "detailDescription": "网易云音乐LOOK直播官方频道",
            "avatarImgId": 109951164879712370,
            "backgroundImgId": 109951163708728960,
            "backgroundUrl": "http://p1.music.126.net/lUYJUlMZ49dTHYAKuIZuXw==/109951163708728963.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164879712373",
            "backgroundImgIdStr": "109951163708728963"
          },
          "urlInfo": {
            "id": "27ED96334E4330F771D32E8031DB5C91",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/J2yLqIwp_2140783179_uhd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=TarJKgsiNfUagFzqDhmlMOTGIRDVRJIw&sign=ff345148711d516a0cc436bd33ca7d9b&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 215369519,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 59101, "name": "华语现场", "alg": null },
            { "id": 57108, "name": "流行现场", "alg": null },
            { "id": 58104, "name": "音乐节", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 4110, "name": "古风", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [101, 111],
          "relateSong": [
            {
              "name": "一生所爱",
              "id": 25707139,
              "pst": 0,
              "t": 0,
              "ar": [
                { "id": 3697, "name": "卢冠廷", "tns": [], "alias": [] },
                { "id": 8926, "name": "莫文蔚", "tns": [], "alias": [] }
              ],
              "alia": [
                "电影《大话西游》插曲",
                " 电影《港囧》插曲",
                " 《热血街舞团》第九期背景音乐"
              ],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 808,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 2286009,
                "name": "齐天周大圣之西游双记 电影歌乐游唱版",
                "picUrl": "http://p3.music.126.net/ZwOyxtml-t4cra3hRy7CkQ==/6634453162971822.jpg",
                "tns": [],
                "pic": 6634453162971822
              },
              "dt": 273666,
              "h": { "br": 320000, "fid": 0, "size": 10949529, "vd": 10028 },
              "m": { "br": 192000, "fid": 0, "size": 6569735, "vd": 12690 },
              "l": { "br": 128000, "fid": 0, "size": 4379838, "vd": 14378 },
              "a": null,
              "cd": "1",
              "no": 6,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 2,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 684010,
              "mv": 28061,
              "publishTime": 799257600007,
              "privilege": {
                "id": 25707139,
                "fee": 8,
                "payed": 1,
                "st": 0,
                "pl": 999000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "27ED96334E4330F771D32E8031DB5C91",
          "durationms": 288853,
          "playTime": 154042,
          "praisedCount": 830,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_4D5E04BC9706777AA7F36840AF9E8366",
          "coverUrl": "https://p2.music.126.net/TezaHwHI6PyzGfWXPNabVg==/109951164312079353.jpg",
          "height": 720,
          "width": 1280,
          "title": "王一博舞蹈",
          "description": "入坑舞",
          "commentCount": 187,
          "shareCount": 964,
          "resolutions": [
            { "resolution": 240, "size": 20096166 },
            { "resolution": 480, "size": 33780994 },
            { "resolution": 720, "size": 44800256 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/8un5MZ1WY4DIhjIa2d0IMQ==/109951163161953272.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 1010000,
            "birthday": -1572786946610,
            "userId": 101793214,
            "userType": 0,
            "nickname": "殿下请小心",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163161953280,
            "backgroundImgId": 3383197280655488,
            "backgroundUrl": "http://p1.music.126.net/QDWMQGNsR1lNfXtd1MYyTg==/3383197280655488.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163161953272",
            "backgroundImgIdStr": "3383197280655488"
          },
          "urlInfo": {
            "id": "4D5E04BC9706777AA7F36840AF9E8366",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/xMBlRNNL_2653179611_shd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=sXfiELdMgOpyRluCAvaYRCVFdHdtUKZs&sign=1e6332e61f1dd2306b07a8f3c8abacbc&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 44800256,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 1101, "name": "舞蹈", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null },
            { "id": 3100, "name": "影视", "alg": null },
            { "id": 23126, "name": "电视剧", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "4D5E04BC9706777AA7F36840AF9E8366",
          "durationms": 119241,
          "playTime": 381890,
          "praisedCount": 5856,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_5662034FE93CDDC9B5E3DFBC55F88AEA",
          "coverUrl": "https://p2.music.126.net/DXqoO5nSm2TLkiJ8FUnCUw==/109951163755073900.jpg",
          "height": 1080,
          "width": 1920,
          "title": "【特别舞台】181228 女团性感担当们的合作舞台《hush》",
          "description": "【特别舞台】181228 女团性感担当们（JOY 李美珠 金韶情 金祉呼 周子瑜 妍雨）的合作舞台《hush》",
          "commentCount": 333,
          "shareCount": 175,
          "resolutions": [
            { "resolution": 240, "size": 31803763 },
            { "resolution": 480, "size": 57060248 },
            { "resolution": 720, "size": 86165268 },
            { "resolution": 1080, "size": 121371213 }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/vYHGILLfWWof6ogz1HwxKQ==/109951164491145822.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 310101,
            "birthday": 1262275200000,
            "userId": 1335061865,
            "userType": 204,
            "nickname": "仙宫频道",
            "signature": "plmm爱好者/个人收藏bot",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164491145820,
            "backgroundImgId": 109951164829202080,
            "backgroundUrl": "http://p1.music.126.net/PNGXsjXd_IYT0vvkXeoonQ==/109951164829202086.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": { "1": "音乐视频达人", "2": "音乐图文达人" },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164491145822",
            "backgroundImgIdStr": "109951164829202086"
          },
          "urlInfo": {
            "id": "5662034FE93CDDC9B5E3DFBC55F88AEA",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/dg5z4KrL_2218696827_uhd.mp4?ts=1642483869&rid=D32B1DC0AA8779B480DA1F5BCABC2C5E&rl=3&rs=qJyUuzzWorRpAIVSzNWBFoNHtnSmyqJa&sign=4312017b05df202acb5ba622670d811f&ext=B%2B8uFNJi80edTx89VYckGH9r5Iv0f1TC71yIKFe9mE%2BrL45Ia8ch0JhJu5gcqz527ZiOjN9pb5RpkJrvKe2YJ0b4OT2T%2F9SiCEJhWyELWzEnlN2AKLqaL6GAZO8d7pk013NtsDYPIs296NXZfqaJoSm%2F%2BtrUloHrDhfgZcA%2FBcZg04RU669hDA1dAFVc%2B8Z0fvVrFr7fnOhQsF5AcFEFe1804AukWv2XS3ftSA4rwI%2BNY%2BdkJsOqmLvRiuSJDxwt",
            "size": 121371213,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            { "id": 58100, "name": "现场", "alg": null },
            { "id": 1101, "name": "舞蹈", "alg": null },
            { "id": 9102, "name": "演唱会", "alg": null },
            { "id": 57107, "name": "韩语现场", "alg": null },
            { "id": 57108, "name": "流行现场", "alg": null },
            { "id": 1100, "name": "音乐现场", "alg": null },
            { "id": 5100, "name": "音乐", "alg": null },
            { "id": 23130, "name": "TWICE", "alg": null }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "5662034FE93CDDC9B5E3DFBC55F88AEA",
          "durationms": 211455,
          "playTime": 254028,
          "praisedCount": 1687,
          "praised": false,
          "subscribed": false
        }
      }
    ]

    let videoList = this.data.videoList
    videoList.push(...newVideoList)
    this.setData({
      videoList
    })
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('页面下拉处理');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉处理');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({ from }) {
    if (from === 'button') {
      return {
        title: '来自button的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: '来自menu的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  },
})
