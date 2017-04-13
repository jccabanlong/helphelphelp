$(document)
    .ready(function() {
      $('.ui.form')
        .form({
          fields: {
            username: {
              identifier  : 'username',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your username'
                }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your password'
                }
              ]
            },
			email: {
              identifier  : 'email',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your e-mail'
                },
                {
                  type   : 'email',
                  prompt : 'Please enter a valid e-mail'
                }
              ]
            },
			firstname: {
              identifier  : 'firstname',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your firstname'
                }
              ]
            },
			lastname: {
              identifier  : 'lastname',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your lastname'
                }
              ]
            },
      gender: {
              identifier  : 'gender',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select your gender'
                }
              ]
            },
      usertype: {
              identifier  : 'usertype',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select your usertype'
                }
              ]
            },
      weight: {
              identifier  : 'weight',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your weight'
                }
              ]
            },
      height: {
              identifier  : 'height',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your height'
                }
              ]
            },
      age: {
              identifier  : 'age',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your age'
                },
                {
                  type   : 'integer',
                  prompt : 'Please enter a valid age'
                }
              ]
            },
      contactno: {
              identifier  : 'contactno',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your contactno'
                },
                {
                  type   : 'integer',
                  prompt : 'Please valid a contact number'
                }
              ]
            },
      college: {
              identifier  : 'college',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your college'
                }
              ]
            },

        },   
		  inline : true,
	   	on     : 'blur'
        })
      ;
    })
  ;

$('select.dropdown')
  .dropdown()
;
