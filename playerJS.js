//取得document object
var audio = document.getElementById("audio");
var controlpanel_one = document.getElementById("controlpanel_one");
var controlpanel_two = document.getElementById("controlpanel_two");
var musicMenu = document.getElementById("musicMenu");
var nowSong = document.getElementById("nowSong");
var Next = document.getElementById("Next");
var Previous = document.getElementById("Previous");
var marquee_now_song = document.getElementById("marquee_now_song");
var info_area = document.getElementById("info_area");
var VolumeSlider = document.getElementById("VolumeSlider");
var duration = document.getElementById("duration");
var vol_p = document.getElementById("vol_p");
var vol_m = document.getElementById("vol_m");
var vol_info = document.getElementById("vol_info");
var repeat_one = document.getElementById("repeat_one");
var player = document.getElementById("player");
var list = document.getElementById("list");
var music_list = document.getElementById("music_list");
var Repeat_all = document.getElementById("Repeat_all");
var Shuffle = document.getElementById("Shuffle");
var Play = document.getElementById("Play");
var song_source = document.getElementById("song_source");
var song_target = document.getElementById("song_target");
var program = document.getElementById("program");
var controlpanel_two = document.getElementById("controlpanel_two");
var music_update = document.getElementById("music_update");

//事件監聽器
controlpanel_one.addEventListener("click", objEvent);
controlpanel_two.addEventListener("click", objEvent2);
musicMenu.addEventListener("change", changeMusicMenu);
VolumeSlider.addEventListener(browserTest(), function () { changeVolume(1); });
program.addEventListener(browserTest(), setTimebar);
song_source.addEventListener("dragstart", drag);                     //source可拖到target
song_target.addEventListener("drop", function () { drop(event, this); });
song_target.addEventListener("dragover", allowDrop);

song_target.addEventListener("dragstart", drag);                      //target可拖到source
song_source.addEventListener("drop", function () { drop(event, this); });
song_source.addEventListener("dragover", allowDrop);

//載入網頁時執行
DefaultSong();
//瀏覽器偵測
function browserTest() {
    if (navigator.userAgent.search("Chrome") != -1)
        return "input";
    if (navigator.userAgent.search("Firefox") != -1)
        return "input";
    if (navigator.userAgent.search("Opera") != -1)
        return "input";
    else
        return "change";
    //console.log(navigator.userAgent);}
//在點擊按鈕時，上層的節點也會被觸發事件，故由button父節點來判斷哪個按鈕被觸發
function objEvent(evt) {
    obj = evt.target;
    //id = evt.target.id;
    switch (obj.id) {
        case "Play":
            PlayMusic(obj);
            break;
        case "Pause":
            PauseMusic(obj);
            break;
        case "Stop":
            StopMusic(obj);
            break;
        case "Fast-Forward":
            speedAdjust(1);
            break;
        case "Rewind":
            speedAdjust(2);
            break;
        case "Next":
            changeSong(true, obj);
            break;
        case "Previous":
            changeSong(false, obj);
            break;
        case "list":
            changeCSS();
            break;
    }
}
//在點擊按鈕時，上層的節點也會被觸發事件，故由button父節點來判斷哪個按鈕被觸發，第二排button
function objEvent2(evt2) {
    obj = evt2.target;
    switch (obj.id) {
        case "Volume":
            Mute(true, obj);
            break;
        case "Mute":
            Mute(false, obj);
            break;
        case "repeat_one":
            MusicRepeatOne(obj);
            checkButtonXOR(obj)
            break;
        case "Repeat_all":
            MusicRepeatAll(obj);
            checkButtonXOR(obj)
            break;
        case "Shuffle":
            randomMusic(obj);
            checkButtonXOR(obj)
            break;
        case "vol_p":
            changeVolume(2);
            break;
        case "vol_m":
            changeVolume(3);
            break;
        case "music_update":
            updateMusic();
            break;
    }
}
//從song_source中讀歌曲到歌本中(加入事件監聽器，若song_target有子節點(onchange)，則播放song_target中歌曲(再讀一次song_target中的歌到option底下，先移除原來的option))function DefaultSong() {    for (i = 0; i < song_source.children.length; i++) {        var get_option = document.createElement("option");        var Source_node = song_source.children[i];        get_option.value = Source_node.title;        get_option.innerText = Source_node.innerText;        musicMenu.appendChild(get_option);          //在musicMenu子節點創建option元素        Source_node.draggable = "true";             //將歌本中每個元素都設為可拖曳的狀態        Source_node.id = "song" + (i + 1);          //因拖曳時每個物件需有ID，故編列流水號    }    nowSong.src = musicMenu.options[0].value; //重load一次歌曲    audio.load();}//更新歌本function updateMusic() {    for (i = musicMenu.length - 1; i >= 0; i--) {                //先將musicMenu中的option清除，從後面清回來        musicMenu.removeChild(musicMenu.children[i]);    }    for (i = 0; i < song_target.children.length; i++) {        var get_option = document.createElement("option");        var Target_node = song_target.children[i];        get_option.value = Target_node.title;        get_option.innerText = Target_node.innerText;        musicMenu.appendChild(get_option);          //在musicMenu子節點創建option元素    }    nowSong.src = musicMenu.options[0].value;    audio.load();    changeMusicMenu();    checkNowStatement();}//從song_source中拉歌曲function drag(evt) {    evt.dataTransfer.setData("text", evt.target.id);}//將原本在song_source中的歌移除並加到song_targetfunction drop(evt, obj) {    evt.preventDefault();
    var data = evt.dataTransfer.getData("text");
    obj.appendChild(document.getElementById(data));        //在父節點(song_source或song_target加入子節點，避免在歌曲底下加入子節點)}//將歌曲放置到song_target中，若沒有此function將無法放進去function allowDrop(evt) {    evt.preventDefault();}//將時間從秒數轉換為幾分幾秒的格式function getTimeFormat(timeSec) {
    minute = Math.floor(timeSec / 60);
    second = timeSec % 60;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return minute + ":" + second;
}
//取得目前播放時間資訊
function getDuration() {
    songDuration = Math.round(audio.duration);
    songCurrent = Math.round(audio.currentTime);
    //更新時間進度條
    program.max = audio.duration;
    program.value = audio.currentTime;
    w = (audio.currentTime / audio.duration * 100) + "%";
    program.style.backgroundImage = "-webkit-linear-gradient(left, rgb(255, 255, 255), rgb(255, 255, 255) " + w + " , rgba(255, 255, 255, 0.3) " + w + ", rgba(255, 255, 255, 0.3))";


    //顯示目前播放時間文字
    if (isNaN(songDuration) == false) {                                                                                         //解決換歌時時間進度出現NaN問題
        duration.innerText = getTimeFormat(songCurrent) + " / " + getTimeFormat(songDuration);
    }
    if (songDuration == songCurrent) {                                  //每首歌曲結束時判斷為全曲、單曲或隨機播放
        if (repeat_one.title == "not_repeat_one") {
            changeMusicMenu();        } else if (Shuffle.title == "Not_Shuffle") {
            changeMusicMenu();
        } else if (Repeat_all.title == "Repeat_all" && musicMenu.selectedIndex == musicMenu.options.length - 1) {       //當REPEAT_ALL未點擊時，播到最後一首完會停止音樂
            StopMusic(Previous.nextElementSibling.nextElementSibling.nextElementSibling);
        } else {
            changeSong(true, Previous.nextElementSibling.nextElementSibling);
        }
    } else {
        setTimeout(getDuration, 1);
    }
}
//以點擊方式調整時間進度bar
function setTimebar(evt) {
    //audio.currentTime = (evt.offsetX / timebar.clientWidth) * audio.duration;                     //將目前進度條與bar總長度比值*歌曲總長度換算為要切換的時間點
    audio.currentTime = program.value;
}
//下拉式選單中直接換歌，直接選歌後會直接播放歌曲
function changeMusicMenu() {
    if (Shuffle.title == "Not_Shuffle") {                                                                               //當隨機播放有開啟時，下一首也以隨機方式播放
        index = Math.floor(Math.random() * musicMenu.options.length);
        console.log(index);
        musicMenu.options[index].selected = true;
        nowSong.src = musicMenu.options[index].value;
    } else {
        index = musicMenu.selectedIndex;
        nowSong.src = musicMenu.options[index].value;
        musicMenu.options[index].selected = true;        audio.currentTime = 0;
    }
    audio.load();
    PlayMusic(Play);
    checkPlayStatement();
    ChangeMarquee("play");
}
//播放音樂並改圖示為暫停、播放音樂時啟動資訊看板邊框特效，預設全曲循環
function PlayMusic(obj) {
    audio.play();
    obj.id = "Pause";
    obj.innerText = "pause";
    ChangeMarquee("play");
    info_area.classList.add("info_area_play");
    getDuration();
}
//暫停音樂並改圖示為播放
function PauseMusic(obj) {
    audio.pause();
    obj.id = "Play";
    obj.innerText = "play_arrow";
    info_area.classList.remove("info_area_play");
    ChangeMarquee("pause");
}
//停止音樂，將前一個兄弟(即播放暫停按鈕)改為播放圖示
function StopMusic(obj) {
    PauseMusic(obj.previousElementSibling);
    audio.currentTime = 0;
    info_area.classList.remove("info_area_play");
    ChangeMarquee("stop");
}
//快轉、倒轉
function speedAdjust(flag) {
    if (flag == 1) {
        audio.currentTime += 10;
        ChangeMarquee("fast");
    } else {
        audio.currentTime -= 10;
        ChangeMarquee("rewind");
    }
}
//上一首、下一首，若在第一首歌按上一首，則回到最後一首(環狀)
function changeSong(flag, obj) {
    index = musicMenu.selectedIndex;
    lastMusic_index = musicMenu.options.length - 1;
    if (flag == true) {
        if (index < lastMusic_index) {
            index++;
        } else {
            index = 0;
        }
    } else {
        if (index > 0) {
            index--;
        } else {
            index = lastMusic_index;
        }
    }
    nowSong.src = musicMenu.options[index].value;
    musicMenu.options[index].selected = true;
    changeMusicMenu();
}
//靜音、取消靜音
function Mute(a, b) {
    if (a) {
        audio.muted = true;
        b.innerText = "volume_off";
        b.id = "Mute";
    } else {
        audio.muted = false;
        b.innerText = "volume_up";
        b.id = "Volume";
    }
}
//改變跑馬燈狀態
function ChangeMarquee(x) {
    index = musicMenu.selectedIndex;
    if (x == "play") {
        marquee_now_song.innerText = "目前播放：" + musicMenu.options[index].innerText;
    } else if (x == "pause") {
        marquee_now_song.innerText = "-音樂暫停-";
        checkNowStatement();
    } else if (x == "stop") {
        marquee_now_song.innerText = "-音樂停止-";
        checkNowStatement();
    } else if (x == "fast") {
        marquee_now_song.innerText = "-音樂快轉-";
        checkNowStatement();
    } else if (x == "rewind") {
        marquee_now_song.innerText = "-音樂倒轉-";
        checkNowStatement();
    } else if (x == "shuffle") {
        marquee_now_song.innerText = "-隨機播放-";
    } else if (x == "repeat_one") {
        marquee_now_song.innerText = "-單曲循環-";
    } else if (x == "Repeat_all") {
        marquee_now_song.innerText = "-全曲循環-";
    }
}
//判斷目前是否播放顯示對應跑馬燈
function checkNowStatement() {
    if (controlpanel_one.firstElementChild.nextElementSibling.nextElementSibling.id == "Pause") {
        setTimeout(function () { ChangeMarquee("play"); }, 2000);
    } else {
        setTimeout(function () { marquee_now_song.innerText = "-請點擊播放-"; }, 3000);
    }
}
//單曲循環
function MusicRepeatOne(obj) {
    if (obj.title == "repeat_one") {
        obj.title = "not_repeat_one";
        repeat_one.style.boxShadow = "0px 0px 15px 5px rgba(102, 217, 255, 0.68)";
        ChangeMarquee("repeat_one");
    } else {
        obj.title = "repeat_one";
        repeat_one.style.boxShadow = "0 0 13px rgba(255, 255, 255,0.8)";
        checkPlayStatement();
    }
}
//全曲循環
function MusicRepeatAll(obj) {
    lastMusic_index = (musicMenu.options.length) - 1;
    nowMusic_index = musicMenu.selectedIndex;
    if (obj.title == "Repeat_all") {
        obj.title = "Not_Repeat_all";
        Repeat_all.style.boxShadow = "0px 0px 15px 5px rgba(102, 217, 255, 0.68)";
        ChangeMarquee("Repeat_all");
        if (lastMusic_index == nowMusic_index && audio.onended) {
            musicMenu.options[0].selected = true;
            changeMusicMenu();
        } else {
            checkPlayStatement();
        }
    } else {
        obj.title = "Repeat_all";
        Repeat_all.style.boxShadow = "0 0 13px rgba(255, 255, 255,0.8)";
        audio.addEventListener("ended", function () { PauseMusic(Previous.nextElementSibling.nextElementSibling); audio.autoplay = ""; });
    }
}
//隨機播放
function randomMusic(obj) {
    if (obj.title == "Shuffle") {
        obj.title = "Not_Shuffle";
        Shuffle.style.boxShadow = "0px 0px 15px 5px rgba(102, 217, 255, 0.68)";
        ChangeMarquee("shuffle");
    } else {
        obj.title = "Shuffle";
        Shuffle.style.boxShadow = "0 0 13px rgba(255, 255, 255,0.8)";
        checkPlayStatement();
    }
}
//隨機播放&全曲循環&單曲循環按紐互斥判斷
function checkButtonXOR(obj) {
    if (obj.title == "Not_Repeat_all") {
        repeat_one.title = "not_repeat_one";
        Shuffle.title = "Not_Shuffle";
        MusicRepeatOne(repeat_one);
        randomMusic(Shuffle);
    } else if (obj.title == "not_repeat_one") {
        Repeat_all.title = "Not_Repeat_all";
        Shuffle.title = "Not_Shuffle";
        MusicRepeatAll(Repeat_all);
        randomMusic(Shuffle);
    } else {
        repeat_one.title = "not_repeat_one";
        Repeat_all.title = "Not_Repeat_all";
        MusicRepeatOne(repeat_one);
        MusicRepeatAll(Repeat_all);
    }
}
//判斷若為暫停狀態，則不播歌，播放狀態即播歌
function checkPlayStatement() {
    if (audio.paused == false) {
        audio.autoplay = "autoplay";
        PlayMusic(Previous.nextElementSibling.nextElementSibling);
    }
}
//音量設定
function changeVolume(flag) {
    if (flag == 2) {
        VolumeSlider.value++;
    } else if (flag == 3) {
        VolumeSlider.value--;
    }
    vol_info.value = VolumeSlider.value;
    vol_info.classList.add("slider_change");
    setTimeout(slider_Change_control, 1000);         //變更音量動畫
    audio.volume = vol_info.value / 100;
}
function slider_Change_control() {
    vol_info.classList.remove("slider_change");
}
//清單展開效果
function changeCSS() {
    player.classList.toggle("player_change");
    info_area.nextElementSibling.classList.toggle("button_change");
    
    if (list.title == "EditMySong") {
        controlpanel_two.nextElementSibling.style.top = "180%";
        list.title = "Close_EditMySong";
        music_list.style.border = "solid 5px rgba(255, 255, 255,0.8)";
        
        setTimeout(function () {
            music_list.classList.add("music_list_bg");
            music_list.style.opacity = "1";
            music_update.style.display = "initial";
            for (i = 0; i <= 5; i++) {
                controlpanel_two.children[i].style.marginLeft = "2%";
            }
            music_update.classList.toggle("ani-menuupdate");
            VolumeSlider.style.transform = "translate(78px,55PX)";
        }, 1000);
    } else {
        list.title = "EditMySong";
        controlpanel_two.nextElementSibling.style.top = "50%";
        music_list.style.border = "";
        music_list.style.opacity = "0";
        setTimeout(function () {
            music_list.classList.remove("music_list_bg");
            music_update.style.display = "none";
            for (i = 0; i <= 5; i++) {
                controlpanel_two.children[i].style.marginLeft = "5%";
            }
            music_update.classList.toggle("ani-menuupdate");
            VolumeSlider.style.transform = "translate(68px,55PX)";
        }, 1000);
    }
    
}