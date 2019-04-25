const TIME_FRAME_10MIN = 200;

(function () {
	function El(a) { return document.querySelector(a); }

	var json_Data = getAllData();
	var json_Sorted_Data = json_Data.tagData.sort(sortByTimeframe);
	console.log(json_Data.tagData);
	console.log(json_Sorted_Data);

	// Sort json data by timeframe without considering replay_type
	function sortByTimeframe(a, b){
		return new Date(a.replay_data.time).getTime() - new Date(b.replay_data.time).getTime();
	}

	// Create Element by ID
	function createIcon(data_Term){
		let str_tag = replaceAll(data_Term.replay_data.tag, " ", "_");
		let str_icon = "/svg/" + replaceAll(data_Term.replay_data.icon, " ", "_");

		let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
			imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
			imageIcon.setAttribute('id', 'icon_' + str_tag);
			imageIcon.setAttribute('width', '14');
			imageIcon.setAttribute('height', '14');
			imageIcon.setAttribute('opacity', '0');
			imageIcon.setAttribute('x', parseInt(data_Term.replay_data.x) - 7);
			imageIcon.setAttribute('y', parseInt(data_Term.replay_data.y) - 14);

		let pathLine = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			pathLine.setAttribute('points', data_Term.replay_data.x + ', ' + data_Term.replay_data.y + ', ' + data_Term.replay_data.x + ', ' + data_Term.replay_data.y + '');
			pathLine.setAttribute('id', 'path_' + str_tag);
			pathLine.setAttribute('stroke', '#455');
			pathLine.setAttribute('opacity', '0');
			pathLine.setAttribute('stroke-linecap', 'round');
			pathLine.setAttribute('stroke-width', '3');

		El('#icon_path').appendChild(pathLine);
		El('#icon_location').appendChild(imageIcon);
	}

	var arr_st_Anime = [];

	function doTest(arr_Data, n_speed){
		var initX = -999;
		var initY = -999;
		var prevX = -999;
		var prevY = -999;
		for (let i = 0; i < arr_Data.length; i ++){
			if (arr_Data[i].replay_type != "Tag Movement") continue;

			let str_tag = replaceAll(arr_Data[i].replay_data.tag, " ", "_");
			if ($('#icon_' + str_tag).length == 0) createIcon(arr_Data[i]);

			if (initX == -999) initX = arr_Data[i].replay_data.x * 1;
			if (initY == -999) initY = arr_Data[i].replay_data.y * 1;
			if (prevX == -999) prevX = arr_Data[i].replay_data.x * 1;
			if (prevY == -999) prevY = arr_Data[i].replay_data.y * 1;

			// createPath(prevX, prevY, arr_Data[i].replay_data.x*1, arr_Data[i].replay_data.y*1, 'path_' + arr_Data[i].replay_data.tag + arr_st_Anime.length);

			// Use time difference to calculate delay
			let move_time = moment(arr_Data[i].replay_data.time, "MM/DD/YYYY hh:mm");
			let n_duration = n_speed*TIME_FRAME_10MIN;

			let st_Anime = {
				targets: '#icon_John',
				translateX: arr_Data[i].replay_data.x*1 - initX,
				translateY: arr_Data[i].replay_data.y*1 - initY,
				duration: n_duration*2,
				opacity: 1,
				easing: 'linear',
				autoplay: true,
			}

			let st_Path = {
				targets: '#path_John',
				easing: 'linear',
				points: [
					{ value: prevX + ', ' + prevY + ', ' + arr_Data[i].replay_data.x + ', ' + arr_Data[i].replay_data.y}
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
			arr_st_Anime.push(st_move);

			prevX = arr_Data[i].replay_data.x * 1;
			prevY = arr_Data[i].replay_data.y * 1;
		}
	}

	function ResetPath(id, x, y){
		anime({
			targets: id,
			easing: 'linear',
			points: [
				{ value: x + ', ' + y + ', ' + x + ', ' + y}
			],
			duration: 200,
			opacity: 0,
			autoplay: true,
		});
	}

	function MoveEngine(){
		if (arr_st_Anime.length > 0){
			let cur_anime = arr_st_Anime[0].anime;
			let cur_path = arr_st_Anime[0].path;
			let x = arr_st_Anime[0].data.replay_data.x*1;
			let y = arr_st_Anime[0].data.replay_data.y*1;
			let time = arr_st_Anime[0].data.replay_data.time;
			let zone = arr_st_Anime[0].data.replay_data.zone;
			cur_anime.complete = function(){
				createCircle(x, y);
				createMoveDesc(x, y, time, zone);
				ResetPath(cur_path.targets, x, y);
			};
			
			arr_st_Anime.shift();

			anime(cur_anime);
			anime(cur_path);
		}
	}

	function createCircle(x, y){
		let pathDot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
			pathDot.setAttribute('cx', x);
			pathDot.setAttribute('cy', y);
			pathDot.setAttribute('r', 4);
			pathDot.setAttribute('fill', "#f98");
			pathDot.setAttribute('stroke', "#455");
			pathDot.setAttribute('stroke-width', 3);

		El('#markers').appendChild(pathDot);
	}

	function createMoveDesc(x, y, time, zone){
		let pointText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		pointText.setAttribute('x', x + 7);
		pointText.setAttribute('y', y);
		pointText.setAttribute('class', 'point_text');

		let textTime = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
		let textZone = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
		textTime.setAttribute('dy', 0);
		textZone.setAttribute('dy', 5);
		textTime.setAttribute('x', x + 7);
		textZone.setAttribute('x', x + 7);

		textTime.textContent = time;
		textZone.textContent = zone;

		pointText.appendChild(textTime);
		pointText.appendChild(textZone);
		El('#markers').appendChild(pointText);
	}
	
	function getTotalMinutes(){
		let str_Start = $('#datetimepicker1').val();
		let str_End = $('#datetimepicker2').val();
		let time_Start = moment(str_Start, "MM/DD/YYYY hh:mm A");
		let time_End = moment(str_End, "MM/DD/YYYY hh:mm A");
		var duration = time_End - time_Start;
		return duration/1000/60;
	}

	var n_intervalID;
	function runTime(n_mins, n_speed){
		$('#cur_time').text($('#datetimepicker1').val());

		var n_curMins = n_mins/10;
		n_intervalID = setInterval(() => {
			n_curMins --;
			let str_curtime = $('#cur_time').text();
			let cur_time = moment(str_curtime, "MM/DD/YYYY hh:mm A").add(10, 'minutes').format("MM/DD/YYYY hh:mm A");
			$('#cur_time').text(cur_time);
			IsAvailableMotion(cur_time, n_speed);
			if (n_curMins == 0) clearInterval(n_intervalID);
		}, TIME_FRAME_10MIN * n_speed);
	}

	function IsAvailableMotion(cur_time, n_speed){
		if (arr_st_Anime.length <= 0) return;
		curent_time = moment(cur_time, "MM/DD/YYYY hh:mm A");
		target_time = moment(arr_st_Anime[0].data.replay_data.time, "MM/DD/YYYY hh:mm");
		duration = 10*60*1000*2;
		if (target_time - curent_time - duration == 0){
			MoveEngine();
		}
	}

	function onInit(){
		$('#datetimepicker1').datetimepicker();
		$('#datetimepicker1').val('01/01/2019 9:40 AM');
		$('#datetimepicker2').datetimepicker();
		$('#datetimepicker2').val('01/01/2019 1:00 PM');

		let n_speed = $('#speed_playback').val();
		let n_mins = getTotalMinutes();
		runTime(n_mins, n_speed);
		doTest(json_Sorted_Data, n_speed);
	}

	function createUser(obj) {
		for (let i = 0; i < obj.tagData.length; i++) {
			let str_tag = replaceAll(obj.tagData[i].tag, " ", "_");
			let str_icon = replaceAll(obj.tagData[i].icon, " ", "_");
			let dot = obj.tagData[i];
			let a = i;

			var iconGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
			iconGroup.setAttribute('id', str_tag);
			var lineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
			var circlesGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');

			let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
			imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
			imageIcon.setAttribute('class', 'circle_icon');
			imageIcon.setAttribute('id', '' + (i) + 'circle_icon');

			imageIcon.setAttribute('width', '14');
			imageIcon.setAttribute('x', parseInt(obj.tagData[i].movementments[0]['x']) - 7);
			imageIcon.setAttribute('y', parseInt(obj.tagData[i].movementments[0]['y']) - 14);

			imageIcon.setAttribute('height', '14');

			for (let j = 0; j < obj.tagData[i].movementments.length; j++) {
				if (j > 0) {
					let point = j;
					let iconMove = function (el, x, y, step) {
						El('#' + el + ' .path_step' + step + '').style.strokeDasharray = El('#' + el + ' .path_step' + step + '').getTotalLength() + 2;
						El('#' + el + ' .path_step' + step + '').style.strokeDashoffset = El('#' + el + ' .path_step' + step + '').getTotalLength() + 2;
						El('#' + el + ' .circle_icon').setAttribute('x', parseInt(x) - 7);
						El('#' + el + ' .circle_icon').setAttribute('y', parseInt(y) - 14);
						El('#' + el + ' .path_step' + step + '').style.strokeDashoffset = 0;
						El('#' + el + ' .point_text' + step + '').style.opacity = 1;
						El('#' + el + ' .path_circles' + step + '').style.opacity = 1;
					}

					let pathLine = document.createElementNS("http://www.w3.org/2000/svg", 'path');
					pathLine.setAttribute('d', 'M' + obj.tagData[i].movementments[j - 1]['x'] + ', ' + obj.tagData[i].movementments[j - 1]['y'] + ' L' + obj.tagData[i].movementments[j]['x'] + ', ' + obj.tagData[i].movementments[j]['y'] + '');
					pathLine.setAttribute('fill', 'none');
					pathLine.setAttribute('class', 'path_step path_step' + j + '');
					pathLine.setAttribute('stroke', '#455');
					pathLine.setAttribute('stroke', '#455');
					pathLine.setAttribute('stroke-linecap', 'round');
					pathLine.setAttribute('stroke-width', '3');

					lineGroup.appendChild(pathLine);
					// iconGroup.appendChild(pathLine);
					setTimeout(function () { iconMove(str_tag, dot.movementments[point]['x'], dot.movementments[point]['y'], point) }, 2000 * j);
				}

				let pathDot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
				pathDot.setAttribute('class', 'path_circles path_circles' + j + '');
				pathDot.setAttribute('cx', obj.tagData[i].movementments[j]['x']);
				pathDot.setAttribute('cy', obj.tagData[i].movementments[j]['y']);
				pathDot.setAttribute('r', 4);
				pathDot.setAttribute('fill', "#f98");
				pathDot.setAttribute('stroke', "#455");
				pathDot.setAttribute('stroke-width', 3);

				circlesGroup.appendChild(pathDot);
				let pointText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
				pointText.setAttribute('x', parseInt(obj.tagData[i].movementments[j]['x']) + 7);
				pointText.setAttribute('y', parseInt(obj.tagData[i].movementments[j]['y']));
				pointText.setAttribute('class', 'point_text point_text' + j + '');

				let textTime = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
				let textZone = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
				textTime.setAttribute('dy', 0);
				textZone.setAttribute('dy', 5);
				textTime.setAttribute('x', parseInt(obj.tagData[i].movementments[j]['x']) + 7);
				textZone.setAttribute('x', parseInt(obj.tagData[i].movementments[j]['x']) + 7);

				textTime.textContent = obj.tagData[i].movementments[j]['time']
				textZone.textContent = obj.tagData[i].movementments[j]['zone']



				pointText.appendChild(textTime);
				pointText.appendChild(textZone);

				iconGroup.appendChild(pointText);

				// iconGroup.appendChild(pathDot);

			}
			iconGroup.appendChild(lineGroup);
			iconGroup.appendChild(circlesGroup);

			iconGroup.appendChild(imageIcon);
			El('#icon_location').appendChild(iconGroup);

		}

		let popup_icons = document.querySelectorAll('.circle_icon');
		for (let x = 0; x < popup_icons.length; x++) {
			popup_icons[x].addEventListener('click', function () {
				let id = parseInt(this.getAttribute('id'));
				let text = obj.tagData[id].popup_text;
				document.querySelector('.popup_text').innerHTML = '<img style="width:50px;" src="' + this.getAttribute('href') + '" />';
				document.querySelector('.popup_text').innerHTML += '<div>' + text + '</div>';

				document.querySelector('.popup_wraper').style.display = 'flex';
			});
		}
		document.querySelector('.popup_wraper').addEventListener('click', function () {
			this.style.display = 'none';
		});
	}

	onInit();
})();