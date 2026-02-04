export function formatDate(startStr, endStr) {
	if (!startStr) return '';

	const months = [
		'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
		'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
	];

	const parseDate = (str) => {
		// Detect date-only strings: "YYYY-MM-DD"
		if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
			const [y, m, d] = str.split('-').map(Number);
			return new Date(y, m - 1, d); // JS months are 0-based
		}
		return new Date(str);
	};

	const start = parseDate(startStr);
	const end = endStr ? parseDate(endStr) : null;

	const pad = (n) => n.toString().padStart(2, '0');

	const formatDateStr = (date) => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
	const formatDayMonth = (date) => `${date.getDate()} ${months[date.getMonth()]}`;
	const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

	const hasRealTime = (date) => date && (date.getHours() !== 0 || date.getMinutes() !== 0);

	const startHasTime = hasRealTime(start);
	const endHasTime = hasRealTime(end);

	const sameDay =
		end &&
		start.getDate() === end.getDate() &&
		start.getMonth() === end.getMonth() &&
		start.getFullYear() === end.getFullYear();

	const sameMonth =
		end &&
		start.getMonth() === end.getMonth() &&
		start.getFullYear() === end.getFullYear();

	const sameYear = end && start.getFullYear() === end.getFullYear();

	// No end date
	if (!end) {
		return startHasTime
			? `${formatDateStr(start)} alle ${formatTime(start)}`
			: formatDateStr(start);
	}

	// Same day
	if (sameDay) {
		if (startHasTime && endHasTime) {
			return `${formatDateStr(start)} dalle ${formatTime(start)} alle ${formatTime(end)}`;
		} else if (!startHasTime && endHasTime) {
			return `${formatDateStr(start)} fino alle ${formatTime(end)}`;
		} else if (startHasTime) {
			return `${formatDateStr(start)} alle ${formatTime(start)}`;
		} else {
			return formatDateStr(start);
		}
	}

	// Date range without times
	if (!startHasTime && !endHasTime) {
		if (sameMonth) {
			return `${start.getDate()}–${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
		} else if (sameYear) {
			return `${formatDayMonth(start)}–${formatDayMonth(end)} ${start.getFullYear()}`;
		} else {
			return `${formatDateStr(start)}–${formatDateStr(end)}`;
		}
	}

	// Date range with times
	return `Dal ${formatDateStr(start)}${startHasTime ? ' alle ' + formatTime(start) : ''} al ${formatDateStr(end)}${endHasTime ? ' alle ' + formatTime(end) : ''}`;
}

export function formatDateNumbers(startStr, endStr) {
    if (!startStr) return '';

    const parseDate = (str) => {
        // Rileva stringhe solo data: "YYYY-MM-DD"
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            const [y, m, d] = str.split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date(str);
    };

    const start = parseDate(startStr);
    const end = endStr ? parseDate(endStr) : null;

    const pad = (n) => n.toString().padStart(2, '0');

    // Formato richiesto: 24.11.26 (Giorno.Mese.AnnoBreve)
    const formatN = (date) => {
        const d = pad(date.getDate());
        const m = pad(date.getMonth() + 1);
        const y = date.getFullYear().toString().slice(-2); // Prende le ultime due cifre
        return `${d}.${m}.${y}`;
    };

    const sameDay =
        end &&
        start.getDate() === end.getDate() &&
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear();

    // Singola data
    if (!end || sameDay) {
        return formatN(start);
    }

    // Range di date (es. 24.11.26–28.11.26)
    return `${formatN(start)}–${formatN(end)}`;
}

export function isPast(datetime) {
	if (!datetime) return false;
	const now = new Date();
	const start = new Date(datetime);
	return now >= start;
}

export function isOngoing(start, end) {
	if (!start || !end) return false;
	const now = new Date();
	const startDate = new Date(start);
	const endDate = new Date(end);
	return now >= startDate && now <= endDate;
}

export function isUpcoming(start, end) {
	if (!start) return false;
	const now = new Date();
	const startDate = new Date(start);
	return now < startDate;
}
