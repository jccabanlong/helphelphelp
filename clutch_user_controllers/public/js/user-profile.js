$(document).ready(function(){
     $('#create').click(function(){
        $('#event-modal').modal('show');    
     });
});
$(document).ready(function(){
     $('#updateButton').click(function(){
        $('#update-modal').modal('show');    
     });
});

$(document).ready(function(){
     $('.ui.button.delete').click(function(){
        $('#delete-modal').modal('show');    
     });
});

$(document).ready(function(){
     $('#submit-create').click(function(){
        $('#event-modal').modal('hide');    
     });
});
$(document).ready(function(){
     $('#cancel-create').click(function(){
        $('#event-modal').modal('hide');    
     });
});
$(document).ready(function(){
     $('#interest').click(function(){
        $('#interest-modal').modal('show');    
     });
});

