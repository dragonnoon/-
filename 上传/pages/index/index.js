// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    inputValue:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  inputCom(e){
      this.setData({
          inputValue:e.detail.value
      })
  },
  upload(){
    var that = this
    var name_human = ''
    name_human = that.data.inputValue
    console.log(name_human)
    wx.chooseImage({
        count:1,
        sizeType:["original", "compressed"],
        sourceType:["album", "camera"],
        success:function(res){
            // console.log("上传成功！")
            var tempFilePaths = res.tempFilePaths
            for (var i = 0;i<tempFilePaths.length; i++){
                console.log(tempFilePaths[i])
                wx.uploadFile({
                  filePath: tempFilePaths[i],
                  name: 'face',
                  url: 'http://127.0.0.1:5000/picture',
                  formData:{
                      "names": name_human
                  },
                  success:function(res){
                      if (res.statusCode==200){
                          wx.showToast({
                            title: "上传成功",
                            icon: "none",
                            duration: 1500
                          })
                      }
                  },
                  fail:function(err){
                      console.log(err)
                      wx.showToast({
                        title: "上传失败",
                        icon: "none",
                        duration: 2000
                      })
                  }
                })
            }
        }
    })
    
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
