var discoverMusicList=[//16
  {
    title:"Busted Chump",
    artist:"ADG3",
    mp3:"../musics/bustedchump.mp3",
    poster: "/images/p3.jpg"
  },
  {
    title:"Chucked Knuckles",
    artist:"3studios",
    mp3:"../musics/chuckedknuckles.mp3",
    poster: "/images/p5.jpg"
  },
  {
    title:"Cloudless Days",
    artist:"ADG3 Studios",
    mp3:"../musics/cloudlessdays.mp3",
    poster: "/images/p6.jpg"
  },
  {
    title:"Cryptic Psyche",
    artist:"ADG3",
    mp3:"../musics/crypticpsyche.mp3",
    poster: "/images/p7.jpg"
  }
];

var topsongsMusicList=[//5
  {
    title:"Busted Chump",
    artist:"ADG3",
    mp3:"../musics/bustedchump.mp3",
    poster: "/images/p3.jpg"
  },
  {
    title:"Chucked Knuckles",
    artist:"3studios",
    mp3:"../musics/chuckedknuckles.mp3",
    poster: "/images/p5.jpg"
  },
  {
    title:"Cloudless Days",
    artist:"ADG3 Studios",
    mp3:"../musics/cloudlessdays.mp3",
    poster: "/images/p6.jpg"
  },
  {
    title:"Cryptic Psyche",
    artist:"ADG3",
    mp3:"../musics/crypticpsyche.mp3",
    poster: "/images/p7.jpg"
  }
]
var newsongsMusicList=[//8
  {
    title:"Busted Chump",
    artist:"ADG3",
    mp3:"../musics/bustedchump.mp3",
    poster: "/images/p3.jpg"
  },
  {
    title:"Chucked Knuckles",
    artist:"3studios",
    mp3:"../musics/chuckedknuckles.mp3",
    poster: "/images/p5.jpg"
  },
  {
    title:"Cloudless Days",
    artist:"ADG3 Studios",
    mp3:"../musics/cloudlessdays.mp3",
    poster: "/images/p6.jpg"
  },
  {
    title:"Cryptic Psyche",
    artist:"ADG3",
    mp3:"../musics/crypticpsyche.mp3",
    poster: "/images/p7.jpg"
  }
]
//全局变量
var playingIndex;

//渲染discover区域
var discover=$("#discover");
discoverMusicList.map((e)=>{
  discover.append(
    `<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <div class="item">
      <div class="pos-rlt">
        <div class="item-overlay opacity r r-2x bg-black ">
          <div class="center text-center m-t-n">
            <a href="#" data-toggle="class" class="playBtn">
              <i class="icon-control-play i-2x text"></i>
              <i class="icon-control-pause i-2x text-active"></i>
            </a>

          </div>
          <div class="bottom padder m-b-sm">
            <a href="#">
              <i class="fa fa-plus-circle addMusic"></i>
            </a>
          </div>
        </div>
        <a href="#"><img src="${e.poster}" alt="" class="r r-2x img-full"></a>
      </div>
      <div class="padder-v">
        <a href="#" class="text-ellipsis">${e.title}</a>
        <a href="#" class="text-ellipsis text-xs text-muted">${e.artist}</a>
      </div>
    </div>
  </div>`);
});

//渲染topsong部分
var topsongs=$("#topSongs");
topsongsMusicList.map((e)=>{
  topsongs.append(
    `<a href="#" class="list-group-item clearfix topsong-item">
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
              <a href="#" class='nsplayBtn'><i class="fa fa-play-circle i-2x"></i></a>
            </div>
          </div>
          <a href="#"><img src="${e.poster}" alt="${e.title}" class="r r-2x img-full"></a>
        </div>
        <div class="padder-v">
          <a href="#" class="text-ellipsis">${e.title}</a>
          <a href="#" class="text-ellipsis text-xs text-muted">${e.artist}</a>
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
      haveindex=discoverMusicList.indexOf(l);
    }
  });
  //console.debug(havethis);
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
  myPlaylist.play(nsindex2);
});
