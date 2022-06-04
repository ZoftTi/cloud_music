import request from "../../utils/request"

// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [], // 推荐歌单数据
    topList: [], // 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request("/banner", { type: 2 })

    let recommendListData = await request("/personalized", { limit: 10 })

    let index = 0
    let resultArr = []
    while (index < 5) {
      let topListData = await request("/top/list", { idx: index++ })
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3),
      }
      resultArr.push(topListItem)

      this.setData({
        topList: resultArr,
      })
    }

    this.setData({
      bannerList: bannerListData.banners,
      recommendList: recommendListData.result,
    })
  },

  // 跳转至每日推荐页面
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
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
