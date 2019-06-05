const TIME_FRAME_1MIN = 80;
var g_isFocus = true;
var g_allData = {"TagList": [], "MoveList": {}, "AlertList": {}};
var g_allAnimeData = {"MoveList": {}, "AlertList": {}};
var g_arrStatsVals = {"Patients": [], "Assets":[], "LoS": [], "Turnover": []}
var g_nIntervalID;
var g_fromTime, g_toTime;

function onSpeedRun(){
	// Remove all elements
	$("#icon_path").empty();
	$("#markers").empty();
	$("#icon_location").empty();
	$("#alerts").empty();

	g_allData = {"TagList": [], "MoveList": {}, "AlertList": {}};
	g_allAnimeData = {"MoveList": {}, "AlertList": {}};
	g_arrStatsVals = {"Patients": [], "Assets":[], "LoS": [], "Turnover": []}

	$("#patients").html("0");

	onInit();
}

window.addEventListener('blur', function(){
	console.log("blured");
	g_isFocus = false;
});
window.addEventListener('focus', function(){
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
					if ((stat_time >= from_time) && (stat_time <= to_time)){
						g_arrStatsVals["Patients"].push(data[i].command_data.stat_values[j]);
					}
				}
			}else if(data[i].command_data.stat_type == "No of assets"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time >= from_time) && (stat_time <= to_time)){
						g_arrStatsVals["Assets"].push(data[i].command_data.stat_values[j]);
					}
				}
			}else if(data[i].command_data.stat_type == "Length of stay"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time >= from_time) && (stat_time <= to_time)){
						g_arrStatsVals["LoS"].push(data[i].command_data.stat_values[j]);
					}
				}
			}else if(data[i].command_data.stat_type == "Room turnover"){
				for (let j = 0; j < data[i].command_data.stat_values.length; j ++){
					let stat_time = moment(data[i].command_data.stat_values[j].time, "YYYY-MM-DD hh:mm:ss");
					if ((stat_time >= from_time) && (stat_time <= to_time)){
						g_arrStatsVals["Turnover"].push(data[i].command_data.stat_values[j]);
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

function ResetPath(id, x, y, time){
	anime({
		targets: id,
		easing: 'linear',
		duration: TIME_FRAME_1MIN * time / 2,
		opacity: 0,
		autoplay: true,
		complete: function(){
			anime({
				targets: id,
				easing: 'linear',
				points: [
					{ value: x + ', ' + y + ', ' + x + ', ' + y}
				],
				duration: 0,
				opacity: 0,
				autoplay: true
			});
		}
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
	if (moveData.data.command_data.to_zone == "registration") StateEngine();
	if (moveData.data.command_data.from_zone.indexOf("Room") >= 0){
		let room_id = moveData.data.command_data.from_zone;
		$("#" + room_id).show();
	}

	let cur_anime = moveData.anime;
	let cur_path = moveData.path;
	let x = moveData.data.command_data.to_x*1;
	let y = moveData.data.command_data.to_y*1;
	let time = moveData.data.command_data.from_time;
	let zone = moveData.data.command_data.zone;
	let from_time = moment(moveData.data.command_data.from_time, "YYYY-MM-DD hh:mm:ss");
	let to_time = moment(moveData.data.command_data.to_time, "YYYY-MM-DD hh:mm:ss");
	let diff_time = (to_time - from_time) / 1000 / 60;

	let patient_id = moveData.data.command_data["patient_id"];
	moveIconToTop(patient_id);
	cur_anime.complete = function(){
		remove_all_circles_id(patient_id);
		createCircle(patient_id, x, y);
		ResetPath(cur_path.targets, x, y, (diff_time < 5) ? diff_time : 5);
	};

	anime(cur_anime);
	anime(cur_path);
}

function AlertEngine(alertData){
	if (alertData.data.zone.indexOf("Room") >= 0){
		let room_id = alertData.data.zone;
		$("#" + room_id).hide();
	}

	$(alertData.id).attr("x", alertData.data.x);
	$(alertData.id).attr("y", alertData.data.y);
	$(alertData.id + "_desc").attr("x", alertData.data.x + 5);
	$(alertData.id + "_desc").attr("y", alertData.data.y + 10);
	$(alertData.id + "_time").attr("x", alertData.data.x + 5);
	$(alertData.id + "_time").attr("y", alertData.data.y + 19);

	moveAlertToTop(alertData.id);

	if (alertData.data.alert_text.indexOf("Nurse") >= 0){
		createNurse(alertData.data["patient_id"], alertData.data.x, alertData.data.y);
	}else if (alertData.data.alert_text.indexOf("Doctor") >= 0){
		createDoctor(alertData.data["patient_id"], alertData.data.x, alertData.data.y);
	}else if (alertData.data.alert_text.indexOf("Infusion") >= 0){
		createPump(alertData.data["patient_id"], alertData.data.x, alertData.data.y);
	}

	// start alert animation
	let alert = alertData.alert;
	alert.targets = alert.targets + "," + alert.targets + "_desc" + "," + alert.targets + "_time";
	let id = alert.targets;
	let x = alertData.x;
	let y = alertData.y;
	
	anime(alert);
}

function StateEngine(){
	let patients = $("#patients").html()*1 + 1;
	$("#patients").html(patients);
}

function runTime(n_mins, n_speed){
	$('#cur_time').text($('#datetimepicker1').val());

	var n_curMins = 0;
	g_nIntervalID = setInterval(() => {
		if (g_isFocus == true){
			let str_curtime = $('#cur_time').text();
			let cur_time = moment(str_curtime, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD HH:mm:ss");

			IsAvailableMotion(cur_time, n_speed);	// Check available move stack

			if (n_curMins == n_mins){
				clearInterval(g_nIntervalID);
				$('#speed_playback').prop('disabled', false);
				$('#datetimepicker1').prop('disabled', false);
				$('#datetimepicker2').prop('disabled', false);
			}else{
				if (n_mins % 60 == 0){
					// moveChartDesc(n_curMins);
					drawChartLos(g_arrStatsVals["LoS"], moment(str_curtime, "YYYY-MM-DD hh:mm:ss"));
					drawChartTurnover(g_arrStatsVals["Turnover"], moment(str_curtime, "YYYY-MM-DD hh:mm:ss"));
				}
				n_curMins ++;
				$('#cur_time').text(moment(str_curtime, "YYYY-MM-DD hh:mm:ss").add(1, 'minutes').format("YYYY-MM-DD HH:mm"));
			}
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
					let patient_id = g_allAnimeData.AlertList[strTagName][j].data["patient_id"];
					if(g_allAnimeData.AlertList[strTagName][j].data.alert_type == "patient in discharge"){
						remove_all_by_id(patient_id);
					}
					if(g_allAnimeData.AlertList[strTagName][j].data.alert_text.indexOf("Nurse") >= 0){
						remove_nurse_by_id(patient_id);
					}
					if(g_allAnimeData.AlertList[strTagName][j].data.alert_text.indexOf("Doctor") >= 0){
						remove_doctor_by_id(patient_id);
					}
					if(g_allAnimeData.AlertList[strTagName][j].data.alert_text.indexOf("Infusion") >= 0){
						remove_pump_by_id(patient_id);
					}
				}
				if (alert_end_time - alert_from_time > 3 * 60 * 1000){
					if (current_time - alert_from_time >= 3 * 60 * 1000){
						ResetAlert(g_allAnimeData.AlertList[strTagName][j].alert.targets);
					}
				}else{
					if (alert_end_time - current_time == 0){
						ResetAlert(g_allAnimeData.AlertList[strTagName][j].alert.targets);
					}
				}
			}
		}
	}
}

function onInit(){
	var json_Data = getAllData();
	json_Data = getAvailableData(json_Data.tagdata);
	getByTag(json_Data);

	$('#speed_playback').prop('disabled', true);
	$('#datetimepicker1').prop('disabled', true);
	$('#datetimepicker2').prop('disabled', true);

	clearInterval(g_nIntervalID);

	let n_speed = $('#speed_playback').val();
	let n_mins = getTotalMinutes($('#datetimepicker1').val(), $('#datetimepicker2').val());
	runTime(n_mins, n_speed);
	process_Tags(null, n_speed);
}

(function () {
	$('#datetimepicker1').datetimepicker({format: 'YYYY-MM-DD HH:mm'}).on( "dp.hide", function() {
		picked_time = moment($('#datetimepicker1').val(), "YYYY-MM-DD hh:mm:ss");
		if (picked_time - g_fromTime != 0) onSpeedRun();
	});
	$('#datetimepicker2').datetimepicker({format: 'YYYY-MM-DD HH:mm'}).on( "dp.hide", function() {
		picked_time = moment($('#datetimepicker2').val(), "YYYY-MM-DD hh:mm:ss");
		if (picked_time - g_toTime != 0) onSpeedRun();
	});
	$('#datetimepicker1').val('2019-05-01 00:00');
	$('#datetimepicker2').val('2019-05-02 00:00');
	g_fromTime = moment($('#datetimepicker1').val(), "YYYY-MM-DD hh:mm:ss");
	g_toTime = moment($('#datetimepicker2').val(), "YYYY-MM-DD hh:mm:ss");

	onInit();
})();