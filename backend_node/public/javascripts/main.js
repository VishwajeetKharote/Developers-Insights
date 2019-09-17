let graphManager = {

  data : {},
  generate: function (url, type) {

    jQuery.get(url, {}, function (data) {
      let dataSet = [];
      max = 0;

      graphManager.data = data;

      for (let d of data) {
        let str = d.name.split("-").join(" ");
        dataSet.push({ name: str, size: d.stargazers_count });
        max = Math.max(max, d.stargazers_count);
      }

      drawBubbleChart(dataSet, max);

    });

  }

}

jQuery(function(){

   /**
    * Form validation code
    */

   // jQuery(window).on("load", function () {
      console.log('test')
      setTimeout(function () {
         jQuery('.loading-screen').fadeOut('normal');
      }, 1000);
   // });

   jQuery("#register-form input[type=submit]").on("click", function (e) {
      jQuery("#register-form input").addClass('listener');
    });

   jQuery("#d-register-form").on("submit",function(e){

     let flag = false;
     let inputs = {};

      jQuery(this).find("input").removeAttr('invalid');
      jQuery(this).find(".has-error").removeClass('has-error');

     console.log('sdfsdf');

      jQuery("#d-register-form").find('span').hide();

      jQuery(this).find("input").each(function () {

         let obj = jQuery(this);
         inputs[obj.attr('name')] = obj;

         // first check if inputs are empty

         if (obj.val().trim() === "") {
            showError(obj);
             flag = true;
         }

      });


      let phoneTest = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      let emailTest = /^[a-zA-Z0-9.?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (phoneTest.test(inputs['phone'].val()) === false) {
         flag = true;
         showError(inputs['phone']);
      }

      if (emailTest.test(inputs['email'].val()) === false) {
         flag = true;
         showError(inputs['email']);
      }


      if (inputs['psw'].val() !== inputs['confirm_psw'].val()) {
         showError(inputs['confirm_psw']);
         flag = true;
      }

      if(flag == true) {
         e.preventDefault();
         e.stopImmediatePropagation();

      }



   });

   function showError(obj) {
      obj.attr('invalid','true');
      obj.parent().addClass('has-error');
      obj.parent().find('span').fadeIn('fast');
   }


  jQuery(document).on('click','.graph-toggle',function(e){
            e.preventDefault();
    console.log('test')
    jQuery('.graph-view ul').hide();
    jQuery('.graph-view svg').fadeIn("normal");
    jQuery('.graph-view ul').remove();
  });

  jQuery('.menu-view nav li a').on('click',function(e){
      e.preventDefault();

      if( jQuery(this).hasClass("disabled")  ) {
            alert("This will be available in future versions !");
            return;
      }

     let loader = jQuery('.proxy-screen').html();

     jQuery('.graph-view').append(loader);

      jQuery(this).parent().addClass('active');
      jQuery('body').addClass('expand-graph');

    graphManager.generate(  jQuery(this).attr('href') , jQuery(this).data('chart')  );

  })

});

function drawBubbleChart(data, max) {

   jQuery('.graph-view').find('.loader').fadeOut('normal', function () { jQuery(this).remove() });

  let colors = ["#50cad4", "#0562d1", "#8667ff", "#0947db", "#07d89d"];
  let width = window.innerWidth - 420, height = window.innerHeight - 120;
  let svg = d3.select(".graph-view").append("svg")
     .attr("width", width)
     .attr("height", height)
    .attr("font-family", "Satisfy")
    .attr("font-size", 20)
    .attr("text-anchor", "middle");

  let pack = d3.pack()
    .size([width, height]);

  repaint(data);

  function repaint(data) {

    let transition = d3.transition() .duration(750);
    let h = d3.hierarchy({ children: data }) .sum(function (d) { return d.size; })
    let circle = svg.selectAll("circle").data(pack(h).leaves(), function (d) { return d.data.name; });
    let text = svg.selectAll("text").data(pack(h).leaves(), function (d) { return d.data.name; });

    circle
      .transition(transition)
      .style("fill", "#3a403d")
      .attr("r", function (d) { return d.r })
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })

    text
      .transition(transition)
      .attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y; });

    circle.enter().append("circle")
      .attr("id", function (d) { d.circleUniq = "circ" + Math.round(d.x) + Math.round(d.y);  return d.circleUniq; } )
      .attr("r", 0)
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .style("fill", "rgba(0,0,0,0.2)")
      .transition(d3.transition()
      .duration(Math.floor(Math.random() * 1250)  )) //Math.floor(Math.random() * 850
      .style("fill", function (d) { return colors[Math.floor(Math.random() * colors.length)];  })
      .style("opacity", 0.95)
      .attr("r", function (d) { return d.r })


      svg.selectAll("circle").on("click", function (d) {
            console.log(d.data.name)

            let o = {};

        for (let t of graphManager.data) {
             if( t.name == d.data.name ) {
                  o = t;
             }
        }

        let html = ["<li><a href='' class='graph-toggle'>Back</a></li>"];

        Object.keys(o).map(key => {
             if(typeof o[key] !== "object")
               html.push(`<li><strong>${key}</strong> : ${o[key]}</li>`);
        })

        jQuery('.graph-view svg').fadeOut("normal");
        jQuery('.graph-view').append("<ul>"+html.join("")+"</ul>");

      });

      const gObj = svg.selectAll("g") .data(h.leaves()).join("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

      svg.selectAll("g").append("clipPath").attr("id", function (d) { d.clipPathUniqId = "clip" + Math.round(d.x) + Math.round(d.y); return d.clipPathUniqId; })
    .append("use").attr("xlink:href", d => d.circleUniq.href);

    gObj.append("text")
      .attr("fill", '#ffffff')
      .attr("clip-path", d => d.clipPathUniqId)
      .selectAll("tspan")
      .data(d => d.data.name.split(" "))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.9}em`)
      .text(d => d);

    svg.selectAll("text").attr("opacity", 0).transition(transition).attr("opacity", 1);

    svg.selectAll("text").on("click", function (d) {
      console.log(d.data.name)

      let o = {};

      for (let t of graphManager.data) {
        if (t.name == d.data.name) {
          o = t;
        }
      }

      let html = ["<li><a href='' class='graph-toggle'>Back</a></li>"];

      Object.keys(o).map(key => {
        if (typeof o[key] !== "object")
          html.push(`<li><strong>${key}</strong> : ${o[key]}</li>`);
      })

      jQuery('.graph-view svg').fadeOut("normal");
      jQuery('.graph-view').append("<ul>" + html.join("") + "</ul>");

    });


  }

}

