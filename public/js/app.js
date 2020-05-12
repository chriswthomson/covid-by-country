/**
 * COVID-19 Statistics by Country
 *
 * @version 1.0.3
 * @author Chris Thomson
 *
 * @todo Improve error messages
 * @todo Filter by Continent
 * @todo Export data as CSV?
 *
 */

var $uk = UIkit.util;
var app = {

	countries: {},
	minPopulation: 100000,
	regions: ["All"],
	sources: ["https://restcountries.eu/rest/v2/all", ""],
	//"https://en.wikipedia.org/wiki/List_of_countries_ranked_by_ethnic_and_cultural_diversity_level#List_based_on_Alesina_et_al's_analysis"
	tries: 3,

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
						var countries = JSON.parse(xhr.response);
						var data = JSON.parse('{"Afghanistan":{"ethnic":0.7693,"linguistic":0.6141,"religious":0.2717},"Albania":{"ethnic":0.2204,"linguistic":0.0399,"religious":0.4719},"Algeria":{"ethnic":0.3394,"linguistic":0.4427,"religious":0.0091},"American Samoa":{"ethnic":0,"linguistic":0.1733,"religious":0.6395},"Andorra":{"ethnic":0.7139,"linguistic":0.6848,"religious":0.2326},"Angola":{"ethnic":0.7867,"linguistic":0.787,"religious":0.6276},"Antigua and Barbuda":{"ethnic":0.1643,"linguistic":0.1063,"religious":0.684},"Argentina":{"ethnic":0.255,"linguistic":0.0618,"religious":0.2236},"Armenia":{"ethnic":0.1272,"linguistic":0.1291,"religious":0.4576},"Aruba":{"ethnic":0,"linguistic":0.3889,"religious":0.4107},"Australia":{"ethnic":0.0929,"linguistic":0.3349,"religious":0.8211},"Austria":{"ethnic":0.1068,"linguistic":0.1522,"religious":0.4146},"Azerbaijan":{"ethnic":0.2047,"linguistic":0.2054,"religious":0.4899},"Bahamas":{"ethnic":0.4228,"linguistic":0.1855,"religious":0.6815},"Bahrain":{"ethnic":0.5021,"linguistic":0.4344,"religious":0.5528},"Bangladesh":{"ethnic":0.0454,"linguistic":0.0925,"religious":0.209},"Barbados":{"ethnic":0.1423,"linguistic":0.0926,"religious":0.6934},"Belarus":{"ethnic":0.3222,"linguistic":0.4666,"religious":0.6116},"Belgium":{"ethnic":0.5554,"linguistic":0.5409,"religious":0.2127},"Belize":{"ethnic":0.7015,"linguistic":0.6303,"religious":0.5813},"Benin":{"ethnic":0.7872,"linguistic":0.7905,"religious":0.5544},"Bermuda":{"ethnic":0,"linguistic":0,"religious":0.7112},"Bhutan":{"ethnic":0.605,"linguistic":0.6056,"religious":0.3787},"Bolivia":{"ethnic":0.7396,"linguistic":0.224,"religious":0.2085},"Bosnia and Herzegovina":{"ethnic":0.63,"linguistic":0.6751,"religious":0.6851},"Botswana":{"ethnic":0.4102,"linguistic":0.411,"religious":0.5986},"Brazil":{"ethnic":0.5408,"linguistic":0.0468,"religious":0.6054},"Brunei Darussalam":{"ethnic":0.5416,"linguistic":0.3438,"religious":0.4404},"Bulgaria":{"ethnic":0.4021,"linguistic":0.3031,"religious":0.5965},"Burkina Faso":{"ethnic":0.7377,"linguistic":0.7228,"religious":0.5798},"Burundi":{"ethnic":0.2951,"linguistic":0.2977,"religious":0.5158},"Cambodia":{"ethnic":0.2105,"linguistic":0.2104,"religious":0.0965},"Cameroon":{"ethnic":0.8635,"linguistic":0.8898,"religious":0.7338},"Canada":{"ethnic":0.7124,"linguistic":0.5772,"religious":0.6958},"Cabo Verde":{"ethnic":0.4174,"linguistic":0,"religious":0.0766},"Central African Republic":{"ethnic":0.8295,"linguistic":0.8334,"religious":0.7916},"Chad":{"ethnic":0.862,"linguistic":0.8635,"religious":0.6411},"Chile":{"ethnic":0.1861,"linguistic":0.1871,"religious":0.3841},"China":{"ethnic":0.1538,"linguistic":0.1327,"religious":0.6643},"Colombia":{"ethnic":0.6014,"linguistic":0.0193,"religious":0.1478},"Comoros":{"ethnic":0,"linguistic":0.0103,"religious":0.0137},"Congo (Democratic Republic of the)":{"ethnic":0.8747,"linguistic":0.8705,"religious":0.7021},"Congo":{"ethnic":0.8747,"linguistic":0.6871,"religious":0.6642},"Costa Rica":{"ethnic":0.2368,"linguistic":0.0489,"religious":0.241},"Côte d\'Ivoire":{"ethnic":0.8204,"linguistic":0.7842,"religious":0.7551},"Croatia":{"ethnic":0.369,"linguistic":0.0763,"religious":0.4447},"Cuba":{"ethnic":0.5908,"linguistic":0,"religious":0.5059},"Cyprus":{"ethnic":0.0939,"linguistic":0.3962,"religious":0.3962},"Czech Republic":{"ethnic":0.3222,"linguistic":0.3233,"religious":0.6591},"Denmark":{"ethnic":0.0819,"linguistic":0.1049,"religious":0.2333},"Djibouti":{"ethnic":0.7962,"linguistic":0.6558,"religious":0.0435},"Dominica":{"ethnic":0.2003,"linguistic":0,"religious":0.4628},"Dominican Republic":{"ethnic":0.4294,"linguistic":0.0395,"religious":0.3118},"Timor-Leste":{"ethnic":0,"linguistic":0.5261,"religious":0.4254},"Ecuador":{"ethnic":0.655,"linguistic":0.1308,"religious":0.1417},"Egypt":{"ethnic":0.1836,"linguistic":0.0237,"religious":0.1979},"El Salvador":{"ethnic":0.1978,"linguistic":0,"religious":0.3559},"Equatorial Guinea":{"ethnic":0.3467,"linguistic":0.322,"religious":0.1195},"Eritrea":{"ethnic":0.6524,"linguistic":0.653,"religious":0.4253},"Estonia":{"ethnic":0.5062,"linguistic":0.4944,"religious":0.4985},"Ethiopia":{"ethnic":0.7235,"linguistic":0.8073,"religious":0.6249},"Faroe Islands":{"ethnic":0,"linguistic":0,"religious":0.3147},"Fiji":{"ethnic":0.5479,"linguistic":0.5479,"religious":0.5682},"Finland":{"ethnic":0.1315,"linguistic":0.1412,"religious":0.2531},"France":{"ethnic":0.1032,"linguistic":0.1221,"religious":0.4029},"French Guiana":{"ethnic":0,"linguistic":0.1154,"religious":0.4959},"French Polynesia":{"ethnic":0,"linguistic":0.6078,"religious":0.5813},"Gabon":{"ethnic":0.769,"linguistic":0.7821,"religious":0.6674},"Gambia":{"ethnic":0.7864,"linguistic":0.8076,"religious":0.097},"Gaza Strip":{"ethnic":0,"linguistic":0.0104,"religious":0.0342},"Georgia":{"ethnic":0.4923,"linguistic":0.4749,"religious":0.6543},"Germany":{"ethnic":0.1682,"linguistic":0.1642,"religious":0.6571},"Ghana":{"ethnic":0.6733,"linguistic":0.6731,"religious":0.7987},"Greece":{"ethnic":0.1576,"linguistic":0.03,"religious":0.153},"Greenland":{"ethnic":0,"linguistic":0.2188,"religious":0.4592},"Grenada":{"ethnic":0.2661,"linguistic":0,"religious":0.5898},"Guadeloupe":{"ethnic":0,"linguistic":0.0933,"religious":0.3069},"Guam":{"ethnic":0,"linguistic":0.732,"religious":0.4082},"Guatemala":{"ethnic":0.5122,"linguistic":0.4586,"religious":0.3753},"Guinea":{"ethnic":0.7389,"linguistic":0.7725,"religious":0.2649},"Guinea-Bissau":{"ethnic":0.8082,"linguistic":0.8141,"religious":0.6128},"Guyana":{"ethnic":0.6195,"linguistic":0.0688,"religious":0.7876},"Haiti":{"ethnic":0.095,"linguistic":0,"religious":0.4704},"Honduras":{"ethnic":0.1867,"linguistic":0.0553,"religious":0.2357},"Hong Kong":{"ethnic":0.062,"linguistic":0.2128,"religious":0.4191},"Hungary":{"ethnic":0.1522,"linguistic":0.0297,"religious":0.5244},"Iceland":{"ethnic":0.0798,"linguistic":0.082,"religious":0.1913},"India":{"ethnic":0.4182,"linguistic":0.8069,"religious":0.326},"Indonesia":{"ethnic":0.7351,"linguistic":0.768,"religious":0.234},"Iran (Islamic Republic of)":{"ethnic":0.6684,"linguistic":0.7462,"religious":0.1152},"Iraq":{"ethnic":0.3689,"linguistic":0.3694,"religious":0.4844},"Ireland":{"ethnic":0.1206,"linguistic":0.0312,"religious":0.155},"Isle of Man":{"ethnic":0,"linguistic":0,"religious":0.4729},"Israel":{"ethnic":0.3436,"linguistic":0.5525,"religious":0.3469},"Italy":{"ethnic":0.1145,"linguistic":0.1147,"religious":0.3027},"Jamaica":{"ethnic":0.4129,"linguistic":0.1098,"religious":0.616},"Japan":{"ethnic":0.0119,"linguistic":0.0178,"religious":0.5406},"Jersey":{"ethnic":0,"linguistic":0,"religious":0.5479},"Jordan":{"ethnic":0.5926,"linguistic":0.0396,"religious":0.0659},"Kazakhstan":{"ethnic":0.6171,"linguistic":0.6621,"religious":0.5898},"Kenya":{"ethnic":0.8588,"linguistic":0.886,"religious":0.7765},"Kiribati":{"ethnic":0.0511,"linguistic":0.0237,"religious":0.5541},"Korea (Republic of)":{"ethnic":0.0392,"linguistic":0.0028,"religious":0.4891},"Korea (Democratic People\'s Republic of)":{"ethnic":0.002,"linguistic":0.0021,"religious":0.6604},"Kyrgyzstan":{"ethnic":0.6752,"linguistic":0.5949,"religious":0.447},"Kuwait":{"ethnic":0.6604,"linguistic":0.3444,"religious":0.6745},"Lao People\'s Democratic Republic":{"ethnic":0.5139,"linguistic":0.6382,"religious":0.5453},"Latvia":{"ethnic":0.5867,"linguistic":0.5795,"religious":0.5556},"Lebanon":{"ethnic":0.1314,"linguistic":0.1312,"religious":0.7886},"Lesotho":{"ethnic":0.255,"linguistic":0.2543,"religious":0.7211},"Liberia":{"ethnic":0.9084,"linguistic":0.9038,"religious":0.4883},"Libya":{"ethnic":0.792,"linguistic":0.0758,"religious":0.057},"Liechtenstein":{"ethnic":0.5726,"linguistic":0.2246,"religious":0.3343},"Lithuania":{"ethnic":0.3223,"linguistic":0.3219,"religious":0.4141},"Luxembourg":{"ethnic":0.5302,"linguistic":0.644,"religious":0.0911},"Macau":{"ethnic":0,"linguistic":0.2519,"religious":0.5511},"Macedonia (the former Yugoslav Republic of)":{"ethnic":0.5023,"linguistic":0.5021,"religious":0.5899},"Madagascar":{"ethnic":0.8791,"linguistic":0.0204,"religious":0.5191},"Malawi":{"ethnic":0.6744,"linguistic":0.6023,"religious":0.8192},"Malaysia":{"ethnic":0.588,"linguistic":0.597,"religious":0.6657},"Mali":{"ethnic":0.6906,"linguistic":0.8388,"religious":0.182},"Malta":{"ethnic":0.0414,"linguistic":0.0907,"religious":0.1223},"Marshall Islands":{"ethnic":0.0603,"linguistic":0.0734,"religious":0.5207},"Martinique":{"ethnic":0,"linguistic":0,"religious":0.2336},"Mauritania":{"ethnic":0.615,"linguistic":0.326,"religious":0.0149},"Mauritius":{"ethnic":0.4634,"linguistic":0.4547,"religious":0.6385},"Mayotte":{"ethnic":0,"linguistic":0.7212,"religious":0.062},"Mexico":{"ethnic":0.5418,"linguistic":0.1511,"religious":0.1796},"F.S. Micronesia":{"ethnic":0.7005,"linguistic":0.7483,"religious":0.6469},"Moldova":{"ethnic":0.5535,"linguistic":0.5533,"religious":0.5603},"Monaco":{"ethnic":0.6838,"linguistic":0.7305,"religious":0.3047},"Mongolia":{"ethnic":0.3682,"linguistic":0.3734,"religious":0.0799},"Morocco":{"ethnic":0.4841,"linguistic":0.4683,"religious":0.0035},"Mozambique":{"ethnic":0.6932,"linguistic":0.8125,"religious":0.6759},"Myanmar":{"ethnic":0.5062,"linguistic":0.5072,"religious":0.1974},"Namibia":{"ethnic":0.6329,"linguistic":0.7005,"religious":0.6626},"Nauru":{"ethnic":0.5832,"linguistic":0.6161,"religious":0.6194},"Nepal":{"ethnic":0.6632,"linguistic":0.7167,"religious":0.1417},"Netherlands Antilles":{"ethnic":0,"linguistic":0.2508,"religious":0.3866},"Netherlands":{"ethnic":0.1054,"linguistic":0.5143,"religious":0.7222},"New Caledonia":{"ethnic":0,"linguistic":0.6633,"religious":0.5462},"New Zealand":{"ethnic":0.3969,"linguistic":0.1657,"religious":0.811},"Nicaragua":{"ethnic":0.4844,"linguistic":0.0473,"religious":0.429},"Niger":{"ethnic":0.6518,"linguistic":0.6519,"religious":0.2013},"Nigeria":{"ethnic":0.8505,"linguistic":0.8316,"religious":0.7421},"Northern Mariana Islands":{"ethnic":0,"linguistic":0.7754,"religious":0.4811},"Norway":{"ethnic":0.0586,"linguistic":0.0673,"religious":0.2048},"Oman":{"ethnic":0.4373,"linguistic":0.3567,"religious":0.4322},"Pakistan":{"ethnic":0.7098,"linguistic":0.719,"religious":0.3848},"Palau":{"ethnic":0.4312,"linguistic":0.3157,"religious":0.7147},"Panama":{"ethnic":0.5528,"linguistic":0.3873,"religious":0.3338},"Papua New Guinea":{"ethnic":0.2718,"linguistic":0.3526,"religious":0.5523},"Paraguay":{"ethnic":0.1689,"linguistic":0.5975,"religious":0.2123},"Peru":{"ethnic":0.6566,"linguistic":0.3358,"religious":0.1988},"Philippines":{"ethnic":0.2385,"linguistic":0.836,"religious":0.3056},"Poland":{"ethnic":0.1183,"linguistic":0.0468,"religious":0.1712},"Portugal":{"ethnic":0.0468,"linguistic":0.0198,"religious":0.1438},"Puerto Rico":{"ethnic":0,"linguistic":0.0352,"religious":0.4952},"Qatar":{"ethnic":0.7456,"linguistic":0.48,"religious":0.095},"Réunion":{"ethnic":0,"linguistic":0.1578,"religious":0.1952},"Romania":{"ethnic":0.3069,"linguistic":0.1723,"religious":0.2373},"Russian Federation":{"ethnic":0.2452,"linguistic":0.2485,"religious":0.4398},"Rwanda":{"ethnic":0.3238,"linguistic":0,"religious":0.5066},"Saint Lucia":{"ethnic":0.1769,"linguistic":0.3169,"religious":0.332},"Saint Vincent and the Grenadines":{"ethnic":0.3066,"linguistic":0.0175,"religious":0.7028},"Samoa":{"ethnic":0.1376,"linguistic":0.0111,"religious":0.7871},"San Marino":{"ethnic":0.2927,"linguistic":0,"religious":0.1975},"Sao Tome and Principe":{"ethnic":0,"linguistic":0.2322,"religious":0.1866},"Saudi Arabia":{"ethnic":0.18,"linguistic":0.0949,"religious":0.127},"Senegal":{"ethnic":0.6939,"linguistic":0.7081,"religious":0.1497},"Serbia":{"ethnic":0.5736,"linguistic":0,"religious":0},"Seychelles":{"ethnic":0.2025,"linguistic":0.1606,"religious":0.2323},"Sierra Leone":{"ethnic":0.8191,"linguistic":0.7634,"religious":0.5395},"Singapore":{"ethnic":0.3857,"linguistic":0.3835,"religious":0.6561},"Slovakia":{"ethnic":0.2539,"linguistic":0.2551,"religious":0.5655},"Slovenia":{"ethnic":0.2216,"linguistic":0.2201,"religious":0.2868},"Solomon Islands":{"ethnic":0.111,"linguistic":0.5254,"religious":0.6708},"Somalia":{"ethnic":0.8117,"linguistic":0.0326,"religious":0.0028},"South Africa":{"ethnic":0.7517,"linguistic":0.8652,"religious":0.8603},"Spain":{"ethnic":0.4165,"linguistic":0.4132,"religious":0.4514},"Sri Lanka":{"ethnic":0.415,"linguistic":0.4645,"religious":0.4853},"Saint Kitts and Nevis":{"ethnic":0.1842,"linguistic":0,"religious":0.6614},"Sudan":{"ethnic":0.7147,"linguistic":0.719,"religious":0.4307},"Suriname":{"ethnic":0.7332,"linguistic":0.331,"religious":0.791},"Swaziland":{"ethnic":0.0582,"linguistic":0.1722,"religious":0.4444},"Sweden":{"ethnic":0.06,"linguistic":0.1968,"religious":0.2342},"Switzerland":{"ethnic":0.5314,"linguistic":0.5441,"religious":0.6083},"Syrian Arab Republic":{"ethnic":0.5399,"linguistic":0.1817,"religious":0.431},"Taiwan":{"ethnic":0.2744,"linguistic":0.5028,"religious":0.6845},"Tajikistan":{"ethnic":0.5107,"linguistic":0.5473,"religious":0.3386},"Tanzania":{"ethnic":0.7353,"linguistic":0.8983,"religious":0.6334},"Thailand":{"ethnic":0.6338,"linguistic":0.6344,"religious":0.0994},"Togo":{"ethnic":0.7099,"linguistic":0.898,"religious":0.6596},"Tonga":{"ethnic":0.0869,"linguistic":0.3782,"religious":0.6214},"Trinidad and Tobago":{"ethnic":0.6475,"linguistic":0.1251,"religious":0.7936},"Tunisia":{"ethnic":0.0394,"linguistic":0.0124,"religious":0.0104},"Turkey":{"ethnic":0.32,"linguistic":0.2216,"religious":0.0049},"Turkmenistan":{"ethnic":0.3918,"linguistic":0.3984,"religious":0.2327},"Tuvalu":{"ethnic":0.1629,"linguistic":0.1372,"religious":0.2524},"Uganda":{"ethnic":0.9302,"linguistic":0.9227,"religious":0.6332},"Ukraine":{"ethnic":0.4737,"linguistic":0.4741,"religious":0.6157},"United Arab Emirates":{"ethnic":0.6252,"linguistic":0.4874,"religious":0.331},"United Kingdom":{"ethnic":0.1211,"linguistic":0.0532,"religious":0.6944},"United States":{"ethnic":0.4901,"linguistic":0.5647,"religious":0.8241},"Uruguay":{"ethnic":0.2504,"linguistic":0.0817,"religious":0.3548},"Uzbekistan":{"ethnic":0.4125,"linguistic":0.412,"religious":0.2133},"Vanuatu":{"ethnic":0.0413,"linguistic":0.5794,"religious":0.7044},"Venezuela":{"ethnic":0.4966,"linguistic":0.0686,"religious":0.135},"Viet Nam":{"ethnic":0.2383,"linguistic":0.2377,"religious":0.508},"U.S. Virgin Islands":{"ethnic":0,"linguistic":0.314,"religious":0.6359},"West Bank":{"ethnic":0,"linguistic":0.1438,"religious":0.3095},"Yemen":{"ethnic":0,"linguistic":0.008,"religious":0.0023},"Yugoslavia":{"ethnic":0.8092,"linguistic":0.6064,"religious":0.553},"Zambia":{"ethnic":0.7808,"linguistic":0.8734,"religious":0.7359},"Zimbabwe":{"ethnic":0.3874,"linguistic":0.4472,"religious":0.7363}}');

						var country, name, region;
						for(i = 0; i < countries.length; i++) {
							country = countries[i];
							name = country.name in data ? country.name :
								(country.nativeName in data ? country.nativeName : null);
							if(name) {
								region = country.region;
								this$1.countries[name] = $uk.assign(data[name], {
									population: country.population,
									area: country.area,
									density: (country.population / country.area).toFixed(2),
									region: region
								});
								if(!$uk.includes(this$1.regions, region)) this$1.regions.push(region);
							}
						}

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

						var fixes = {
							"Burma": "Myanmar",
							"Congo (Brazzaville)": "Congo",
							"Congo (Kinshasa)": "Congo (Democratic Republic of the)",
							"Republic of Macedonia": "North Macedonia",
							"Korea, South": "South Korea",
							"US": "United States",
						};
						if(name in fixes) name = fixes[name];

						var row = [name];

						fixes = {
							"Brunei": "Brunei Darussalam",
							"Cote d'Ivoire": "",
							"Czechia": "Czech Republic",
							"Eswatini": "Swaziland",
							"Iran": "Iran (Islamic Republic of)",
							"Kosovo": "Republic of Kosovo",
							"Laos": "Lao People's Democratic Republic",
							"North Macedonia": "Macedonia (the former Yugoslav Republic of)",
							"Russia": "Russian Federation",
							"South Korea": "Korea (Republic of)",
							"Syria": "Syrian Arab Republic",
							"Vietnam": "Viet Nam",
						};
						if(name in fixes) name = fixes[name];

						if(name in this$1.countries) {
							var country = this$1.countries[name];
							row.push(country.region);
							row.push(country.population);
							row.push(country.area);
							row.push(country.density);
							row.push(country.ethnic);
							row.push(country.linguistic);
							row.push(country.religious);
						}

						if(row.length > 2) {
							for(var i = 0; i < 2; i++) {
								row.push(stats[i]);
							}
							rows.push(row);
						}
					}

					var values = { // Holds all the values for calculating means
						5: [],
						6: [],
						8: [],
						9: [],
						10: [],
					};
					var tr = [];
					var population, area, density, ethnic, linguistic, religious,
						cases, casesPerMil, casesPerKm, casesRisk,
						deaths, deathsPerMil, deathsPerKm, deathsRisk,
						cfr, risk, fractionalization;
					rows.forEach(function(row) {

						population = row[2];
						area = row[3];
						density = row[4];
						ethnic = row[5];
						linguistic = row[6];
						religious = row[7];
						cases = parseInt(row[8]);
						deaths = parseInt(row[9]);

						if(deaths && population > this$1.minPopulation) {

							//fractionalization = ethnic;
							casesPerMil = (cases / population) * 1000000;
							casesPerKm = cases / area;
							//casesRisk = Math.log(fractionalization + Math.log(casesPerMil + 1) + casesPerKm);
							//casesRisk = Math.round((cases * (fractionalization + Math.log(casesPerKm + 1))) + cases);
							deathsPerMil = (deaths / population) * 1000000;
							deathsPerKm = deaths / area;
							//deathsRisk = Math.log(fractionalization + Math.log(deathsPerMil + 1) + deathsPerKm);
							//deathsRisk = Math.round((deaths * (fractionalization + Math.log(deathsPerKm + 1))) + deaths);
							cfr = (deaths / cases) * 100;
							//risk = Math.log(cfr) + casesRisk + deathsRisk;
							//risk = ((casesPerMil * (fractionalization + Math.log(deathsPerKm + 1))) + casesPerMil) * (cfr / 100);

							values[5].push(casesPerMil);
							values[6].push(casesPerKm);
							//values[10].push(casesRisk);
							values[8].push(deathsPerMil);
							values[9].push(deathsPerKm);
							//values[14].push(deathsRisk);
							values[10].push(cfr);
							//values[16].push(risk);

							tr.push(this$1.join([
								row[0],
								row[1],
								this$1.formatNumber(population),
								this$1.formatNumber(density),
								//(ethnic ? ethnic : "N/A"),
								//(linguistic ? linguistic : "N/A"),
								//(religious ? religious : "N/A"),
								this$1.formatNumber(cases),
								this$1.pc(casesPerMil.toFixed(2), cases, population),
								casesPerKm.toFixed(4),
								//this$1.formatNumber(casesRisk),
								this$1.formatNumber(deaths),
								this$1.pc(deathsPerMil.toFixed(2), deaths, population),
								deathsPerKm.toFixed(4),
								//this$1.formatNumber(deathsRisk),
								cfr.toFixed(2),
								//risk.toFixed(5),
							], "td"));
						}
					});

					// Labels
					var perKm = "per km<sup>2</sup>";
					var perKm2 = "per km2";
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
							"<table id='table' class='uk-table uk-table-small uk-table-divider uk-table-hover'>" +
								"<thead> " +
									"<tr>" +
										"<th></th>" +
										"<th></th>" +
										"<th></th>" +
										"<th></th>" +
										"<th>Cases</th>" +
										"<th></th>" +
										"<th></th>" +
										"<th>Deaths</th>" +
										"<th></th>" +
										"<th></th>" +
										"<th></th>" +
									"</tr>" +
									"<tr>" + this$1.join([
										"Country",
										"Region",
										this$1.th("Population", 1),
										this$1.th(perKm, 1, "Population " + perKm2),
										//this$1.th("Ethnic", 3, "Ethnic Fractionalization Index"),
										//this$1.th("Linguistic", 3, "Linguistic Fractionalization Index"),
										//this$1.th("Religious", 3, "Religious Fractionalization Index"),
										this$1.th("Confirmed", 2, "Confirmed cases"),
										this$1.th(perMil, 0, "Confirmed cases " + perMillion),
										this$1.th(perKm, 0, "Confirmed cases " + perKm2),
										//this$1.th("Risk", 0),
										this$1.th("Confirmed", 2),
										this$1.th(perMil, 0, "Deaths " + perMillion),
										this$1.th(perKm, 0, "Deaths " + perKm2),
										//this$1.th("Risk", 0),
										this$1.th("CFR", 0, "Case Fatality Rate (%)"),
										//this$1.th("Risk", 0),
									], "th") + "</tr>" +
								"</thead>" +
								"<tbody>" + this$1.join(tr, "tr") + "</tbody>" +
							"</table>" +
							//"<div id='table-end'></div>" +
						"</div>" +
						"<div class='uk-margin-medium-top uk-margin-medium-bottom'>" +
							"<div class='uk-margin-medium-bottom'>" +
								"<h5>Sources</h5>" +
								"<ol>" + this$1.join(sources, "li") + "</ol>" +
							"</div>" +
							"<div class='uk-margin-medium-bottom'>" +
								"<h5>Notes</h5>" +
								"<ul>" + this$1.join([
									"Click on a header to sort by that statistic. Click again to change the sort direction.",
									"The COVID-19 data is provided by Johns Hopkins University, who use it for their " +
										this$1.link("https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6", "Dashboard") + ".",
									"Only countries with populations > " + this$1.formatNumber(this$1.minPopulation) + " and recorded deaths are displayed.",
									"The population statistics from restcountries.eu seem out-of-date to me. I wasn't able to verify where they are getting the data from, but I assume it is from the last available census for each country.",
									"I'm a web developer, not a statistician. If you have any feedback, " +
										this$1.link("https://github.com/chriswthomson/covid-by-country/issues", "come you") + "!",
								], "li") + "</ul>" +
							"</div>" +
							"<div class='uk-margin-medium-bottom'>" +
								"<h5>Key</h5>" +
								"<em>If the value is:</em>" +
								"<ul>" + this$1.join([
									"<span class='uk-text-danger'>Greater than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-warning'>Lower than the midpoint between the mean and the highest value.</span>",
									"<span class='uk-text-default'>Greater than the midpoint between the mean and the lowest value.</span>",
									"<span class='uk-text-success'>Lower than the midpoint between the mean and the lowest value.</span>",
								], "li") + "</ul>" +
							"</div>" +
							"<div class='uk-text-meta'>Last Updated: " + lastUpdated + " (UTC)</div>" +
							"<p><em>If it is not obvious after a short review of the data, the point here is that countries cannot be compared effectively.</em></p>",
						"</div>"
					);

					var table = $uk.$("#table");
					var tr = $uk.$$("tbody tr", table);

					// Add class for borders
					$uk.$$("tr", table).forEach(function(row) {
						var td = $uk.$$("td, th", row);
						[
							td[4],
							td[7],
							td[10],
						].forEach(function(cell) {
							$uk.addClass(cell, "border");
						});
					});

					// Colour cells by proximity to mean values
					for(var i in values) {
						var a = values[i];
						for(var n = 0; n < a.length; n++) {
							a[n] = parseFloat(a[n]);
						}
						a.sort(function(x, y) {
							return x > y ? 1 : -1;
						});
						var l = a.length;
						var mean = a.reduce(function(x, y) {
							return x + y;
						}) / l;
						var xm = (mean - a[0]) / 2;
						var ym = ((a[l - 1] - mean) / 2) + mean;
						tr.forEach(function(row) {
							var td = $uk.$$("td", row)[i];
							var value = parseFloat(td.innerText);
							$uk.addClass(td, "uk-text-" + (value < mean ? (value > xm ? "default" : "success") : (value < ym ? "warning" : "danger")));
						});
					}

					// When a heading is clicked, sort the table
					$uk.on(table, "click", "th .label", function(e) {

						var th = e.target.parentElement;
						var cellIndex = th.cellIndex;
						var clsActive = "uk-active";
						var desc = $uk.hasClass(th, "desc");
						var tbody = $uk.$("tbody", table);

						// Show loading icon
						$uk.addClass(th, "loading");

						// Toggle classes
						if(!desc) $uk.removeClass($uk.$$("th", table), "desc");
						$uk.removeClass($uk.$$("td, th", table), clsActive);
						$uk.toggleClass(th, "desc");
						$uk.addClass(th, clsActive);

						// Add the active class to the column
						tr.forEach(function(row) {
							$uk.addClass($uk.$$("td", row)[cellIndex], clsActive);
						});

						var rows = $uk.$$("tr", tbody), x, y;
						rows.sort(function(a, b) {
							x = $uk.$$("td", a)[cellIndex].innerText.replace(/,/g, "");
							y = $uk.$$("td", b)[cellIndex].innerText.replace(/,/g, "");
							if(x == "N/A") x = 0;
							if(y == "N/A") y = 0;
							x = parseFloat(x);
							y = parseFloat(y);
							return desc ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
						});

						$uk.html(tbody, rows);

						// Hide loading icon
						$uk.removeClass(th, "loading");
					});

					// Sort by deaths (desc) by default
					$uk.trigger($uk.$$("thead tr th .label", table)[2], "click");

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
	 * Render a % title
	 *
	 * @param {string} label
	 * @param {number} number
	 * @param {number} population
	 * @return {string}
	 *
	 */
	pc: function(label, number, population) {
		return "<span title='" + ((number / population)).toFixed(5) + "%'>" + label + "</span>";
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
		return "<span class='label'" + (title ? " title='" + title + "'"  : "") + ">" +
			label + (source ? "<sup class='source'>" + source + "</sup>" : "") +
		"</span>" + "<span data-uk-spinner></span>";
	}
};

$uk.ready(function() {
	app.init();
});

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-166045926-1');
