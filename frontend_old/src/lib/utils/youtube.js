export function formatEmbed(video, autoplay = true) {
	if (!video || !video.youtubeVideoCode) {
		return "";
	}

	let rawCode = video.youtubeVideoCode.trim();
	let [videoId, query] = rawCode.split("&");
	let base = `https://www.youtube.com/embed/${videoId}`;
	let params = [];

	if (video.youtubePlaylistCode) {
		params.push(`list=${video.youtubePlaylistCode}`);
	}
	if (autoplay) {
		params.push(`autoplay=1`);
	}
	params.push(`rel=0`);

	if (query) {
		let match = query.match(/t=(\d+)s?/);
		if (match) {
			params.push(`start=${match[1]}`);
		}
	}

	return `${base}?${params.join("&")}`;
}