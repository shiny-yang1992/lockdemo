var Colors = {
	Red: "rgb(255,0,0)",
	Blue: "rgb(0,0,255)",
	Green: "rgb(0,255,0)",
	White: "rgb(255,255,255)",
	Black: "rgb(0,0,0)",
	Yellow: "rgb(255,255,0)"
}

var DEFAULT_THRESHOLD = 0.01
var TARGET_FPS = 60.0

var SPUtil
SPUtil = {
	expt_value_in_seconds:function(threshold, start, seconds) {
			return 1 - Math.pow((threshold / start), 1 / (TARGET_FPS * seconds))
	},
	normalized_default_expt_value_in_seconds:function(seconds) {
			return SPUtil.expt_value_in_seconds(DEFAULT_THRESHOLD, 1, seconds)
	},
	exptvsec:function(seconds) {
		return SPUtil.normalized_default_expt_value_in_seconds(seconds)
	},
	expt_sec:function(start,to,sec,dt_scale) {
		return SPUtil.expt(start,to,SPUtil.exptvsec(sec),dt_scale)
	},
	delta_time_to_timescale:function(s_frame_delta_time) {
		return s_frame_delta_time / (1.0 / TARGET_FPS)
	},
	timescale_to_delta_time:function(dt_scale) {
		return dt_scale * (1.0 / TARGET_FPS)
	},
	expt:function(start, to, pct, dt_scale) {
		if (Math.abs(to - start) < DEFAULT_THRESHOLD) {
			return to
		}
		var y = SPUtil.expty(start,to,pct,dt_scale)
		//rtv = start + (to - start) * timescaled_friction
		var delta = (to - start) * y
		return start + delta
	},
	expty:function(start,to,pct,dt_scale) {
		//y = e ^ (-a * timescale)
		var friction = 1 - pct
		var a = -Math.log(friction)
		return 1 - Math.exp(-a * dt_scale)
	},
	clamp:function(val,min,max) {
		return val < min ? min : (val > max ? max : val);
	},
	pt_dist:function(ax, ay, bx, by) {
		return Math.sqrt(Math.pow(ax-bx,2)+Math.pow(ay-by,2));
	},
	y_for_point_of_2pt_line: function (pt1x, pt1y, pt2x, pt2y, x) {
		//--(y - y1)/(x - x1) = m--
		var m = (pt1y - pt2y) / (pt1x - pt2x)
		//--y - mx = b--
		var b = pt1y - m * pt1x
		return m * x + b
	},
	rand_rangei: function(min,max) {
		return Math.floor((max - min) * Math.random()) + min
	},
	array_shuffle: function(array) {
		var currentIndex = array.length
			, temporaryValue
			, randomIndex
			;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
};
