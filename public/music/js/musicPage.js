console.debug(dataset);
//音乐数据获取
var discoverMusicList=[];
var topsongsMusicList=[];
var newsongsMusicList=[];

dataset.Typemusic.map((music)=>{
    discoverMusicList.push(translate(music));
});
dataset.Hotmusic.map((music)=>{
    topsongsMusicList.push(translate(music));
});
dataset.Timemusic.map((music)=>{
    newsongsMusicList.push(translate(music));
});

console.debug(discoverMusicList);
console.debug(topsongsMusicList);
console.debug(newsongsMusicList);

//歌曲对象格式转换
function translate(music){
  return {
    title:music.name,
    artist:music.author,
    mp3:`/updata/musics/${music.name}.mp3`,
    poster:`/updata/images/${music.name}.jpeg`,
    type:music.type
  }
}

//search
function keyDown(e) {
  var ev= window.event||e;
  if (ev.keyCode == 13) {
   search();
  }
 }
 function search(){
   let text=$("#searchInput").val();

   $.ajax({
     url: '/getByName',
     type: 'POST',
     data: {name:text}
   })
   .done(function() {
     console.log("success");
   })
   .fail(function() {
     console.log("error");
   })
   .always(function(res) {
     console.log("complete");
     console.log(res);
   });

 }
//全局变量
var playingIndex;
var playingMusic;

//渲染discover区域
var discover=$("#discover");
discoverMusicList.map((e)=>{
  discover.append(
    `<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <div class="item">
      <div class="pos-rlt">
        <div class="item-overlay opacity r r-2x bg-black ">
          <div class="center text-center m-t-n">
            <a href="javascript:;" data-toggle="class" class="playBtn">
              <i class="icon-control-play i-2x text"></i>
              <i class="icon-control-pause i-2x text-active"></i>
            </a>

          </div>
          <div class="bottom padder m-b-sm">
            <a href="javascript:;">
              <i class="fa fa-plus-circle addMusic"></i>
            </a>
          </div>
        </div>
        <a href="javascript:;"><img src="${e.poster}" alt="" class="r r-2x img-full"></a>
      </div>
      <div class="padder-v">
        <a href="javascript:;" class="text-ellipsis">${e.title}</a>
        <a href="javascript:;" class="text-ellipsis text-xs text-muted">${e.artist}</a>
      </div>
    </div>
  </div>`);
});

//渲染topsong部分
var topsongs=$("#topSongs");
topsongsMusicList.map((e)=>{
  topsongs.append(
    `<a href="javascript:;" class="list-group-item clearfix topsong-item">
      <span class="pull-right h2 text-muted m-l">${topsongsMusicList.indexOf(e)+1}</span>
      <span class="pull-left thumb-sm avatar m-r" style='height:40px;'>
        <img src="${e.poster}" alt="${e.title}" style='height:100%;'>
      </span>
      <span class="clear">
        <span>${e.title}</span>
        <small class="text-muted clear text-ellipsis">by ${e.artist}</small>
      </span>
    </a>`);
});

//渲染newsongs部分
var newsongs=$("#newSongs");
newsongsMusicList.map((e)=>{
  newsongs.append(
    `<div class="col-xs-6 col-sm-3">
      <div class="item">
        <div class="pos-rlt">
          <div class="item-overlay opacity r r-2x bg-black">
            <div class="center text-center m-t-n">
              <a href="javascript:;" class='nsplayBtn'><i class="fa fa-play-circle i-2x"></i></a>
            </div>
          </div>
          <a href="javascript:;"><img src="${e.poster}" alt="${e.title}" class="r r-2x img-full"></a>
        </div>
        <div class="padder-v">
          <a href="javascript:;" class="text-ellipsis">${e.title}</a>
          <a href="javascript:;" class="text-ellipsis text-xs text-muted">${e.artist}</a>
        </div>
      </div>
    </div>`);
});
/*
discover部分
*/

//添加歌曲
$('.addMusic').on('click', function(event) {
  let index=$('.addMusic').index(this);
  let theAddMusic=discoverMusicList[index];
  addMusic(theAddMusic,false);
});

//播放歌曲
$('.playBtn').on('click', function(event) {
  let index=$('.playBtn').index(this);
  //reset
  $('.playBtn').not($(this)).removeClass('active');
  $('.item-overlay').not($('.item-overlay').eq(index)).removeClass('active');
  //add class
  //console.debug(index);
  $('.item-overlay').eq(index).addClass('active');
  //add and play music
  let thePlayMusic=discoverMusicList[index];
  if($(this).is('.active')){
    myPlaylist.pause();
  }else{
    let index2=addMusic(thePlayMusic,true);
    //console.debug(index2);
    if(playingIndex==index){
      myPlaylist.play();
    }else{
      myPlaylist.play(index2);
      playingIndex=index2;
    }
  }
});

//添加歌曲到列表
function addMusic(theAddMusic,playNow){
  let List=myPlaylist.playlist;
  let havethis=false;
  let haveindex;
  List.map((l)=>{
    if(l.title==theAddMusic.title){
      havethis=true;
      haveindex=List.indexOf(l);
    }
  });
  // console.debug(havethis);
  // console.debug(haveindex);
  if(!havethis)myPlaylist.add(theAddMusic,playNow);
  else return haveindex;
}

$(".dropdown-menu").on('click', function(event) {
  console.debug('click');
  $('.playBtn').removeClass('active');
  $('.item-overlay').removeClass('active');
});

$(".jp-play").on('click', function(event) {
  //console.debug('click');
  $('.playBtn').removeClass('active');
  $('.item-overlay').removeClass('active');
});
$(".jp-pause").on('click', function(event) {
  //console.debug('click');
  $('.playBtn').removeClass('active');
  $('.item-overlay li').removeClass('active');
});
/**
top song 部分
*/
$(".topsong-item").on('click', function(event) {
  let tsindex=$('.topsong-item').index(this);
  //console.debug(tsindex);
  let tsthePlayMusic=topsongsMusicList[tsindex];
  let tsindex2=addMusic(tsthePlayMusic,true);
  //console.debug(tsindex2);
  myPlaylist.play(tsindex2);
});
/**
new song 部分
*/
$(".nsplayBtn").on('click', function(event) {
  let nsindex=$('.nsplayBtn').index(this);
  let nsthePlayMusic=newsongsMusicList[nsindex];
  let nsindex2=addMusic(nsthePlayMusic,true);
  // console.debug(nsindex2);
  myPlaylist.play(nsindex2);
});

//下载
if(dataset.User.authority)$("#download").show();

function changeDownload(title){
  $("#download").attr('href', `/updata/musics/${title}.mp3`);
}
//播放
$(document).on($.jPlayer.event.pause,(event)=>{
  playingMusic=event.jPlayer.status.media.title;
});
$(document).on($.jPlayer.event.play,(event)=>{
  console.debug(event.jPlayer.status.media);
  if(event.jPlayer.status.media.title==playingMusic){

  }else{
      updataPlay(event.jPlayer.status.media.title,event.jPlayer.status.media.type);
      changeDownload(event.jPlayer.status.media.title);
      playingMusic=event.jPlayer.status.media.title;
  }
});
function updataPlay(title,type){
  $.ajax({
    url: '/play',
    type: 'POST',
    data: {
      name: title,
      type: type
    }
  })
  .done(function() {
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function(res) {
    console.log("complete");
    console.log(res);
  });
}
