/**
 * COVID-19 Statistics by Country
 *
 * @version 1.0.0
 * @author Chris Thomson
 *
 */

var $uk = UIkit.util;
var app = {

	countries: {},
	inf: new Intl.NumberFormat(),
	sources: ["https://restcountries.eu/rest/v2/all"],
	tries: 2,

	/**
	 * Initialise
	 *
	 */
	init: function() {
		var this$1 = this;
		$uk.ajax(this.sources[0]).then(
			function(xhr) {
				if(xhr.status == 200) {
					try {
						this$1.countries = JSON.parse(xhr.response);
						this$1.get();
					} catch(e) {
						this$1.error(e);
					}
				} else {
					this$1.error("Error");
				}
			},
			function(e) {
				this$1.error(e);
			}
		);
	},

	/**
	 * Display HTML
	 *
	 * @param {string} html
	 *
	 */
	display: function(html) {
		$uk.html($uk.$("#display"), html);
	},

	/**
	 * Display an error message
	 *
	 * @param {string} message
	 *
	 */
	error: function(message) {
		this.display("<div class='uk-alert uk-alert-danger'>" + message + "</div>");
	},

	/**
	 * Get data
	 *
	 * @param {string} [date]
	 *
	 */
	get: function(date) {

		if(date === void 0) date = "";

		var this$1 = this;
		if(!(date instanceof Date)) date = date ? new Date(date) : new Date()
		this.tries--;
		this.sources[1] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
			date.toLocaleDateString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric"
			}).replace(/\//g, "-") +
		".csv";

		return $uk.ajax(this.sources[1]).then(
			function(xhr) {

				if(xhr.status == 200) {

					var str = xhr.response;
					var delimiter = ",";
					var re = new RegExp(
						(
							// Delimiters.
							"(\\" + delimiter + "|\\r?\\n|\\r|^)" +

							// Quoted fields.
							"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

							// Standard fields.
							"([^\"\\" + delimiter + "\\r\\n]*))"
						),
						"gi"
					);

					var data = [[]];
					var matches = null;
					while(matches = re.exec(str)) {

						var delimiterMatched = matches[1];
						if(delimiterMatched.length && delimiterMatched !== delimiter) {
							data.push([]);
						}

						var value;
						if(matches[2]) {
							value = matches[2].replace(new RegExp( "\"\"", "g" ), "\"");
						} else {
							value = matches[3];
						}

						data[data.length - 1].push(value);
					}

					data.shift();

					var rows = [];
					var lastUpdated = "";
					var us = ["", "", "", "United States", "", "", "", 0, 0, 0, 0];
					data.forEach(function(row) {
						if(!row[0] && !row[1] && !row[2]) {
							var td = this$1.td(row);
							if(td) rows.push(td);
						} else if(row[3] == "US" && row[1] !== "Unassigned") {
							for(var i = 7; i < 11; i++) {
								us[i] = parseInt(us[i]) + parseInt(row[i]);
							}
						}
						if(row[4]) lastUpdated = row[4];
					});

					rows.push(this$1.td(us));

					var avg = {
						6: [],
						7: [],
						8: [],
						10: [],
						11: [],
						12: [],
					};

					var tr = [];
					var population, area, density, gini, cases, cases_pm, deaths, deaths_pm;
					rows.forEach(function(row) {

						population = row[1];
						area = row[2];
						density = row[3];
						gini = row[4];
						cases = parseInt(row[5]);
						deaths = parseInt(row[6]);
						cases_pm = ((cases / population) * 1000000).toFixed(2);
						cases_pk = (cases / area).toFixed(4);
						cases_pg = (cases_pm / gini).toFixed(4);
						deaths_pm = ((deaths / population) * 1000000).toFixed(2);
						deaths_pk = (deaths / area).toFixed(4);
						deaths_pg = (deaths_pm / gini).toFixed(4);

						avg[6].push(cases_pm);
						avg[7].push(cases_pk);
						avg[8].push(cases_pg);
						avg[10].push(deaths_pm);
						avg[11].push(deaths_pk);
						avg[12].push(deaths_pg);

						if(deaths_pm > 1) {
							tr.push(this$1.join([
								row[0],
								this$1.inf.format(population),
								this$1.inf.format(area),
								this$1.inf.format(density),
								gini,
								this$1.inf.format(cases),
								cases_pm,
								cases_pk,
								cases_pg,
								this$1.inf.format(deaths),
								deaths_pm,
								deaths_pk,
								deaths_pg,
								this$1.inf.format(row[7]),
								this$1.inf.format(row[8]),
							], "td"));
						}
					});

					var sources = ["Sources:"];
					var url;
					for(var i = 0; i < this$1.sources.length; i++) {
						url = this$1.sources[i];
						sources.push((i + 1) + ": <a href='" + url + "' target='_blank' rel='noopener'>" + url + "</a>");
					}
					sources.push("");
					sources.push("Last Updated: " + lastUpdated + " (UTC)");

					var lbl_pks = "p/km2";
					var lbl__pks = lbl_pks.replace("2", "<sup>2</sup>");
					var lbl_pm = "p/Mil.";
					var lbl__pm = "per Million";

					// Display the table
					this$1.display(
						"<div class='uk-overflow-auto'>" +
							"<table class='uk-table uk-table-small uk-table-divider uk-table-justify'>" +
								"<thead><tr>" + this$1.join([
									"Country",
									this$1.th("Population", 1),
									this$1.th("Area", 1, lbl_pks),
									this$1.th("Density", 1, "Population " + lbl_pks),
									this$1.th("Gini", 1),
									this$1.th("Cases", 2),
									this$1.th(lbl_pm, 0, "Confirmed cases " + lbl__pm),
									this$1.th(lbl__pks, 0, "Confirmed cases " + lbl_pks),
									this$1.th("by Gini", 0, "Cases gini @todo"),
									this$1.th("Deaths", 2),
									this$1.th(lbl_pm, 0, "Deaths " + lbl__pm),
									this$1.th("by Gini", 0, "Deaths gini @todo"),
									this$1.th(lbl__pks, 0, "Confirmed deaths " + lbl_pks),
									this$1.th("Recovered", 2),
									this$1.th("Active", 2),
								], "th") + "</tr></thead>" +
								"<tbody>" + this$1.join(tr, "tr") + "</tbody>" +
							"</table>" +
						"</div>" +
						"<div class='uk-text-meta uk-margin-medium-top'>" +  sources.join("<br>") + "</div>"
					);

					var table = $uk.$(".uk-table");
					var tr = $uk.$$("tbody tr", table);

					// Highlights
					for(var i in avg) {
						var a = avg[i];
						for(var n = 0; n < a.length; n++) {
							a[n] = parseFloat(a[n]);
						}
						a.sort();
						var l = a.length;
						var mean = a.reduce(function(x, y) {
							return x + y;
						}) / l;
						var xm = (mean - a[0]) / 2;
						var ym = ((a[l - 1] - mean) / 2) + mean;
						tr.forEach(function(row) {
							var td = $uk.$$("td", row)[i];
							var value = parseFloat(td.innerHTML);
							$uk.addClass(td, "uk-text-" + (value < mean ? (value > xm ? "default" : "success") : (value < ym ? "warning" : "danger")));
						});
					}

					$uk.on(table, "click", "th span", function(e) {

						var th = e.target.parentElement;
						var cellIndex = th.cellIndex;
						var clsActive = "uk-active";
						var desc = $uk.hasClass(th, "desc");

						if(!desc) $uk.removeClass($uk.$$("th", table), "desc");
						$uk.removeClass($uk.$$("td, th", table), clsActive);
						$uk.toggleClass(th, "desc");
						$uk.addClass(th, clsActive);

						// Add the active class to the column
						tr.forEach(function(row) {
							$uk.addClass($uk.$$("td", row)[cellIndex], clsActive);
						});

						var rows, x, y, shouldSwitch;
						var switching = true;
						while(switching) {

							switching = false;
							rows = table.rows;

							for(i = 1; i < (rows.length - 1); i++) {
								shouldSwitch = false;
								x = $uk.$$("td", rows[i])[cellIndex].innerHTML;
								y = $uk.$$("td", rows[i + 1])[cellIndex].innerHTML;
								if(cellIndex) {
									x = parseFloat(x.replace(/,/g, ""));
									y = parseFloat(y.replace(/,/g, ""));
								} else {
									x = x.toLowerCase();
									y = y.toLowerCase();
								}
								if(desc ? x > y : x < y) {
									shouldSwitch = true;
									break;
								}
							}
							if(shouldSwitch) {
								rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
								switching = true;
							}
						}
					});

					$uk.trigger($uk.$$("thead tr th span", table)[8], "click");
				}

			}, function(e) {
				if(this$1.tries) {
					date.setDate(date.getDate() - 1);
					this$1.get(date);
				} else {
					this$1.error(e);
				}
			}
		);
	},

	/**
	 * Join an array with an HTML tag
	 *
	 * @param {Array} array
	 * @param {string} tag
	 * @return {string}
	 *
	 */
	join: function(array, tag) {
		return "<" + tag + ">" + array.join("</" + tag + "><" + tag + ">") + "</" + tag + ">";
	},

	/**
	 * todo
	 *
	 * @param {Array} row
	 * @param {string} [name]
	 * @return {Array}
	 *
	 */
	td: function(row, name) {
		if(name == void 0) name = row[3];
		var td = [name];
		var country;
		var countries = this.countries;
		for(i = 0; i < countries.length; i++) {
			country = countries[i];
			if((country.name == name || country.nativeName == name) && country.gini) {
				td.push(country.population);
				td.push(country.area);
				td.push((country.population / country.area).toFixed(2));
				td.push(country.gini);
				break;
			}
		}

		if(td.length > 1) {
			for(var i = 7; i < 11; i++) {
				td.push(row[i]);
			}
			return td;
		}
		return null;
	},

	/**
	 * Return todo
	 *
	 * @param {Array} array
	 * @param {string} tag
	 * @return {string}
	 *
	 */
	th: function(label, source, title) {
		return "<span" + (title ? " title='" + title + "'"  : "") + ">" + label + (source ? "<sup>" + source + "</sup>" : "") + "</span>";
	}
};

$uk.ready(function() {
	app.init();
});
