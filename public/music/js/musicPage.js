var discoverMusicList=[
  {
    title:"Busted Chump",
    artist:"ADG3",
    mp3:"../musics/bustedchump.mp3",
    poster: "images/p3.jpg"
  },
  {
    title:"Chucked Knuckles",
    artist:"3studios",
    mp3:"../musics/chuckedknuckles.mp3",
    poster: "images/p5.jpg"
  },
  {
    title:"Cloudless Days",
    artist:"ADG3 Studios",
    mp3:"../musics/cloudlessdays.mp3",
    poster: "images/p6.jpg"
  },
  {
    title:"Cryptic Psyche",
    artist:"ADG3",
    mp3:"../musics/crypticpsyche.mp3",
    poster: "images/p7.jpg"
  }
];

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
        <a href="#"><img src="/music/${e.poster}" alt="" class="r r-2x img-full"></a>
      </div>
      <div class="padder-v">
        <a href="#" class="text-ellipsis">${e.title}</a>
        <a href="#" class="text-ellipsis text-xs text-muted">${e.artist}</a>
      </div>
    </div>
  </div>`);
});
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
  console.debug(index);
  $('.item-overlay').eq(index).addClass('active');
  //add and play music
  let thePlayMusic=discoverMusicList[index];
  if($(this).is('.active')){
    myPlaylist.pause();
  }else{
    console.debug(addMusic(thePlayMusic,true));
  }
});


function addMusic(theAddMusic,playNow){
  let List=myPlaylist.playlist;
  let havethis=false;
  let haveindex;
  List.map((l)=>{
    if(l==theAddMusic){
      havethis=true;
      haveindex=discoverMusicList.indexOf(l);
    }
  });
  console.debug(havethis);
  if(!havethis)myPlaylist.add(theAddMusic,playNow);
  else return haveindex;
}
