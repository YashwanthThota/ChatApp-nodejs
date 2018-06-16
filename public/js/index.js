$( window ).on('load',function() {
  $.get( "/rooms", function( data ) {
    var list = " "
    // list += "<option value='pick'>pick a room</option>";
       //data is an array of rooms
       //this function prints the array one by one
        data.forEach(function(room){
          console.log(room)
          list += "<option value='" + room + "'>"+room +"</option>";
          //$('#selectroom').html(list);
        });
         $('#selectroom').html(list);
      });
});

$('#room').on('input',function(e){
  if ($(this).val().length > 0){
    $( "#selectroom" ).prop( "disabled", "disabled" );
  }else{
    $( "#selectroom" ).prop( "disabled", false );
  }
});

$('#selectroom')
  .change(function() {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text();
       if (str === 'pick a room'){
        $( '#room' ).prop( "disabled", false );
      }else{
         $( '#room' ).prop( "disabled", "disabled" );
      }
    });
  });
