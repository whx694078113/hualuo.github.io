
var $ = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}


var Calendar = Class.create();
Calendar.prototype = {
  initialize: function(container, options) {
    this.Container = $(container);
    this.Days = [];
    
    this.SetOptions(options);
    
    this.Year = this.options.Year || new Date().getFullYear();
    this.Month = this.options.Month || new Date().getMonth() + 1;
    this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
    this.onSelectDay = this.options.onSelectDay;
    this.onToday = this.options.onToday;
    this.onFinish = this.options.onFinish;  
    
    this.Draw();
  },

  SetOptions: function(options) {
    this.options = {
        Year:           0,
        Month:          0,
        SelectDay:      null,
        onSelectDay:    function(){},
        onToday:        function(){},
    };
    Extend(this.options, options || {});
  },

  NowMonth: function() {
    this.PreDraw(new Date());
  },

  PreMonth: function() {
    this.PreDraw(new Date(this.Year, this.Month - 2, 1));
  },

  NextMonth: function() {
    this.PreDraw(new Date(this.Year, this.Month, 1));
  },

  PreYear: function() {
    this.PreDraw(new Date(this.Year - 1, this.Month - 1, 1));
  },

  NextYear: function() {
    this.PreDraw(new Date(this.Year + 1, this.Month - 1, 1));
  },

  PreDraw: function(date) {

    this.Year = date.getFullYear(); this.Month = date.getMonth() + 1;
    
    this.Draw();
  },

  Draw: function() {

    var arr = [];

    for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++){ arr.push(0); }

    for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++){ arr.push(i); }

    this.Days = [];

    var frag = document.createDocumentFragment();
    while(arr.length){

        var row = document.createElement("tr");
        for(var i = 1; i <= 7; i++){
            var cell = document.createElement("td"); cell.innerHTML = "&nbsp;";
            if(arr.length){
                var d = arr.shift();
                if(d){
                    cell.innerHTML = d;
                    this.Days[d] = cell;
                    var on = new Date(this.Year, this.Month - 1, d);
            
                    this.IsSame(on, new Date()) && this.onToday(cell);
            
                    this.SelectDay && this.IsSame(on, this.SelectDay) && this.onSelectDay(cell);
                }
            }
            row.appendChild(cell);
        }
        frag.appendChild(row);
    }

    while(this.Container.hasChildNodes()){ this.Container.removeChild(this.Container.firstChild); }
    this.Container.appendChild(frag);

    this.onFinish();
  },

  IsSame: function(d1, d2) {
    return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
  } 
}
