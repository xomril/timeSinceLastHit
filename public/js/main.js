let citiesData = [];
function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let txt;
    if(rhours > 0){
        txt =  " עברו "  + rhours + " שעות ו-" + rminutes + " דקות מאז הנפילה האחרונה.";
    } else {
        txt =  " עברו " + rminutes + " דקות מאז הנפילה האחרונה.";
    }
    return txt.replace('ו-0 דקות','');
    }

function showLastHit(v){
    if(v == 'רשימת מקומות') {
        $("#lastHit").html("");
        return;
    }
    var val = timeConvert(v);
   

    $("#lastHit").html(val)
}
function loadEvents(){

    let url="/getCities";
   


    $.getJSON(url,function(response){
        cities = response;
        
        for(let item in cities) {
            citiesData.push(cities[item]);
        }

        sortedEvents = citiesData.sort(function (a, b) {
            if(a.lastHit < b.lastHit) return -1;
            if(a.lastHit > b.lastHit) return 1;
            return 0;
        });
        $('#city').html('<option class="unselect">רשימת מקומות</option');
        citiesData.forEach((item)=>{
            $('#city').append(`<option value='${item.lastHit}'>${item.name}</option>`)
        })
    });
}