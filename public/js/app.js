/**
 * COVID-19 Statistics by Country
 *
 * @version 1.0.0
 * @author Chris Thomson
 *
 * @todo Improve error handling
 * @todo Improve mobile display (can countries be fixed to left?)
 * @todo Per Million compensated by Gini
 * @todo Per Million compensated by Density
 * @todo Combination of both compensations
 * @todo Death Rate
 *
 */

var $uk = UIkit.util;
var app = {

	countries: {},
	sources: ["https://restcountries.eu/rest/v2/all"],
	tries: 2,

	/**
	 * Get Country Data from restcountries.eu
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
	 * Format a number
	 *
	 * @param {number} number
	 *
	 */
	formatNumber: function(number) {
		return (new Intl.NumberFormat()).format(number);
	},

	/**
	 * Get COVID-19 data from Github
	 *
	 * @param {string} [date]
	 *
	 */
	get: function(date) {

		if(date === void 0) date = "";
		if(!(date instanceof Date)) date = date ? new Date(date) : new Date();

		this.tries--; // Decrement tries
		this.sources[1] = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
			date.toLocaleDateString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric"
			}).replace(/\//g, "-") +
		".csv";

		var this$1 = this;
		return $uk.ajax(this.sources[1]).then(
			function(xhr) {

				if(xhr.status == 200) {

					// Parse CSV data
					var str = xhr.response;
					var delimiter = ",";
					var re = new RegExp(
						(

							"(\\" + delimiter + "|\\r?\\n|\\r|^)" + // Delimiters
							"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + // Quoted fields
							"([^\"\\" + delimiter + "\\r\\n]*))" // Standard fields
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

					// Create table rows
					var rows = [];
					var lastUpdated = "";
					var calc = { // These countries need to be calculated from counties/states
						"Australia": [0, 0, 0, 0],
						"Canada": [0, 0, 0, 0],
						"China": [0, 0, 0, 0],
						"United States": [0, 0, 0, 0]
					};
					data.forEach(function(row) {
						var name = row[3];
						if(!row[0] && !row[1] && !row[2]) {
							var td = this$1.getRow(row);
							if(td) rows.push(td);
						} else if(name in calc) {
							for(var i = 0; i < 4; i++) {
								calc[name][i] = parseInt(calc[name][i]) + parseInt(row[i + 7]);
							}
						} else if(name == "US" && row[1] !== "Unassigned") {
							for(var i = 0; i < 4; i++) {
								calc["United States"][i] = parseInt(calc["United States"][i]) + parseInt(row[i + 7]);
							}
						}
						if(row[4]) lastUpdated = row[4];
					});

					// Create table rows for calculated data
					for(var name in calc) {
						rows.push(this$1.getRow(["", "", "", name, "", "", ""].concat(calc[name])));
					}

					var values = { // Holds all values for calculating mean
						6: [],
						7: [],
						9: [],
						10: [],
						11: [],
						//8: [],
						//9: [],
						//11: [],
						//12: [],
						//13: [],
						//14: [],
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

						if(deaths) { // Only countries with deaths are displayed

							cases_pm = (cases / population) * 1000000;
							cases_pk = cases / area;
							cases_pg = (gini * cases_pm) / 1000;
							cases_pd = cases / density;//((density / cases_pk) * cases_pm) / 1000;
							deaths_pm = (deaths / population) * 1000000;
							deaths_pk = deaths / area;
							deaths_pg = (gini * deaths_pm) / 1000;
							deaths_pd = deaths / density; //((density / deaths_pk) * deaths_pm) / 1000;
							cfr = (deaths / cases) * 100;

							values[6].push(cases_pm);
							values[7].push(cases_pk);
							//values[8].push(cases_pg);
							//values[9].push(cases_pd);
							values[9].push(deaths_pm);
							values[10].push(deaths_pk);
							//values[13].push(deaths_pg);
							//values[14].push(deaths_pd);
							values[11].push(cfr);

							tr.push(this$1.join([
								row[0],
								this$1.formatNumber(population),
								this$1.formatNumber(area),
								this$1.formatNumber(density),
								gini,
								this$1.formatNumber(cases),
								cases_pm.toFixed(2),
								cases_pk.toFixed(4),
								//cases_pg.toFixed(2),
								//cases_pd.toFixed(2),
								this$1.formatNumber(deaths),
								deaths_pm.toFixed(2),
								deaths_pk.toFixed(4),
								//deaths_pg.toFixed(2),
								//deaths_pd.toFixed(2),
								cfr.toFixed(2),
								//this$1.formatNumber(row[7]),
								//this$1.formatNumber(row[8]),
							], "td"));
						}
					});

					// Labels
					var perKm = "per km<sup>2</sup>";
					var perMil = "per Mil.";
					var perMillion = "per Million";
					var seeFormulas = "See <strong>Formulas</strong> for more information.";

					// Sources
					var sources = [];
					var url;
					for(var i = 0; i < this$1.sources.length; i++) {
						url = this$1.sources[i];
						sources.push(this$1.link(url));
					}

					// Display the table
					this$1.display(
						"<div class='uk-overflow-auto'>" +
							"<table id='table' class='uk-table uk-table-small uk-table-divider uk-table-justify'>" +
								"<thead><tr>" + this$1.join([
									"Country",
									this$1.th("Population", 1),
									this$1.th("Area", 1, perKm),
									this$1.th("Density", 1, "Population " + perKm),
									this$1.th(
										"Gini",
										1,
										"The Gini coefficient is a commonly-used measure of income inequality " +
										"that condenses the entire income distribution for a country into a single number " +
										"between 0 and 1: the higher the number, the greater the degree of income inequality."
									),
									this$1.th("Cases", 2, "Confirmed cases"),
									this$1.th(perMil, 0, "Confirmed cases " + perMillion),
									this$1.th(perKm, 0, "Confirmed cases " + perKm),
									//this$1.th("Gini", 0, "Gini Factor. " + seeFormulas),
									//this$1.th("Density", 0, "Density Factor. " + seeFormulas),
									this$1.th("Deaths", 2),
									this$1.th(perMil, 0, "Deaths " + perMillion),
									this$1.th(perKm, 0, "Deaths " + perKm),
									//this$1.th("Gini", 0, "Gini Factor. " + seeFormulas),
									//this$1.th("Density", 0, "Density Factor. " + seeFormulas),
									//this$1.th("Recovered", 2),
									//this$1.th("Active", 2),
									this$1.th("CFR", 0, "Case Fatality Rate (%)"),
								], "th") + "</tr></thead>" +
								"<tbody>" + this$1.join(tr, "tr") + "</tbody>" +
							"</table>" +
							"<div id='table-end'></div>" +
						"</div>" +
						"<div class='uk-margin-medium-top uk-margin-medium-bottom'>" +
							"<div>" +
								"<h5>Sources</h5>" +
								"<ol>" + this$1.join(sources, "li") + "</ol>" +
							"</div>" +
							/*"<div>" +
								"<h5>Forumlas</h5>" +
								"<ul>" + this$1.join([
									"<strong>Density</strong>: Population / Area",
									"<strong>per Million</strong>: ([Cases|Deaths] / Population) * 1,000,000",
									"<strong>per km<sup>2</sup></strong>: [Cases|Deaths] / Area",
									//"<strong>Gini Factor</strong>: (Gini coefficient * [Cases|Deaths] per Million) / 1000",
									//"<strong>Density Factor</strong>: ((Density / [Cases|Deaths] per km<sup>2</sup>) * [Cases|Deaths] per Million) / 1000",
								], "li") + "</ul>" +
							"</div>" +*/
							"<div>" +
								"<h5>Notes</h5>" +
								"<ul>" + this$1.join([
									"The data is provided by John Hopkins, but seems to be behind their " +
										this$1.link("https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6", "COVID-19 Dashboard") + " by a day at most.",
									"For Australia, Canada, China and the United States, statistics need to be calculated from county/state data and therefore may not be exact.",
									"Only countries with recorded deaths are displayed.",
									"The population statistics from restcountries.eu seems out-of-date to me. I wasn't able to verify where they are getting the data from, but I assume it is from the last available census for each country.",
									//"The <strong>Gini Factor</strong> allows and is caluclated by ",
									"I'm a web developer, not a statistician. If you have any feedback, please " +
										this$1.link("https://github.com/chriswthomson/covid-by-country/issues", "let me know") + "!",
								], "li") + "</ul>" +
							"</div>" +
							"<div>" +
								"<h5>Key</h5>" +
								"<ul>" + this$1.join([
									"<span class='uk-text-danger'>The value is greater than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-warning'>The value is lower than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-default'>The value is greater than the midpoint between the mean and the lowest value.</span>",
									"<span class='uk-text-success'>The value is lower than the midpoint between the mean and the lowest value.</span>",
								], "li") + "</ul>" +
							"</div>" +
							"<div class='uk-text-meta'>Last Updated: " + lastUpdated + " (UTC)</div>" +
						"</div>"
					);

					var table = $uk.$("#table");
					var tr = $uk.$$("tbody tr", table);

					// Colour cells by proximity to mean values
					for(var i in values) {
						var a = values[i];
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

					// When a heading is clicked, sort the table
					$uk.on(table, "click", "th span", function(e) {

						var th = e.target.parentElement;
						var cellIndex = th.cellIndex;
						var clsActive = "uk-active";
						var desc = $uk.hasClass(th, "desc");

						// Toggle classes
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

					// Sort by deaths (desc) by default
					//$uk.trigger($uk.$$("thead tr th span", table)[9], "click");

					// Make <thead> sticky
					// @todo Cannot get this to work
					/*UIkit.sticky($uk.$("thead", table), {
						bottom: "#table-end",
						media: 960,
						widthElement: "#table"
					});*/

				} else {
					this$1.error("Error");
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
	 * Get a row of country data
	 *
	 * @param {Array} row
	 * @param {string} [name]
	 * @return {Array}
	 *
	 */
	getRow: function(row, name) {

		if(name === void 0) name = row[3];

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
	 * Render a link
	 *
	 * @param {string} url
	 * @param {string} [title]
	 * @return {string}
	 *
	 */
	link: function(url, title) {
		if(title === void 0) title = url;
		return "<a href='" + url + "' target='_blank' rel='noopener'>" + title + "</a>";
	},

	/**
	 * Render a table heading
	 *
	 * @param {Array} array
	 * @param {string} tag
	 * @return {string}
	 *
	 */
	th: function(label, source, title) {
		return "<span" + (title ? " data-uk-tooltip='" + JSON.stringify({
			title: title,
			mode: "hover"
		}) + "'"  : "") + ">" +
			label + (source ? "<sup class='source'>" + source + "</sup>" : "") +
		"</span>";
	}
};

$uk.ready(function() {
	app.init();
});
