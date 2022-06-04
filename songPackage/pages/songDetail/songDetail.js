import PubSub from "pubsub-js"
import moment from "moment"
import request from "../../../utils/request"
const appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    musicLink: "",
    navHeight: 0,
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          navHeight: res.statusBarHeight + 46,
        })
      },
      fail(err) {
        console.log(err)
      },
    })

    this.getMusicInfo(options.musicId)

    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicId == options.musicId
    ) {
      this.setData({
        isPlay: true,
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = options.musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐自然结束播放
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换到下一首音乐-并且自动播放
      PubSub.publish("switchType", 'next')
      // 还原进度条为0，时间为0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00',
      })
    })
    
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 480
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  changePlayState(isPlay) {
    this.setData({
      isPlay,
    })

    appInstance.globalData.isMusicPlay = isPlay
  },
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request("/song/detail", { ids: musicId })
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')

    this.setData({
      song: songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  // 点击播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    let { song, musicLink } = this.data
    this.musicControl(isPlay, song.id, musicLink)
  },

  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      // 音乐播放
      // 获取音乐播放链接
      if (!musicLink) {
        let musicLinkData = await request("/song/url", { id: musicId })
        musicLink = musicLinkData.data[0].url

        this.setData({
          musicLink,
        })
      }

      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      // 暂停音乐
      this.backgroundAudioManager.pause()
    }
  },

  handleSwitch(event) {
    let type = event.currentTarget.id

    // 关闭当前播放的音乐
    // this.backgroundAudioManager.stop()
    this.musicControl(false)

    PubSub.publish("switchType", type)

    PubSub.subscribe("musicId", (msg, musicId) => {
      // 获取音乐详情
      this.getMusicInfo(musicId)
      // 自动播放音乐
      this.musicControl(true, musicId)
      // 取消订阅播放
      PubSub.unsubscribe("musicId")
    })
  },

  handlePageBack() {
    wx.navigateBack({
      delta: 1,
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
