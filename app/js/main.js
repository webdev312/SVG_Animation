const TIME_FRAME_10MIN = 200;

var g_isFocus = true;

(function () {
	var json_Data = getAllData();
	var json_Sorted_Data = json_Data.tagData.sort(sortByTimeframe);
	
	$(window).blur(function(e) {
		g_isFocus = false;
	});
	$(window).focus(function(e) {
		g_isFocus = true;
	});

	// Sort json data by timeframe without considering replay_type
	function sortByTimeframe(a, b){
		return new Date(a.command_data.time).getTime() - new Date(b.command_data.time).getTime();
	}

	var g_arr_st_MoveAnime = [];
	var g_arr_st_AlertAnime = [];

	function process_Tags(arr_Data, n_speed){
		let initX = -999;
		let initY = -999;
		let prevX = -999;
		let prevY = -999;
		for (let i = 0; i < arr_Data.length; i ++){
			if (arr_Data[i].command_type == "Tag Movement"){
				let str_tag = replaceAll(arr_Data[i].command_data.tag, " ", "_");
				if ($('#icon_' + str_tag).length == 0) createIcon(arr_Data[i]);

				// Use time difference to calculate delay
				if (initX == -999) initX = arr_Data[i].command_data.from_x*1;
				if (initY == -999) initY= arr_Data[i].command_data.from_y*1;

				let n_duration = n_speed*TIME_FRAME_10MIN;

				let st_Anime = {
					targets: '#icon_' + str_tag,
					translateX: arr_Data[i].command_data.to_x*1 - initX,
					translateY: arr_Data[i].command_data.to_y*1 - initY,
					duration: n_duration*2,
					opacity: 1,
					easing: 'linear',
					autoplay: true,
				}

				let st_Path = {
					targets: '#path_' + str_tag,
					easing: 'linear',
					points: [
						{ value: arr_Data[i].command_data.from_x + ', ' + arr_Data[i].command_data.from_y + ', ' + arr_Data[i].command_data.to_x + ', ' + arr_Data[i].command_data.to_y}
					],
					duration: n_duration*2,
					opacity: 1,
					autoplay: true,
				}

				let st_move = {
					anime : st_Anime,
					path : st_Path,
					data : arr_Data[i]
				}
				g_arr_st_MoveAnime.push(st_move);

				prevX = arr_Data[i].command_data.to_x*1;
				prevY = arr_Data[i].command_data.to_y*1;
			}else if (arr_Data[i].command_type == "Tag alert"){
				let str_tag = replaceAll(arr_Data[i].command_data.tag, " ", "_");
				createAlert('alert_' + str_tag + g_arr_st_AlertAnime.length, prevX, prevY, arr_Data[i].command_data.time, arr_Data[i].command_data.alert_text);

				let st_alertAnime = {
					targets: '#alert_' + str_tag + g_arr_st_AlertAnime.length,
					easing: 'linear',
					duration: n_speed*TIME_FRAME_10MIN*2,
					opacity: 1,
					autoplay: true,
				};

				let st_alert = {
					id : '#alert_' + str_tag + g_arr_st_AlertAnime.length,
					alert : st_alertAnime,
					data : arr_Data[i].command_data,
					x : prevX,
					y : prevY
				}

				g_arr_st_AlertAnime.push(st_alert);
			}
		}
	}

	function ResetPath(id, x, y){
		anime({
			targets: id,
			easing: 'linear',
			points: [
				{ value: x + ', ' + y + ', ' + x + ', ' + y}
			],
			duration: TIME_FRAME_10MIN,
			opacity: 0,
			autoplay: true,
		});
	}

	function ResetAlert(id, x, y){
		anime({
			targets: id,
			easing: 'linear',
			points: [
				{ value: x + ', ' + y + ', ' + x + ', ' + y}
			],
			duration: TIME_FRAME_10MIN,
			opacity: 0,
			autoplay: true,
		});
	}

	function MoveEngine(){
		if (g_arr_st_MoveAnime.length > 0){
			let cur_anime = g_arr_st_MoveAnime[0].anime;
			let cur_path = g_arr_st_MoveAnime[0].path;
			let x = g_arr_st_MoveAnime[0].data.command_data.to_x*1;
			let y = g_arr_st_MoveAnime[0].data.command_data.to_y*1;
			let time = g_arr_st_MoveAnime[0].data.command_data.time;
			let zone = g_arr_st_MoveAnime[0].data.command_data.zone;
			cur_anime.complete = function(){
				createCircle(x, y);
				// createMoveDesc(x, y, time, zone);
				ResetPath(cur_path.targets, x, y);
			};
			
			g_arr_st_MoveAnime.shift();

			anime(cur_anime);
			anime(cur_path);
		}
	}

	function AlertEngine(){
		console.log(g_arr_st_AlertAnime);
		if (g_arr_st_AlertAnime.length > 0){
			let alert = g_arr_st_AlertAnime[0].alert;
			let id = g_arr_st_AlertAnime[0].id;
			let x = g_arr_st_AlertAnime[0].x;
			let y = g_arr_st_AlertAnime[0].y;
			alert.complete = function(){
				ResetAlert(id, x, y);
			}
			anime(alert);
			g_arr_st_AlertAnime.shift();
		}
	}

	function runTime(n_mins, n_speed){
		$('#cur_time').text($('#datetimepicker1').val());

		var n_curMins = n_mins;
		var n_intervalID = setInterval(() => {
			if (g_isFocus == false) return;
			n_curMins --;
			let str_curtime = $('#cur_time').text();
			let cur_time = moment(str_curtime, "MM/DD/YYYY hh:mm A").add(1, 'minutes').format("MM/DD/YYYY hh:mm A");
			$('#cur_time').text(cur_time);
			IsAvailableMotion(cur_time, n_speed);	// Check available move stack
			if (n_curMins == 0) clearInterval(n_intervalID);
		}, TIME_FRAME_10MIN * n_speed);
	}

	function IsAvailableMotion(cur_time, n_speed){
		if (g_arr_st_MoveAnime.length <= 0) return;
		curent_time = moment(cur_time, "MM/DD/YYYY hh:mm A");
		move_time = moment(g_arr_st_MoveAnime[0].data.command_data.time, "MM/DD/YYYY hh:mm");
		if (move_time - curent_time == 0){
			MoveEngine();
		}
		alert_time = moment(g_arr_st_AlertAnime[0].data.time, "MM/DD/YYYY hh:mm");
		if (alert_time - curent_time == 0){
			AlertEngine();
		}
	}

	function onInit(){
		$('#datetimepicker1').datetimepicker();
		$('#datetimepicker1').val('01/01/2019 10:10 AM');
		$('#datetimepicker2').datetimepicker();
		$('#datetimepicker2').val('01/01/2019 11:40 AM');

		let n_speed = $('#speed_playback').val();
		let n_mins = getTotalMinutes($('#datetimepicker1').val(), $('#datetimepicker2').val());
		runTime(n_mins, n_speed);
		process_Tags(json_Sorted_Data, n_speed);
	}

	onInit();
})();