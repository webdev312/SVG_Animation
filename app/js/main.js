(function () {
	function El(a) { return document.querySelector(a); }

	var users = getMovementData();

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

	$('#datetimepicker1').datetimepicker();
	$('#datetimepicker2').datetimepicker();

	createUser(users);

})();