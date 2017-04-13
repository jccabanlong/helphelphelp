$(document).ready(function() {
    $(".ui.form").form({
        fields: {
            username: {
                identifier  : "username",
                rules: [
                    {
                        type   : "empty",
                        prompt : "Please enter your username"
                    }
                ]
            },
            password: {
                identifier  : "password",
                rules: [
                    {
                        type   : "empty",
                        prompt : "Please enter your password"
                    }
                ]
            },
        },
        inline : true,
        on     : "blur"
    });


    $("select.dropdown").dropdown();
    $("#page-navigation").hide();
    $("#page-footer").hide();

    $("#register-trigger").click(function(){
        $("#login-div").slideUp("fast");
        $("#register-div").slideDown("fast");
    });

    $("#login-trigger").click(function(){
        $("#login-div").slideDown("fast");
        $("#register-div").slideUp("fast");
    });


});
