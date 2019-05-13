const TIME_FRAME_1MIN = 100;
var g_isFocus = true;
var g_allData = {"TagList": [], "MoveList": {}, "AlertList": {}};
var g_allAnimeData = {"MoveList": {}, "AlertList": {}};
var g_arrStatsVals = {"Patients": [], "Assets":[], "LoS": []}
var g_nIntervalID;

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

// Remove all unnecessary data (selected timestamp)
function getAvailableData(data){
	let from_time = moment($('#datetimepicker1').val(), "YYYY-MM-DD hh:mm:ss");
	let to_time = moment($('#datetimepicker2').val(), "YYYY-MM-DD hh:mm:ss");
	let retData = [];
	for (let i = 0; i < data.length; i ++){
		if (data[i].command_type == "Tag stats"){
			if (data[i].command_data.stat_type == "No of patients"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time > from_time) && (stat_time <= to_time)){
						g_arrStatsVals["Patients"].push(data[i].command_data.stat_values[j]);
					}
				}
			}else if(data[i].command_data.stat_type == "No of assets"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time > from_time) && (stat_time <= to_time)){
						g_arrStatsVals["Assets"].push(data[i].command_data.stat_values[j]);
					}
				}
			}else if(data[i].command_data.stat_type == "Length of stay"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time > from_time) && (stat_time <= to_time)){
						g_arrStatsVals["LoS"].push(data[i].command_data.stat_values[j]);
					}
				}
			}
		}else{
			dt_from_time = moment(data[i].command_data.from_time, "YYYY-MM-DD hh:mm:ss");
			dt_to_time = moment(data[i].command_data.to_time, "YYYY-MM-DD hh:mm:ss");
			if (dt_to_time <= from_time) continue;
			if (dt_from_time >= to_time) continue;
			retData.push(data[i]);
		}
	}
	return retData;
}
// Seperate json data by Tag names
function getByTag(data){
	// Get Patient IDs
	let arr_TagList = [];
	for (let i = 0; i < data.length; i ++){
		if (data[i].command_type == "Tag stats") continue;
		let bIsExist = false;
		let strTagName = data[i].command_data["patient_id"];
		for (let j = 0; j < arr_TagList.length; j ++){
			if (arr_TagList[j] == strTagName){
				bIsExist = true; break;
			}
		}
		if (bIsExist == false){
			arr_TagList.push(strTagName);
		}
	}
	g_allData.TagList = arr_TagList;
	
	let arrMoveTags = {};
	let arrAlertTags = {};

	for (let i = 0; i < arr_TagList.length; i ++){
		arrMoveTags[arr_TagList[i]] = [];
		arrAlertTags[arr_TagList[i]] = [];
	}

	// Divide json data by Tag names
	for (let i = 0; i < data.length; i ++){
		if (data[i].command_type == "Tag movement"){
			arrMoveTags[data[i].command_data["patient_id"]].push(data[i]);
		}
		if (data[i].command_type == "Tag alert"){
			arrAlertTags[data[i].command_data["patient_id"]].push(data[i]);
		}
	}

	g_allData.MoveList = arrMoveTags;
	g_allData.AlertList = arrAlertTags;
}

function process_Tags(arr_Data, n_speed){
	for (let n = 0; n < g_allData.TagList.length; n ++){
		/*
		// Move Animation by Tag Name
		*/
		let arr_MoveData = g_allData.MoveList[g_allData.TagList[n]];
		if (arr_MoveData.length == 0) continue;

		g_allAnimeData.MoveList[g_allData.TagList[n]] = [];
		let initX = -999;
		let initY = -999;
		for (let i = 0; i < arr_MoveData.length; i ++){
			let str_tag = replaceAll(arr_MoveData[i].command_data["patient_id"], " ", "_");
			if ($('#icon_' + str_tag).length == 0) createIcon(arr_MoveData[i]);

			if (initX == -999) initX = arr_MoveData[i].command_data.from_x*1;
			if (initY == -999) initY= arr_MoveData[i].command_data.from_y*1;

			let n_duration = n_speed*TIME_FRAME_1MIN;
			let from_time = moment(arr_MoveData[i].command_data.from_time,  "YYYY-MM-DD hh:mm:ss");
			let to_time = moment(arr_MoveData[i].command_data.to_time,  "YYYY-MM-DD hh:mm:ss");
			let diff_time = 1;

			let st_Anime = {
				targets: '#icon_' + str_tag,
				translateX: arr_MoveData[i].command_data.to_x*1 - initX,
				translateY: arr_MoveData[i].command_data.to_y*1 - initY,
				duration: n_duration*diff_time,
				opacity: 1,
				easing: 'linear',
				autoplay: true,
			}

			let st_Path = {
				targets: '#path_' + str_tag,
				easing: 'linear',
				points: [
					{ value: arr_MoveData[i].command_data.from_x + ', ' + arr_MoveData[i].command_data.from_y + ', ' + arr_MoveData[i].command_data.to_x + ', ' + arr_MoveData[i].command_data.to_y}
				],
				duration: n_duration*diff_time,
				opacity: 1,
				autoplay: true,
			}

			let st_move = {
				anime : st_Anime,
				path : st_Path,
				data : arr_MoveData[i]
			}
			g_allAnimeData.MoveList[g_allData.TagList[n]].push(st_move);
		}

		/*
		// Alert Animation by Tag Name
		*/
		let arr_AlertData = g_allData.AlertList[g_allData.TagList[n]];
		if (arr_AlertData.length == 0) continue;
		g_allAnimeData.AlertList[g_allData.TagList[n]] = [];

		for (let i = 0; i < arr_AlertData.length; i ++){
			let str_tag = replaceAll(arr_AlertData[i].command_data["patient_id"], " ", "_");
			createAlert('alert_' + str_tag + "_" + g_allAnimeData.AlertList[g_allData.TagList[n]].length, 0, 0, arr_AlertData[i].command_data.from_time, arr_AlertData[i].command_data.alert_text);

			let st_alertAnime = {
				targets: '#alert_' + str_tag + "_" + g_allAnimeData.AlertList[g_allData.TagList[n]].length,
				easing: 'linear',
				duration: n_speed*TIME_FRAME_1MIN,
				opacity: 1,
				autoplay: true,
			};

			let st_alert = {
				id : '#alert_' + str_tag + "_" + g_allAnimeData.AlertList[g_allData.TagList[n]].length,
				alert : st_alertAnime,
				data : arr_AlertData[i].command_data
			}

			g_allAnimeData.AlertList[g_allData.TagList[n]].push(st_alert);
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

function MoveEngine(moveData){
	let cur_anime = moveData.anime;
	let cur_path = moveData.path;
	let x = moveData.data.command_data.to_x*1;
	let y = moveData.data.command_data.to_y*1;
	let time = moveData.data.command_data.from_time;
	let zone = moveData.data.command_data.zone;

	let is_discharge = (moveData.data.command_data.sequence == "DISCHARGE") ? 1 : 0;
	let patient_id = moveData.data.command_data["patient_id"];
	cur_anime.complete = function(){
		createCircle(patient_id, x, y);
		// createMoveDesc(x, y, time, zone);
		ResetPath(cur_path.targets, x, y);
		if (is_discharge){
			setTimeout(() => {
				remove_all_by_id(patient_id);
			}, 1000);
		}
	};

	anime(cur_anime);
	anime(cur_path);
}

function AlertEngine(alertData){
	// calculate Movement Icon position to adjust Alert position
	let strMoveID = "#icon_" + alertData.data["patient_id"];
	let origin_x = $(strMoveID).attr("x");
	let origin_y = $(strMoveID).attr("y");
	let tran_data = $(strMoveID).css("transform").replace(/[^0-9\-.,]/g, '').split(',');
	origin_x = origin_x*1 + tran_data[4]*1;
	origin_y = origin_y*1 + tran_data[5]*1;

	// move alert element by id
	$(alertData.id).attr("x", origin_x + 13);
	$(alertData.id).attr("y", origin_y + 27);
	$(alertData.id + "_foreign").attr("x", origin_x + 19);
	$(alertData.id + "_foreign").attr("y", origin_y + 32);

	// start alert animation
	let alert = alertData.alert;
	alert.targets = alert.targets + "," + alert.targets + "_foreign";
	let id = alert.targets;
	let x = alertData.x;
	let y = alertData.y;
	
	anime(alert);
}

function StateEngine(cur_time){
	for (let i = 0; i < g_arrStatsVals["Patients"].length; i ++){
		let stat_time = moment(g_arrStatsVals["Patients"][i].time, "YYYY-MM-DD hh:mm:ss");
		if (cur_time - stat_time == 0){
			let patients = g_arrStatsVals["Patients"][i]["number of patients"];
			$("#patients").html(patients);

			let strOnTime = $("#ontimestarts").html();
			if (strOnTime == "0/0"){
				$("#ontimestarts").html(patients + "/" + patients);
			}else{
				$("#ontimestarts").html(strOnTime.replace(/.*\//, patients+"/"));
			}

			break;
		}
	}
}

function runTime(n_mins, n_speed){
	$('#cur_time').text($('#datetimepicker1').val());

	var n_curMins = n_mins;
	g_nIntervalID = setInterval(() => {
		if (g_isFocus == false) return;
		
		let str_curtime = $('#cur_time').text();
		let cur_time = moment(str_curtime, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");

		IsAvailableMotion(cur_time, n_speed);	// Check available move stack

		n_curMins --;
		$('#cur_time').text(moment(str_curtime, "YYYY-MM-DD hh:mm:ss").add(1, 'minutes').format("YYYY-MM-DD HH:mm"));

		if (n_curMins == 0){
			clearInterval(g_nIntervalID);
			$('#speed_playback').prop('disabled', false);
		}
	}, TIME_FRAME_1MIN * n_speed);
}

function IsAvailableMotion(cur_time, n_speed){
	let current_time = moment(cur_time, "YYYY-MM-DD hh:mm:ss");
	for (let i = 0; i < g_allData.TagList.length; i ++){
		let strTagName = g_allData.TagList[i];
		// check move animation
		if (g_allAnimeData.MoveList[strTagName] != undefined && g_allAnimeData.MoveList[strTagName].length > 0){
			for (let j = 0; j < g_allAnimeData.MoveList[strTagName].length; j ++){
				move_time = moment(g_allAnimeData.MoveList[strTagName][j].data.command_data.from_time, "YYYY-MM-DD hh:mm:ss");
				if (move_time - current_time == 60 * 1000){
					MoveEngine(g_allAnimeData.MoveList[strTagName][j]);
				}
			}
		}

		// check alert animiation
		if (g_allAnimeData.AlertList[strTagName] != undefined && g_allAnimeData.AlertList[strTagName].length > 0){
			for (let j = 0; j < g_allAnimeData.AlertList[strTagName].length; j ++){
				alert_from_time = moment(g_allAnimeData.AlertList[strTagName][j].data.from_time, "YYYY-MM-DD hh:mm:ss");
				if (alert_from_time - current_time == 0){
					AlertEngine(g_allAnimeData.AlertList[strTagName][j]);
				}
				alert_end_time = moment(g_allAnimeData.AlertList[strTagName][j].data.to_time, "YYYY-MM-DD hh:mm:ss");
				if (alert_end_time - current_time == 0){
					ResetAlert(g_allAnimeData.AlertList[strTagName][j].alert.targets);
				}
			}
		}
	}

	// State Engine
	StateEngine(current_time);
}

function onInit(){
	$('#datetimepicker1').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
	$('#datetimepicker1').val('2019-05-01 00:00');
	$('#datetimepicker2').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
	$('#datetimepicker2').val('2019-05-02 00:00');

	var json_Data = getAllData();
	json_Data = getAvailableData(json_Data.tagdata);
	getByTag(json_Data);

	$('#speed_playback').prop('disabled', true);

	clearInterval(g_nIntervalID);

	let n_speed = $('#speed_playback').val();
	let n_mins = getTotalMinutes($('#datetimepicker1').val(), $('#datetimepicker2').val());
	runTime(n_mins, n_speed);
	process_Tags(null, n_speed);
	drawChartLos(g_arrStatsVals["LoS"]);
}

(function () {
	onInit();
})();