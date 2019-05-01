const TIME_FRAME_1MIN = 200;

var g_isFocus = true;

function onSpeedRun(){
	// Remove all elements
	$("#icon_path").empty();
	$("#markers").empty();
	$("#icon_location").empty();
	$("#alerts").empty();
	onInit();
}

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
var g_arr_st_TagAnime = [];
var g_arr_st_ChartAnime = [];
var g_nIntervalID;

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

			let n_duration = n_speed*TIME_FRAME_1MIN;
			let from_time = moment(arr_Data[i].command_data.from_time,  "MM/DD/YYYY hh:mm");
			let to_time = moment(arr_Data[i].command_data.to_time,  "MM/DD/YYYY hh:mm");
			let diff_time = (to_time - from_time) / 1000 / 60;

			let st_Anime = {
				targets: '#icon_' + str_tag,
				translateX: arr_Data[i].command_data.to_x*1 - initX,
				translateY: arr_Data[i].command_data.to_y*1 - initY,
				duration: n_duration*diff_time,
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
				duration: n_duration*diff_time,
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
				duration: n_speed*TIME_FRAME_1MIN*2,
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
		}else if (arr_Data[i].command_type == "Tag stats"){
			if (arr_Data[i].command_data.stat_type == "No of patients"){
				g_arr_st_TagAnime.push(arr_Data[i]);
			}else if (arr_Data[i].command_data.stat_type == "Length of stay"){
				for (let n = 0; n < arr_Data[i].command_data.stat_values.length; n ++)
					g_arr_st_ChartAnime.push(arr_Data[i].command_data.stat_values[n]);
			}
		}
	}
	drawChartLos(g_arr_st_ChartAnime);
}

function ResetPath(id, x, y){
	anime({
		targets: id,
		easing: 'linear',
		points: [
			{ value: x + ', ' + y + ', ' + x + ', ' + y}
		],
		duration: TIME_FRAME_1MIN,
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
		duration: TIME_FRAME_1MIN,
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
		let time = g_arr_st_MoveAnime[0].data.command_data.from_time;
		let zone = g_arr_st_MoveAnime[0].data.command_data.zone;
		cur_anime.complete = function(){
			createCircle(x, y);
			createMoveDesc(x, y, time, zone);
			ResetPath(cur_path.targets, x, y);
		};
		
		g_arr_st_MoveAnime.shift();

		anime(cur_anime);
		anime(cur_path);
	}
}

function AlertEngine(){
	if (g_arr_st_AlertAnime.length > 0){
		let alert = g_arr_st_AlertAnime[0].alert;
		let id = g_arr_st_AlertAnime[0].id;
		let x = g_arr_st_AlertAnime[0].x;
		let y = g_arr_st_AlertAnime[0].y;
		alert.complete = function(){
			setTimeout(() => {
				ResetAlert(id, x, y);
			}, TIME_FRAME_1MIN * 10);
		}
		anime(alert);
		g_arr_st_AlertAnime.shift();
	}
}

function StateEngine(){
	if (g_arr_st_TagAnime.length > 0){
		let patients = g_arr_st_TagAnime[0].command_data["number of Patients"];
		$("#patients").html(patients);
		
		let strOnTime = $("#ontimestarts").html();
		if (strOnTime == "0/0"){
			$("#ontimestarts").html(patients + "/" + patients);
		}else{
			$("#ontimestarts").html(strOnTime.replace(/.*\//, patients+"/"));
		}
		g_arr_st_TagAnime.shift();
	}
}

function runTime(n_mins, n_speed){
	$('#cur_time').text($('#datetimepicker1').val());

	var n_curMins = n_mins;
	g_nIntervalID = setInterval(() => {
		if (g_isFocus == false) return;
		n_curMins --;
		let str_curtime = $('#cur_time').text();
		let cur_time = moment(str_curtime, "MM/DD/YYYY hh:mm A").add(1, 'minutes').format("MM/DD/YYYY hh:mm A");
		$('#cur_time').text(cur_time);
		IsAvailableMotion(cur_time, n_speed);	// Check available move stack
		if (n_curMins == 0){
			clearInterval(g_nIntervalID);
			$('#speed_playback').prop('disabled', false);
		}
	}, TIME_FRAME_1MIN * n_speed);
}

function IsAvailableMotion(cur_time, n_speed){
	let current_time = moment(cur_time, "MM/DD/YYYY hh:mm A");
	if (g_arr_st_MoveAnime.length > 0){
		move_time = moment(g_arr_st_MoveAnime[0].data.command_data.from_time, "MM/DD/YYYY hh:mm");
		if (move_time - current_time == 0){
			MoveEngine();
		}
	}

	if (g_arr_st_AlertAnime.length > 0){
		alert_time = moment(g_arr_st_AlertAnime[0].data.time, "MM/DD/YYYY hh:mm");
		if (alert_time - current_time == 0){
			AlertEngine();
		}
	}

	if (g_arr_st_TagAnime.length > 0){
		stat_time = moment(g_arr_st_TagAnime[0].command_data.time, "MM/DD/YYYY hh:mm");
		if (stat_time - current_time == 0){
			StateEngine();
		}
	}
}

function onInit(){
	var json_Data = getAllData();
	var json_Sorted_Data = json_Data.tagData.sort(sortByTimeframe);

	$('#datetimepicker1').datetimepicker();
	$('#datetimepicker1').val('01/01/2019 09:50 AM');
	$('#datetimepicker2').datetimepicker();
	$('#datetimepicker2').val('01/01/2019 11:40 AM');

	$('#speed_playback').prop('disabled', true);

	clearInterval(g_nIntervalID);

	let n_speed = $('#speed_playback').val();
	let n_mins = getTotalMinutes($('#datetimepicker1').val(), $('#datetimepicker2').val());
	runTime(n_mins, n_speed);
	process_Tags(json_Sorted_Data, n_speed);
}

(function () {
	onInit();
})();