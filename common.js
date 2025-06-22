// 时间差计算
document.addEventListener('DOMContentLoaded', function() {
	// 显示当前UTC时间
	function updateCurrentTime() {
		const now = new Date();
		const utcTime = now.toUTCString().replace('GMT', 'UTC');
		document.getElementById('currentTime').textContent = utcTime;
	}
	updateCurrentTime();
	setInterval(updateCurrentTime, 1000);

	// 解析日期字符串
	function parseDate(dateStr) {
		const parts = dateStr.split(' ');
		if (parts.length < 4) return null;

		const dateParts = parts.slice(0, 3);
		const timeParts = parts[3].split(':');

		const year = parseInt(dateParts[0]);
		const month = parseInt(dateParts[1]) - 1; // 月份0-11
		const day = parseInt(dateParts[2]);
		const hour = parseInt(timeParts[0]);
		const minute = parseInt(timeParts[1]);
		const second = parseInt(timeParts[2] || 0);

		return new Date(Date.UTC(year, month, day, hour, minute, second));
	}

	// 计算时间差
	function calculateTimeDiff(targetDate) {
		const now = new Date();
		const nowUTC = Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		);

		const targetUTC = targetDate.getTime();
		const isPast = targetUTC <= nowUTC;
		const diffMs = Math.abs(nowUTC - targetUTC);

		// 计算各时间单位
		const seconds = Math.floor(diffMs / 1000) % 60;
		const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
		const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		// 计算年和月（考虑闰年）
		let years = 0;
		let months = 0;
		let remainingDays = days;

		const startYear = isPast ? targetDate.getUTCFullYear() : now.getUTCFullYear();
		const endYear = isPast ? now.getUTCFullYear() : targetDate.getUTCFullYear();

		for (let year = startYear; year < endYear; year++) {
			const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
			const yearDays = isLeapYear ? 366 : 365;

			if (remainingDays >= yearDays) {
				years++;
				remainingDays -= yearDays;
			} else {
				break;
			}
		}

		const startMonth = isPast ? targetDate.getUTCMonth() : now.getUTCMonth();
		let monthCounter = startMonth;

		while (remainingDays > 0) {
			const monthDays = new Date(Date.UTC(
				isPast ? targetDate.getUTCFullYear() + years : now.getUTCFullYear() + years,
				monthCounter + 1,
				0
			)).getUTCDate();

			if (remainingDays >= monthDays) {
				months++;
				remainingDays -= monthDays;
				monthCounter = (monthCounter + 1) % 12;
			} else {
				break;
			}
		}

		return {
			years,
			months,
			days: remainingDays,
			hours,
			minutes,
			seconds,
			isPast
		};
	}

	// 更新所有时间元素
	const timeElements = document.querySelectorAll('.time');
	timeElements.forEach(timeEl => {
		const resultEl = timeEl.nextElementSibling;
		const targetDate = parseDate(timeEl.textContent.trim());

		if (!targetDate || isNaN(targetDate.getTime())) {
			resultEl.textContent = "无效日期";
			return;
		}

		const diff = calculateTimeDiff(targetDate);
		const timeStr =
			`${diff.years}年${diff.months}个月${diff.days}天${diff.hours}小时${diff.minutes}分${diff.seconds}秒`;

		resultEl.textContent = diff.isPast ?
			`已经过去: ${timeStr}` :
			`还有: ${timeStr} 到来`;
	});
});

$(document).ready(function() {
	$('.random-button').click(function() {
		var container = $(this).closest('.random-container');
		var urls = container.data('urls').split('|');
		var randomIndex = Math.floor(Math.random() * urls.length);
		window.location.href = urls[randomIndex];
	});
});
