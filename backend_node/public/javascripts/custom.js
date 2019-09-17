const chartManager = {
   codes: {},
   bar: function (selector, data, max, params) {

      const margin = { top: 20, left: 80, right: 60, bottom: 120 };
      let width = window.innerWidth - 250, height = 500;

      if (params.width) {
         width = params.width - 0;
      }


      let svg = null;

      if (jQuery(selector + ' svg').length > 0) {
         jQuery(selector + ' svg').remove();
      }

      svg = d3.select(selector).append("svg");


      svg.attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom);

      const chart = svg.append('g')
         .attr("width", width)
         .attr("height", height)
         .attr("font-family", "Lato")
         .attr("font-size", 20)

         .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // x , y

      const Y = d3.scaleLinear()
         .range([height, 0])
         .domain([0, max]);
      const X = d3.scaleBand()
         .range([0, width])
         .domain(data.map((rowset) => rowset.name))
         .padding(0.2);

      var div = d3.select('body').append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);


      chart.append('g')
         .attr('transform', `translate(0,0)`)
         .call(d3.axisLeft(Y));

      chart.append('g')
         .attr('transform', `translate(0, ${height})`)
         .call(d3.axisBottom(X)).selectAll("text")
         .attr("y", 0)
         .attr("x", 0)
         .attr("dy", "15")
         .attr("transform", "rotate(30)")
         .style("text-anchor", "start");

      chart.selectAll()
         .data(data)
         .enter()

         .append('rect')
         .attr('opacity', 1)
         .attr('x', (s) => X(s.name))
         .attr('y', (s) => Y(s.value))
         .attr('height', (s) => height - Y(s.value))
         .attr('width', X.bandwidth()).on("mouseover", function (d) {
            console.log(d3.event.pageY, d3.event.offsetY)
            div.transition()
               .duration(200)
               .style("opacity", .9);
            div.html(params.template(d))
               .style("left", (d3.event.pageX - 75) + "px")
               .style("top", (d3.event.pageY - 100) + "px");
         })
         .on("mouseout", function (d) {

            div.transition()
               .duration(500)
               .style("opacity", 0);
         });

      chart.selectAll('rect')
         .on('mouseenter', function (actual, i) {
            d3.select(this).transition()
               .duration(300).attr('opacity', 0.5);
         })
         .on('mouseleave', function (actual, i) {
            d3.select(this).transition()
               .duration(300).attr('opacity', 1);
         }).on("click", function (d) {

            if (jQuery('#graph-users').length > 0 )
            window.location.href = '/user/'+d.name;
         });

      chart.append('text')
         .attr('x', -(height / 2) - 20)
         .attr('y', margin.top / 2.4 - 80)
         .attr('transform', 'rotate(-90)')
         .attr('text-anchor', 'middle')
         .text(params.yLabel);

      chart.append('text')
         .attr('x', width / 2 + margin.left)
         .attr('y', height + margin.top + 95)
         .attr('text-anchor', 'middle')
         .text(params.xLabel)
   },

   world: function (selector, data) {

      var width = 960,
         height = 500,
         centered;

      var map = new Datamap({
         element: document.getElementById(selector),
         projection: 'mercator',
         done: function (datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
               let c = geography.properties.name;
               if (c == "United States of America") {
                  c = "US";
               }


               jQuery.post('/api/popular-users', { country: c }, function (data) {

                  let temp = [];
                  for (user of data) {
                     temp.push('<li><a href="/user/' + user.login + '"><img src="' + user.avatar_url + '" alt="avatar" /> <h4>' + user.login + '</h4></a></li>');
                  }

                  jQuery('#popular-users h3').html("Showing popular users in " + geography.properties.name);
                  jQuery('#popular-users ul').html(temp.join(""));
                  jQuery('#popular-users').fadeIn('normal');
               });

            });
         },
         geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            borderColor: 'rgba(103,109,128,1)',
            borderWidth: 0.5,
            popupTemplate: function (geo, data) {
               return ['<div class="hoverinfo"><strong>',
                  'Number of users in ' + geo.properties.name,
                  ': ' + data.value,
                  '</strong></div>'].join('');
            }

         },
         fills: {
            defaultFill: 'rgba(139,176,206,0.3)',
            "10000-20000": '#127eda',
            "5000-10000": '#36b6dc',
            "1000-5000": '#5ab7da',
            "100-1000": '#90c9de',
            UNKNOWN: 'rgb(0,0,0)',
         },
         data: data,

      });
      map.legend();


   },

   line: function (selector, data, max, params) {

      let languages = Object.keys(data);

      const margin = { top: 20, left: 80, right: 20, bottom: 60 };
      const width = window.innerWidth - 250, height = 500;

      const xScale = d3.scaleBand()
         .range([0, width])
         .domain(data[languages[0]].map((d) => d.year))
         .padding(1);

      var yScale = d3.scaleLinear()
         .domain([0, max])
         .range([height, 0]);

      var line = d3.line()
         .x(function (d, i) { return xScale(d.year); })
         .y(function (d) { return yScale(d.val); })
         .curve(d3.curveMonotoneX)


      var svg = d3.select(selector).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("font-family", "Lato")
         .attr("font-size", 20)
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append('g')
         .attr('transform', `translate(0, ${height})`)
         .call(d3.axisBottom(xScale));

      svg.append("g")
         .attr("class", "y axis")
         .call(d3.axisLeft(yScale));

      var div = d3.select('body').append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);



      let i = 0;
      let colors = ["rgb(204, 49, 49)", "rgb(202, 86, 166)", "rgb(163, 36, 216)", "rgb(160, 99, 226)", "rgb(80, 36, 216)", "rgb(105, 126, 206)", "rgb(57, 197, 191)", "rgb(57, 197, 113)", "rgb(154, 218, 106)", "rgb(222, 243, 50)", "rgb(214, 159, 34)", "rgb(255, 134, 10)"];

      jQuery('.legend ul').html('');
      let legends = '';
      languages.forEach(l => {

         let dataset = data[l];

         legends += `<li class='clearfix'> <span style="background-color:${colors[i]}"></span>
                     <h4>${l}</h4>
                  </li>`;

         svg.append("path")
            .datum(dataset)
            .attr("stroke", colors[i])
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", line);

         svg.selectAll(".dot-" + i)
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("fill", colors[i])
            .attr("cx", function (d, i) { return xScale(d.year) })
            .attr("cy", function (d) { return yScale(d.val) })
            .attr("r", 7)
            .on("mouseover", function (d) {

               div.transition()
                  .duration(200)
                  .style("opacity", .9);
               div.html(params.template(d))
                  .style("left", (d3.event.pageX - 75) + "px")
                  .style("top", (d3.event.pageY - 100) + "px");
            })
            .on("mouseout", function (d) {
               div.transition()
                  .duration(500)
                  .style("opacity", 0);
            });

         i++;
      });
      jQuery('.legend ul').html(legends);



      svg.append('text')
         .attr('x', width / 2 + 6)
         .attr('y', height + margin.top + 35)
         .attr('text-anchor', 'middle')
         .text('Years →');

      svg.append('text')
         .attr('x', -(height / 2) - 20)
         .attr('y', margin.top / 2.4 - 80)
         .attr('transform', 'rotate(-90)')
         .attr('text-anchor', 'middle')
         .text('Number of Users →')

   },


   pie: function (selector, data, params = {}) {

      const margin = { top: 20, left: 80, right: 20, bottom: 60 };
      const width = window.innerWidth * 0.45 - 250, height = 500, r = width / 2 - 100;

      let legend = jQuery(selector).parent().find('.legend ul');
      let colors = ["#127eda", "#36b6dc", "#5ab7da",
         "#90c9de", "#a6d854", "#ffd92f"];

      if (params.colors)
         colors = params.colors;

      let temp = [];

      for (let i = 0; i < data.length; i++) {
         temp.push(`<li> <span style="background:${colors[i]}"></span>
                              <h4>${data[i].label}</h4>
                           </li>`);
      }

      legend.html(temp.join(''));

      const svg = d3.select(selector)
         .append("svg")
         .attr("width", width)
         .attr("height", height)
         .append("g")
         .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(colors);

      const pie = d3.pie()
         .value(d => d.value)
         .sort(null);

      let tooltip = d3.select(selector)
         .append('div')
         .attr('class', 'tooltip');

      const arc = d3.arc()
         .innerRadius(r)
         .outerRadius(0);

      const path = svg.selectAll("path")
         .data(pie(data));

      tooltip.append('div')
         .attr('class', 'label');

      tooltip.append('div')
         .attr('class', 'percent');

      // Enter new arcs
      path.enter().append("path")
         .attr("fill", (d, i) => color(i))
         .attr("d", arc)
         .attr("stroke", "rgba(255,255,255,0.2)")
         .attr("stroke-width", "1px")
         .each(function (d) { this._current = d; })
         .on('mouseover', function (d) {
            var total = d3.sum(data.map(function (d) {
               return (d.value) ? d.value : 0;
            }));

            console.log(total);
         var percent = Math.round(1000 * d.data.value / total) / 10;
         tooltip.select('.label').html(d.data.label.toUpperCase());
         tooltip.select('.percent').html(percent + '%');

         tooltip.style('display', 'block');
         tooltip.style('opacity', 2);

      }).on('mousemove', function (d) {
         tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX - 25) + 'px');
      }).on('mouseout', function () {
         tooltip.style('display', 'none');
         tooltip.style('opacity', 0);
      });
   }


}

jQuery(function () {

   jQuery(document).on('click', '#popular-users .close', function (e) {
      e.preventDefault();

      jQuery('#popular-users').fadeOut('normal');
   })

   if (document.querySelector('#graph')) {

      let values = [], tempvalues = [], max = 0;
      let languages = new Set();

      jQuery(document).on('change', '#language-filter', function (e) {
         let l = jQuery(this).val();

         window.localStorage.setItem('user-lg-' + jQuery('body').data('id'), l);

         let fvalues = [];
         max = 0;
         for (let t of values) {

            if (l == '') {
               max = Math.max(max, t.value);
               fvalues.push(t);
               continue;
            }

            if (t.language != null && l == t.language) {
               max = Math.max(max, t.value);
               fvalues.push(t);
            }
         }



         chartManager.bar('#graph', fvalues, max, {
            yLabel: 'Number of Stars →', xLabel: 'Github Repositories →',
            template: (d) => { return `${d.name} has ${d.value} stars`; },
            languages: Array.from(languages),
            filter: l
         });

      });

      jQuery.get('/api/projects', function (data) {



         jQuery('#graph').html('');
         for (let repo of data) {
            values.push({
               name: repo.name, value: repo.stargazers_count,
               language: repo.language == null ? 'misc' : repo.language
            });
            max = Math.max(max, repo.stargazers_count);


            languages.add(repo.language == null ? 'misc' : repo.language);
         }

         let k = window.localStorage.getItem('user-lg-' + jQuery('body').data('id'));


         for (let l of languages) {
            let s = '';
            if (k && k == l)
               s = 'selected="selected"';

            jQuery('#language-filter').append(`<option ${s} value="${l}">${l}</option>`);
         }

         tempvalues = values;

         if (k && k != '') {
            tempvalues = [];
            max = 0;
            for (let t of values) {

               if (k == t.language) {
                  max = Math.max(max, t.value);
                  tempvalues.push(t);
               }
            }
         }

         chartManager.bar('#graph', [...tempvalues], max, {
            yLabel: 'Number of Stars →', xLabel: 'Github Repositories →',
            template: (d) => { return `${d.name} has ${d.value} stars`; },
            languages: Array.from(languages)
         });

      });

   }

   if (document.querySelector('#user-repo-graph')) {

      let values = [], tempvalues = [], max = 0;

      for (let repo of repos) {
         values.push({
            name: repo.name, value: repo.stargazers_count
         });
         max = Math.max(max, repo.stargazers_count);
      }
      chartManager.bar('#user-repo-graph', values, max, {
         yLabel: 'Number of Stars →', xLabel: 'Github Repositories →',
         template: (d) => { return `${d.name} has ${d.value} stars`; },
         languages: [] , width : window.innerWidth * 0.6
      });

   }

if (document.querySelector('#graph-users')) {

   jQuery.get('/api/users', function (data) {

      let values = [], max = 0;

      for (let user of data) {
         values.push({ name: user.name, value: user.followers });
         max = Math.max(max, user.followers);
      }

      chartManager.bar('#graph-users', values, max, {
         yLabel: 'Number of Followers →', xLabel: 'Github Users →',
         template: (d) => { return `${d.name} has ${d.value} followers`; }
      });

   });

}



if (document.querySelector('#graph-world')) {

   jQuery.get('/api/country', function (data) {

      let dataset = {
         '100-1000': [],
         '1000-5000': [],
         '5000-10000': [],
         '10000-20000': []
      }

      for (let d of data) {

         if (d.country == 'Other Country (Not Listed Above)')
            continue;


         let code = chartManager.codes[d.country.toUpperCase()], key;

         if (!code)
            continue;

         if (0 >= d.value && d.value <= 100) {
            key = '0-100';
         } else if (100 >= d.value && d.value <= 1000) {
            key = '100-1000';
         } else if (1000 >= d.value && d.value <= 5000) {
            key = '1000-5000';
         } else if (5000 >= d.value && d.value <= 10000) {
            key = '5000-10000';
         } else {
            key = '10000-20000';
         }

         dataset[code] = {
            fillKey: key,
            value: d.value
         }
      }

      console.log(dataset)

      chartManager.world('graph-world', dataset);

   });

}

if (document.querySelector('#pie1')) {

   chartManager.pie('#pie1', [
      { label: 'Repositories', value: metadata.public_repos },
      { label: 'Gist', value: metadata.public_gists },
   ]);
}

if (document.querySelector('#pie2')) {

   chartManager.pie('#pie2', [
      { label: 'Followers', value: metadata.followers },
      { label: 'Following', value: metadata.following },
   ]);
}


if (document.querySelector('#graph-top-languages')) {



   jQuery.get('/api/languages', function (data) {

      if (jQuery('.pie-year').length > 0  ) {

         let rtrans = {};

         for(let row of data.data) {
            rtrans[row.year] = {...row};
            delete rtrans[row.year]['year'];
         }

         jQuery('.pie-year').each(function() {

            let year = jQuery(this).data('year');
            let ydata = [];

            for(let key in rtrans[year]) {
               ydata.push({ label : key ,  value: rtrans[year][key] });
            }

            console.log('#' + jQuery(this).attr('id'), ydata)

            chartManager.pie('#' + jQuery(this).attr('id'), ydata, { colors: ["rgb(204, 49, 49)", "rgb(202, 86, 166)", "rgb(163, 36, 216)", "rgb(160, 99, 226)", "rgb(80, 36, 216)", "rgb(105, 126, 206)", "rgb(57, 197, 191)", "rgb(57, 197, 113)", "rgb(154, 218, 106)", "rgb(222, 243, 50)", "rgb(214, 159, 34)", "rgb(255, 134, 10)"] });

         });

      }

      let transForm = {};
      let max = 0;
      let languages = Object.keys(data.data[0]);
      for (let l of languages) { if (l != "year") transForm[l] = []; }

      for (let row of data.data) {
         for (let l of languages) {
            if (l != "year") {
               transForm[l].push({ year: row.year + "", val: row[l] });
               max = Math.max(max, row[l]);
            }
         }
      }

      chartManager.line('#graph-top-languages', transForm, max, {

         template: (d) => { return `Numbers of repositories ${d.val} in ${d.year}`; }

      });

   });



}

})
chartManager.codes = JSON.parse(`{"null":null,"AFGHANISTAN":"AFG","ALBANIA":"ALB","ALGERIA":"ALG","AMERICAN SAMOA":"ASA","ANDORRA":"AND","ANGOLA":"ANG","ANGUILLA":"AIA","ANTARCTICA":null,"ANTIGUA AND BARBUDA":"ANT","ARGENTINA":"ARG","ARMENIA":"ARM","ARUBA":"ARU","AUSTRALIA":"AUS","AUSTRIA":"AUT","AZERBAIJAN":"AZE","BAHAMAS":"BAH","BAHRAIN":"BRN","BANGLADESH":"BAN","BARBADOS":"BAR","BELARUS":"BLR","BELGIUM":"BEL","BELIZE":"BIZ","BENIN":"BEN","BERMUDA":"BER","BHUTAN":"BHU","BOLIVIA(PLURINATIONAL STATE OF)":"BOL","BONAIRE, SINT EUSTATIUS AND SABA":"AHO","BOSNIA AND HERZEGOVINA":"BIH","BOTSWANA":"BOT","BOUVET ISLAND":null,"BRAZIL":"BRA","BRITISH INDIAN OCEAN TERRITORY":null,"VIRGIN ISLANDS(BRITISH)":"IVB","BRUNEI DARUSSALAM":"BRU","BULGARIA":"BUL","BURKINA FASO":"BUR","BURUNDI":"BDI","CABO VERDE":"CPV","CAMBODIA":"CAM","CAMEROON":"CMR","CANADA":"CAN","CAYMAN ISLANDS":"CAY","CENTRAL AFRICAN REPUBLIC":"CAF","CHAD":"CHA","CHILE":"CHI","CHINA":"CHN","HONG KONG":"HKG","MACAO":"MAC","CHRISTMAS ISLAND":null,"COCOS(KEELING) ISLANDS":null,"COLOMBIA":"COL","COMOROS":"COM","CONGO":"CGO","COOK ISLANDS":"COK","COSTA RICA":"CRC","CROATIA":"CRO","CUBA":"CUB","CURAÇAO":null,"CYPRUS":"CYP","CZECHIA":"CZE","CÔTE D'IVOIRE":"CIV","KOREA (THE DEMOCRATIC PEOPLE’S REPUBLIC OF)":"PRK","CONGO (THE DEMOCRATIC REPUBLIC OF THE)":"COD","DENMARK":"DEN","DJIBOUTI":"DJI","DOMINICA":"DMA","DOMINICAN REPUBLIC":"DOM","ECUADOR":"ECU","EGYPT":"EGY","EL SALVADOR":"ESA","EQUATORIAL GUINEA":"GEQ","ERITREA":"ERI","ESTONIA":"EST","ETHIOPIA":"ETH","FAROE ISLANDS":"FAR","FIJI":"FIJ","FINLAND":"FIN","FRANCE":"FRA","FRENCH GUIANA":"FGU","FRENCH POLYNESIA":"FPO","FRENCH SOUTHERN TERRITORIES":null,"GABON":"GAB","GAMBIA":"GAM","GEORGIA":"GEO","GERMANY":"DEU","GHANA":"GHA","GIBRALTAR":"GIB","GREECE":"GRE","GREENLAND":"GRL","GRENADA":"GRN","GUADELOUPE":"GUD","GUAM":"GUM","GUATEMALA":"GUA","GUERNSEY":null,"GUINEA":"GUI","GUINEA-BISSAU":"GBS","GUYANA":"GUY","HAITI":"HAI","HEARD ISLAND AND MCDONALD ISLANDS":null,"HOLY SEE":null,"HONDURAS":"HON","HUNGARY":"HUN","ICELAND":"ISL","INDIA":"IND","INDONESIA":"INA","IRAN (ISLAMIC REPUBLIC OF)":"IRI","IRAQ":"IRQ","IRELAND":"IRL","ISLE OF MAN":null,"ISRAEL":"ISR","ITALY":"ITA","JAMAICA":"JAM","JAPAN":"JPN","JERSEY":null,"JORDAN":"JOR","KAZAKHSTAN":"KAZ","KENYA":"KEN","KIRIBATI":"KIR","KUWAIT":"KUW","KYRGYZSTAN":"KGZ","LAO PEOPLE’S DEMOCRATIC REPUBLIC":"LAO","LATVIA":"LAT","LEBANON":"LIB","LESOTHO":"LES","LIBERIA":"LBR","LIBYA":"LBA","LIECHTENSTEIN":"LIE","LITHUANIA":"LTU","LUXEMBOURG":"LUX","MADAGASCAR":"MAD","MALAWI":"MAW","MALAYSIA":"MAS","MALDIVES":"MDV","MALI":"MLI","MALTA":"MLT","MARSHALL ISLANDS":"MSH","MARTINIQUE":"MRT","MAURITANIA":"MTN","MAURITIUS":"MRI","MAYOTTE":"MAY","MEXICO":"MEX","MICRONESIA (FEDERATED STATES OF)":"FSM","MONACO":"MON","MONGOLIA":"MGL","MONTENEGRO":"MGO","MONTSERRAT":"MNT","MOROCCO":"MAR","MOZAMBIQUE":"MOZ","MYANMAR":"MYA","NAMIBIA":"NAM","NAURU":"NRU","NEPAL":"NEP","NETHERLANDS":"NED","NEW CALEDONIA":"NCD","NEW ZEALAND":"NZL","NICARAGUA":"NCA","NIGER":"NIG","NIGERIA":"NGR","NIUE":"NIU","NORFOLK ISLAND":"NFI","NORTHERN MARIANA ISLANDS":"NMA","NORWAY":"NOR","OMAN":"OMA","PAKISTAN":"PAK","PALAU":"PLW","PANAMA":"PAN","PAPUA NEW GUINEA":"PNG","PARAGUAY":"PAR","PERU":"PER","PHILIPPINES":"PHI","PITCAIRN":null,"POLAND":"POL","PORTUGAL":"POR","PUERTO RICO":"PUR","QATAR":"QAT","KOREA (THE REPUBLIC OF)":"KOR","MOLDOVA (THE REPUBLIC OF)":"MDA","ROMANIA":"ROU","RUSSIAN FEDERATION":"RUS","RWANDA":"RWA","RÉUNION":"REU","SAINT BARTHÉLEMY":null,"SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA":"HEL","SAINT KITTS AND NEVIS":"SKN","SAINT LUCIA":"LCA","SAINT MARTIN (FRENCH PART)":null,"SAINT PIERRE AND MIQUELON":"SPM","SAINT VINCENT AND THE GRENADINES":"VIN","SAMOA":"SAM","SAN MARINO":"SMR","SAO TOME AND PRINCIPE":"STP","SAUDI ARABIA":"KSA","SENEGAL":"SEN","SERBIA":"SRB","SEYCHELLES":"SEY","SIERRA LEONE":"SLE","SINGAPORE":"SIN","SINT MAARTEN (DUTCH PART)":null,"SLOVAKIA":"SVK","SLOVENIA":"SLO","SOLOMON ISLANDS":"SOL","SOMALIA":"SOM","SOUTH AFRICA":"RSA","SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS":null,"SOUTH SUDAN":null,"SPAIN":"ESP","SRI LANKA":"SRI","PALESTINE, STATE OF":"PLE","SUDAN":"SUD","SURINAME":"SUR","SVALBARD AND JAN MAYEN":null,"SWAZILAND":"SWZ","SWEDEN":"SWE","SWITZERLAND":"SUI","SYRIAN ARAB REPUBLIC":"SYR","TAJIKISTAN":"TJK","THAILAND":"THA","MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)":"MKD","TIMOR-LESTE":"TLS","TOGO":"TOG","TOKELAU":null,"TONGA":"TGA","TRINIDAD AND TOBAGO":"TTO","TUNISIA":"TUN","TURKEY":"TUR","TURKMENISTAN":"TKM","TURKS AND CAICOS ISLANDS":"TKS","TUVALU":"TUV","UGANDA":"UGA","UKRAINE":"UKR","UNITED ARAB EMIRATES":"UAE","UNITED KINGDOM":"GBR","TANZANIA, UNITED REPUBLIC OF":"TAN","UNITED STATES MINOR OUTLYING ISLANDS":null,"VIRGIN ISLANDS (U.S.)":"ISV","UNITED STATES":"USA","URUGUAY":"URU","UZBEKISTAN":"UZB","VANUATU":"VAN","VENEZUELA (BOLIVARIAN REPUBLIC OF)":"VEN","VIET NAM":"VIE","WALLIS AND FUTUNA":"WAF","WESTERN SAHARA":null,"YEMEN":"YEM","ZAMBIA":"ZAM","ZIMBABWE":"ZIM","ÅLAND ISLANDS":null}`);
