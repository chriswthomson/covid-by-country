/**
 * COVID-19 Statistics by Country
 *
 * @version 1.0.0
 * @author Chris Thomson
 *
 * @todo Improve error handling
 * @todo Filter by Continent
 * @todo Per Million compensated by Density
 *
 */

var $uk = UIkit.util;
var app = {

	_init: false,
	countries: {},
	minPopulation: 100000,
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

					// Create a record for each country
					var countries = {};
					var lastUpdated = "";
					data.forEach(function(row) {
						var name = row[3];
						if(name) {
							name = name.replace("*", ""); // Taiwan name fix
							if(!(name in countries)) countries[name] = [0, 0];
							for(var i = 0; i < 2; i++) { // Cases, Deaths
								countries[name][i] = parseInt(countries[name][i]) + parseInt(row[i + 7]);
							}
							if(row[4]) lastUpdated = row[4];
						}
					});

					// Create the table rows
					var rows = [];
					for(var name in countries) {

						var stats = countries[name];
						if(name == "US") name = "United States"; // US fix
						var row = [name];
						var country;

						// Find the country data
						for(i = 0; i < this$1.countries.length; i++) {
							country = this$1.countries[i];
							if(country.name == name || country.nativeName == name) {
								row.push(country.population);
								row.push(country.area);
								row.push((country.population / country.area).toFixed(2));
								break;
							}
						}

						if(row.length > 1) {
							for(var i = 0; i < 2; i++) {
								row.push(stats[i]);
							}
							rows.push(row);
						} else {
							console.log(name, stats)
						}
					}

					var values = { // Holds all the values for calculating means
						4: [],
						5: [],
						7: [],
						8: [],
						9: [],
					};
					var tr = [];
					var population, area, density, cases, casesPerMil, casesPerKm, deaths, deathsPerMil, deathsPerKm, cfr;
					rows.forEach(function(row) {

						population = row[1];
						area = row[2];
						density = row[3];
						cases = parseInt(row[4]);
						deaths = parseInt(row[5]);

						if(deaths && population > this$1.minPopulation) {

							casesPerMil = (cases / population) * 1000000;
							casesPerKm = cases / area;
							//cases_pd = cases / density;//((density / casesPerKm) * casesPerMil) / 1000;
							deathsPerMil = (deaths / population) * 1000000;
							deathsPerKm = deaths / area;
							//deaths_pd = deaths / density; //((density / deathsPerKm) * deathsPerMil) / 1000;
							cfr = (deaths / cases) * 100;

							values[4].push(casesPerMil);
							values[5].push(casesPerKm);
							values[7].push(deathsPerMil);
							values[8].push(deathsPerKm);
							values[9].push(cfr);

							tr.push(this$1.join([
								row[0],
								this$1.formatNumber(population),
								this$1.formatNumber(density),
								this$1.formatNumber(cases),
								casesPerMil.toFixed(2),
								casesPerKm.toFixed(4),
								//cases_pd.toFixed(2),
								this$1.formatNumber(deaths),
								deathsPerMil.toFixed(2),
								deathsPerKm.toFixed(4),
								//deaths_pd.toFixed(2),
								cfr.toFixed(2),
							], "td"));
						}
					});

					// Labels
					var perKm = "per km<sup>2</sup>";
					var perMil = "per Mil.";
					var perMillion = "per Million";

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
									this$1.th("Density", 1, "Population " + perKm),
									this$1.th("Cases", 2, "Confirmed cases"),
									this$1.th(perMil, 0, "Confirmed cases " + perMillion),
									this$1.th(perKm, 0, "Confirmed cases " + perKm),
									//this$1.th("Density", 0, "Density Factor. " + seeFormulas),
									this$1.th("Deaths", 2),
									this$1.th(perMil, 0, "Deaths " + perMillion),
									this$1.th(perKm, 0, "Deaths " + perKm),
									//this$1.th("Density", 0, "Density Factor. " + seeFormulas),
									this$1.th("CFR", 0, "Case Fatality Rate (%)"),
								], "th") + "</tr></thead>" +
								"<tbody>" + this$1.join(tr, "tr") + "</tbody>" +
							"</table>" +
							//"<div id='table-end'></div>" +
						"</div>" +
						"<div class='uk-margin-medium-top uk-margin-medium-bottom'>" +
							"<div>" +
								"<h5>Sources</h5>" +
								"<ol>" + this$1.join(sources, "li") + "</ol>" +
							"</div>" +
							"<div>" +
								"<h5>Notes</h5>" +
								"<ul>" + this$1.join([
									"Click on a header to sort by that stastic. Click again to change the sort direction.",
									"The data is provided by Johns Hopkins University, who use it for their " +
										this$1.link("https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6", "COVID-19 Dashboard") + ".",
									"Only countries with recorded deaths and populations above " + this$1.formatNumber(this$1.minPopulation) + " are displayed.",
									"The population statistics from restcountries.eu seem out-of-date to me. I wasn't able to verify where they are getting the data from, but I assume it is from the last available census for each country.",
									"I'm a web developer, not a statistician. If you have any feedback, " +
										this$1.link("https://github.com/chriswthomson/covid-by-country/issues", "come you") + "!",
								], "li") + "</ul>" +
							"</div>" +
							"<div>" +
								"<h5>Key</h5>" +
								"<em>The value is:</em>" +
								"<ul>" + this$1.join([
									"<span class='uk-text-danger'>Greater than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-warning'>Lower than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-default'>Greater than the midpoint between the mean and the lowest value.</span>",
									"<span class='uk-text-success'>Lower than the midpoint between the mean and the lowest value.</span>",
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

						if(this$1._init) {
							UIkit.notification({
								message: "Sorting <span data-uk-spinner></span>",
								pos: "bottom-left",
								status: "primary",
								timeout: 1024
							});
						}

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
					$uk.trigger($uk.$$("thead tr th span", table)[7], "click");
					this$1._init = true;

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
